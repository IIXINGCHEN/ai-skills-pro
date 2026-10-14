# Frame Acquisition Playbook

How to get analyzable frames out of a video URL or file. Proven against Bilibili in October 2026.

> Portability note: the browser-driven path below assumes the harness can operate a real browser (screenshots, seeking, muting). On harnesses without that capability, skip to "Blind-spot rules" and ask the user to upload the file or supply frames.

## Local file

```bash
ffprobe -v error -show_entries format=duration -show_entries stream=width,height -of default=noprint_wrappers=1 video.mp4
ffmpeg -i video.mp4 -vf fps=1/10 frames/frame_%03d.png
```

One frame per 10 seconds is the default sampling density for the shot table.

## Bilibili (and similar risk-controlled hosts)

Direct download from datacenter IPs is blocked:

- `yt-dlp` fails with HTTP 412 even with a browser user agent, Referer, and Origin headers.
- The `x/web-interface/view` API returns a risk-control HTML page instead of JSON.
- The embed player page carries no inline play info.
- The mobile app API returns `code -400` without signed parameters.
- Third-party parse APIs are unreliable or shut down.

Do not retry these paths. Instead delegate to a browser task (a real Chromium passes the page checks):

1. Open the video page. Dismiss popups and login prompts; never log in.
2. Record metadata: title, uploader, full description text (expand it), duration, publish date, zone, tags, like/coin/favorite counts, and whether the page is labeled AI-generated.
3. Scan the description and top comments for tool mentions (Sora, Kling, Jimeng, Runway, Opus, and similar) or a disclosed original prompt. Quote verbatim.
4. Mute the player, turn off danmaku, move the cursor off the video so the control bar auto-hides.
5. Seek with the `?t=` time parameter in 10-second steps (0, 10, 20, ...), wait 2 to 3 seconds after each seek for the frame and overlays to settle, then screenshot. Request the screenshots as task deliverables.
6. If a seek lands on a black or loading frame, wait and re-capture once, then move on and log the gap.
7. The task report must list, in order, whether each timestamp succeeded and what it shows.

## Blind-spot rules

- Audio is never available through screenshots: music style, SFX changes, and voiceover are always 「无法判断」 unless a separate audio track is obtained. Say so explicitly.
- Timestamp-to-image mismatches happen (seeks can land late). Reconcile order with narrative logic and the player's progress bar before writing the shot table, and keep time ranges approximate.
