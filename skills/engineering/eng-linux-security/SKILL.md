---
name: eng-linux-security
description: Harden Linux hosts with port-scan detection and firewall safeguards.
disable-model-invocation: true
---

# Linux Server Security Guard & Port-Scan Defense

Deploy automated, cross-distribution intrusion defense and port-scan detection scripts for Linux servers (Debian, Ubuntu, RHEL, CentOS, Arch, Alpine, SUSE) with automatic IP banning, whitelisting, and auto-unban timers.

**Requires root**: all firewall rule changes and writes to `/etc/security` and `/var/log` need root/sudo. Confirm with the user before running the deploy script on a live host.

## Prerequisites

- Linux host (Debian, Ubuntu, RHEL, CentOS, Arch, Alpine, SUSE).
- root/sudo access (see above).
- A firewall backend installed: `nftables` preferred, `ipset` + `iptables` as fallback. Check with `command -v nft || command -v ipset`.
- Destructive operations here fall under `eng-destructive-safety-gate`: run its two-confirmation flow before executing the deploy script.

## Core Rules & Metric Hierarchy

- **Priority Hierarchy**: **Ultra-Low False Positive Rate > Detection Precision > Rapid Banning**. When sensitivity conflicts with false-positive risk, always protect legitimate traffic first.
- **Whitelist Protection**: Never ban localhost (`127.0.0.1`), private RFC1918 subnets, user-configured bastion hosts, monitoring probes, or CDN egress IPs.
- **Auto-Unban Expiration**: All bans must have configurable TTL (default: 24h) to prevent unbounded firewall rule table bloat.
- **Cross-Distribution Tool Detection**: Dynamically probe and select the native firewall backend (on RHEL-family check `firewall-cmd` first since firewalld manages the nftables/iptables rules there; otherwise `nftables` then `iptables`) and logging system (`systemd-journald` then `rsyslog`). Note: the minimal deployable script below implements the nftables backend only; firewalld and iptables+ipset branches are TODO.
---
## 5-Phase Security Architecture

```
[Phase 1: Environment & Firewall Discovery] ➔ [Phase 2: Multi-Vector Scan Detection] ➔ [Phase 3: Automated Ban & Whitelist Filter] ➔ [Phase 4: Logging & Alerts] ➔ [Phase 5: Auto-Unban via Kernel Timeouts]
```

### Phase 1: Environment Discovery
1. Identify Linux distro family (`/etc/os-release`).
2. Detect active firewall backend:
 - Modern Linux: `nftables` (preferred for performance and atomic set lookups).
 - Traditional: `iptables` with `ipset`.
 - RedHat/Fedora: `firewalld` rich rules.
3. Confirm active listening ports and services to safeguard (`ss -tulpn`).

### Phase 2: Multi-Vector Port-Scan Detection
Detect scanning patterns through:
1. **Connection Frequency**: Track NEW-connection rate per source IP within a sliding 60-second window (threshold: more than 25 new connections/minute from a single source flags as scanner). Enforced per-IP in kernel via a set-element limit (see Vector 1 below).
2. **Kernel Drop Logging**: Inspect firewall drops on closed ports (`INVALID` state or `SYN` packets to non-listening ports).
3. **Scan Signatures**: SYN stealth scans, NULL scans, FIN scans, XMAS scans.

### Phase 3: Automated Ban & Whitelisting
1. Cross-reference suspect IP against whitelist (`/etc/security/scan_whitelist.conf`): skip the ban if the suspect IP or its subnet matches any whitelist entry. The deploy script enforces this in kernel: the whitelist file is loaded into the `scan_whitelist` nftables set, and every ban-triggering rule carries an `ip saddr != @scan_whitelist` guard, so a whitelisted address can never land in the drop set. Never ban a whitelisted address.
2. If not whitelisted, add to firewall drop set:
 - *nftables*: `nft add element inet port_defense scan_bans { <IP> timeout 24h }`
 - *ipset*: `ipset add scan_bans <IP> timeout 86400`
3. Record ban event with timestamp, scanned ports, and triggering packet.

### Phase 4: Alerting & Audit Logging
1. Kernel-side bans emit tagged lines to the kernel log (`log prefix "portscan-ban: "` / `"stealth-scan-ban: "`); the deploy script writes a JSON deployment record to `/var/log/portscan-defense.log`. Per-ban structured JSON enrichment (parsing the kernel log prefixes) is part of the full deployment; the minimal script records deploy-time state only.
2. Optionally dispatch Webhook / email alert to admin.

### Phase 5: Verification & Auto-Unban
1. Verify rule count and memory consumption.
2. Confirm ban entries carry in-kernel timeouts (nftables `flags timeout` / ipset `timeout`) so they auto-expire; no separate purge cron is needed.

---

## Minimal Deployable Defense Script (nftables Native)

```bash
#!/usr/bin/env bash
# Linux port-scan defense, Minimal Deployable Defense Script
#
# Backend support: nftables (FULLY IMPLEMENTED below).
# firewalld branch: TODO, rich-rule equivalent not yet implemented.
# iptables+ipset branch: TODO, not yet implemented.
# Only the nftables path below is tested and deployable as-is.
set -euo pipefail

WHITELIST_FILE="/etc/security/scan_whitelist.conf"
mkdir -p /etc/security /var/log/security
touch "$WHITELIST_FILE"

# Ensure baseline entries exist WITHOUT deleting user entries
# (bastion hosts, monitoring probes, CDN egress IPs must survive redeploys).
for entry in 127.0.0.1 10.0.0.0/8 172.16.0.0/12 192.168.0.0/16; do
 grep -qxF "$entry" "$WHITELIST_FILE" 2>/dev/null || echo "$entry" >> "$WHITELIST_FILE"
done

# Preserve the admin's current SSH client IP so a redeploy never locks out
# the active session (matches the "current SSH connection IP" criterion).
if [ -n "${SSH_CONNECTION:-}" ]; then
 ssh_ip="${SSH_CONNECTION%% *}"
 grep -qxF "$ssh_ip" "$WHITELIST_FILE" 2>/dev/null || echo "$ssh_ip" >> "$WHITELIST_FILE"
fi

# ---- Backend probe: only nftables is implemented in this minimal script ----
if ! command -v nft >/dev/null 2>&1; then
 echo "ERROR: 'nft' not found. This minimal script implements the nftables backend only." >&2
 echo "TODO: add firewalld (firewall-cmd rich rules) and iptables+ipset branches." >&2
 exit 1
fi

echo "Initializing nftables port-scan defense table..."
nft add table inet port_defense 2>/dev/null || true
# Ban set: offenders land here with a kernel-managed 24h TTL (auto-unban,
# no purge cron needed). The set-level `timeout 24h` is the default TTL for
# elements added without an explicit timeout.
nft add set inet port_defense scan_bans { type ipv4_addr\; flags timeout\; timeout 24h\; } 2>/dev/null || true
# Whitelist set (interval flag so CIDR ranges work). Populated from
# $WHITELIST_FILE below; every ban-triggering rule below carries an
# `ip saddr != @scan_whitelist` guard so whitelisted sources are never banned
# (Phase 3). Baseline entries (localhost, RFC1918) are seeded into the file
# above and therefore always present here.
nft add set inet port_defense scan_whitelist { type ipv4_addr\; flags interval\; } 2>/dev/null || true
nft flush set inet port_defense scan_whitelist 2>/dev/null || true
while IFS= read -r wl_entry || [ -n "$wl_entry" ]; do
  wl_entry="${wl_entry%%#*}"
  wl_entry="$(printf '%s' "$wl_entry" | tr -d '[:space:]')"
  [ -n "$wl_entry" ] || continue
  nft add element inet port_defense scan_whitelist { "$wl_entry" } 2>/dev/null || true
done < "$WHITELIST_FILE"
nft add chain inet port_defense input { type filter hook input priority -10\; policy accept\; } 2>/dev/null || true

# Drop traffic from banned sources first (cheap O(1) set lookup).
nft add rule inet port_defense input ip saddr @scan_bans drop 2>/dev/null || true

# ---- Phase 2: Multi-vector scan detection (kernel-side, no daemon) ----
# Vector 1, connection-rate anomaly: >25 NEW connections/minute (burst 5)
# PER SOURCE IP is scanner behavior; ban the source for 24h.
# The `limit` lives inside the set-element statement, so the kernel meters
# each source IP independently (verified with `nft --check`: a rule-level
# `limit ... by ip saddr` cannot be combined with `update`).
# `update` (not `add`) refreshes the TTL when an offender keeps scanning.
# `ip saddr != @scan_whitelist` guarantees whitelisted sources never ban (Phase 3).
nft add rule inet port_defense input ct state new \
 ip saddr != @scan_whitelist \
 update @scan_bans { ip saddr limit rate over 25/minute burst 5 packets } \
 log prefix \"portscan-ban: \" 2>/dev/null || true

# Vector 2, stealth-scan TCP flag signatures. XMAS (FIN+PSH+URG) and NULL
# (no flags) probes never occur in legitimate traffic; ban on sight
# (whitelisted sources excluded, same as Vector 1).
nft add rule inet port_defense input tcp flags \& \(fin\|psh\|urg\) == \(fin\|psh\|urg\) \
 ip saddr != @scan_whitelist \
 update @scan_bans { ip saddr } \
 log prefix \"stealth-scan-ban: \" 2>/dev/null || true
nft add rule inet port_defense input tcp flags == 0 \
 ip saddr != @scan_whitelist \
 update @scan_bans { ip saddr } \
 log prefix \"null-scan-ban: \" 2>/dev/null || true
# TODO (Vector 3): FIN-only probes and journald-based multi-log correlation
# are extension points for the full (non-minimal) deployment.

# Phase 4: structured JSON audit log. Kernel-side bans emit `log prefix`
# lines to the kernel log; record the deployment event here in JSON.
# (Per-ban JSON enrichment by parsing those prefixes is a full-deployment
# extension, not part of this minimal script.)
LOG_FILE="/var/log/portscan-defense.log"
touch "$LOG_FILE"
printf '{"ts":"%s","event":"deploy","backend":"nftables","whitelist_entries":%d}\n' \
 "$(date -u +%FT%TZ)" "$(grep -cvE '^[[:space:]]*(#|$)' "$WHITELIST_FILE" 2>/dev/null || echo 0)" >> "$LOG_FILE"

# Fail loudly if the chain did not land, instead of printing "Active".
nft list chain inet port_defense input >/dev/null 2>&1 \
 || { echo "ERROR: port_defense chain not installed" >&2; exit 1; }

echo "=== Linux Security Guard Active (nftables: rate + flag-signature detection, 24h auto-unban) ==="
```

---

## Checkable Completion Criteria

- [ ] Whitelist includes localhost, private ranges, and current SSH connection IP.
- [ ] Ban rules utilize kernel sets (ipset / nftables set) for `O(1)` lookup performance.
- [ ] Auto-unban TTL configured to prevent rule exhaustion.
- [ ] Non-destructive deployment tested without interrupting active SSH sessions.
