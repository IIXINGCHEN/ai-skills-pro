# PowerShell script to link skills to user agent directories.
#
# Safety rules this script must keep:
#   1. A target entry is only ever replaced when it is a reparse point
#      (symlink or junction). A real directory is refused, never deleted.
#   2. Replacing a reparse point deletes the link itself, never its target.
#      `Remove-Item -Recurse` follows a junction into its target on Windows
#      PowerShell, which would wipe the skill the link points at.
#   3. Targets that resolve to the same real directory are collapsed to one.
#      `~/.agents/skills` is commonly a symlink to `~/.claude/skills`; linking
#      both would process every skill twice and delete the link just created.
$ErrorActionPreference = "Stop"

$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$homeDir = [Environment]::GetFolderPath("UserProfile")
$targets = @(
  "$homeDir\.agents\skills",
  "$homeDir\.claude\skills"
)

$buckets = @("engineering", "productivity", "design")

# Resolve each target to the real directory it points at, creating it when
# missing, and drop duplicates so aliased targets are processed once.
$resolvedTargets = @()
foreach ($t in $targets) {
  if (-not (Test-Path -LiteralPath $t)) {
    New-Item -ItemType Directory -Force -Path $t | Out-Null
    Write-Host "Created target directory: $t"
  }
  $item = Get-Item -LiteralPath $t -Force
  $real = $item.FullName
  if ($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) {
    $linkTarget = $item.Target
    if ($linkTarget -is [array]) { $linkTarget = $linkTarget[0] }
    if ($linkTarget) { $real = [System.IO.Path]::GetFullPath($linkTarget) }
  }
  if ($resolvedTargets -notcontains $real) {
    $resolvedTargets += $real
    Write-Host "Target resolved: $t -> $real"
  } else {
    Write-Host "Target skipped (already resolved): $t -> $real"
  }
}

function Remove-LinkIfPresent([string]$path) {
  $item = Get-Item -LiteralPath $path -Force -ErrorAction SilentlyContinue
  if ($null -eq $item) { return }
  if (-not ($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint)) {
    throw "Refusing to replace a real directory (not a link): $path"
  }
  # Delete the reparse point itself; the link target is left untouched.
  [System.IO.Directory]::Delete($path, $false)
}

$symlinkCount = 0
$junctionCount = 0

foreach ($t in $resolvedTargets) {
  foreach ($b in $buckets) {
    $bucketPath = Join-Path $rootDir "skills\$b"
    if (-not (Test-Path -LiteralPath $bucketPath)) { continue }
    foreach ($s in (Get-ChildItem -Directory -Path $bucketPath)) {
      $linkPath = Join-Path $t $s.Name
      Remove-LinkIfPresent $linkPath
      try {
        New-Item -ItemType SymbolicLink -Path $linkPath -Target $s.FullName -Force | Out-Null
        Write-Host "Linked (Symlink) $($s.Name) -> $linkPath"
        $symlinkCount++
      } catch {
        New-Item -ItemType Junction -Path $linkPath -Target $s.FullName -Force | Out-Null
        Write-Host "Linked (Junction) $($s.Name) -> $linkPath"
        $junctionCount++
      }
    }
  }
}

Write-Host "Symlinked: $symlinkCount, Junctioned: $junctionCount"
Write-Host "All skills linked successfully!"
