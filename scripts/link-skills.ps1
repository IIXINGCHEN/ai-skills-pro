# PowerShell script to link skills to user agent directories
$ErrorActionPreference = "Stop"

$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$homeDir = [Environment]::GetFolderPath("UserProfile")
$targets = @(
  "$homeDir\.agents\skills",
  "$homeDir\.claude\skills"
)

$buckets = @("engineering", "productivity", "design")

foreach ($t in $targets) {
  if (-not (Test-Path $t)) {
    New-Item -ItemType Directory -Force -Path $t | Out-Null
    Write-Host "Created target directory: $t"
  }
}

foreach ($b in $buckets) {
  $bucketPath = Join-Path $rootDir "skills\$b"
  if (Test-Path $bucketPath) {
    $skills = Get-ChildItem -Directory -Path $bucketPath
    foreach ($s in $skills) {
      foreach ($t in $targets) {
        $linkPath = Join-Path $t $s.Name
        if (Test-Path $linkPath) {
          Remove-Item -Recurse -Force $linkPath
        }
        try {
          New-Item -ItemType SymbolicLink -Path $linkPath -Target $s.FullName -Force | Out-Null
          Write-Host "Linked (Symlink) $($s.Name) -> $linkPath"
        } catch {
          New-Item -ItemType Junction -Path $linkPath -Target $s.FullName -Force | Out-Null
          Write-Host "Linked (Junction) $($s.Name) -> $linkPath"
        }
      }
    }
  }
}

Write-Host "All skills linked successfully!"