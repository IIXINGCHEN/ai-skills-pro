---
name: vis-reverse-video
description: "Reverse engineer a video (URL or file) into its generation method, shot-by-shot breakdown, visual style profile, and reusable dual-version prompts. Use when the user asks how a video was made, wants its prompts extracted, or wants to recreate its style."
---

# Video Reverse Engineering

Deconstruct a finished video into HOW it was made and HOW TO REMAKE it: a generation-method verdict, a per-shot table, a style profile, and two ready-to-use prompts (one-liner plus full version). All analysis output is written in Chinese unless the user asks otherwise.

## Trigger Conditions

Activate when the user provides a video link or file and asks to:

- reverse engineer or break down how it was generated
- extract or reconstruct the prompts behind it
- judge whether it is AI-video-model output or code-rendered

Do not activate for video editing, transcoding, captioning, or summarization requests.

## Execution Protocol

### Step 0 - Acquire frames and metadata

1. Read page metadata first: title, uploader, full description, duration, publish date, tags, top comments. The description and comments are where authors disclose tools or original prompts. An author disclosure outranks every inference in Step 1 and must be quoted verbatim in Step 5.
2. Get frames:
   - Local file: use `ffprobe` for duration and resolution, then `ffmpeg -vf fps=1/10` (one frame per 10 seconds) into PNGs.
   - Bilibili and other risk-controlled hosts: direct download from datacenter IPs is typically blocked (HTTP 412 even with browser user agents, cookies, or app APIs). Do not burn retries on curl or yt-dlp. Instead use the harness browser capability: mute the player, turn off danmaku, hide the control bar, then capture one screenshot every 10 seconds across the full duration. See `references/acquisition-playbook.md` for the exact procedure. If the current harness cannot drive a browser, ask the user to upload the video file or provide the frames directly.
3. Record the sampling method and any failed segments. They become the blind-spot declaration in Step 5.

### Step 1 - Generation-method verdict (A/B/C plus confidence)

Verdict options:

- A: video generation model direct output (Sora, Kling, Jimeng, Runway, and similar).
- B: an LLM wrote rendering code (HTML Canvas / Three.js / p5.js / Remotion / Manim frame-by-frame, composited with FFmpeg to MP4).
- C: hybrid of the two.

Cite at least three evidence items:

- A signals: photorealistic or painterly look, texture and detail drift, garbled text (especially long Chinese sentences), wrong data in complex diagrams, irregular twitchy motion.
- B signals: zero-error razor-sharp text, perfectly regular symmetric geometry, factually correct diagram data (counts, conversions, proper nouns), uniform or standard-eased motion, no texture drift anywhere. Strong rule: a text-only LLM (Claude / GPT / Opus family) claiming to "generate" a video can only have written rendering code; it cannot emit pixels.
- C signals: code-driven main content with AI-generated or photographic background plates, or video-model clips composited with code-drawn captions and diagrams.
- A session-quota mention in the description (for example "12% of 5-hour quota") is strong evidence of B: an agentic coding session.

### Step 2 - Shot-by-shot table

A Markdown table with columns: Shot number | Time range (approximate, note error bound such as ±10s) | Visual content | On-screen text (transcribed verbatim) | Palette | Camera move and transition | Music and SFX change.

- Camera moves and transitions that cannot be observed continuously are marked "inferred".
- Music and SFX are "unknown (muted capture)" when audio was never acquired. Never invent them.

### Step 3 - Style profile

Total duration, resolution and aspect ratio (mark "inferred" if unverified), color scheme, typography (Chinese and English described separately), recurring visual motifs, rhythm curve (where it rests, rises, climaxes, resolves), music style, voiceover presence (unknown when there is no subtitle track and no audio).

### Step 4 - Dual reverse-engineered prompts

1. One-liner: at most 50 Chinese characters. Theme, style, duration, and mood only, in "one sentence, one video" style.
2. Full version, paste-ready, containing:
   - Theme and title, with a one-sentence thesis.
   - Implementation: for B, the stack, resolution, frame rate, and FFmpeg MP4 export; for A, the model name, duration, aspect ratio, and camera language; for C, both parts separately.
   - Numbered narrative structure: visuals, text, and duration per shot.
   - Visual requirements and a deny list, derived by inverting the observed style (for example no neon, no RGB split, no bounce easing, no template transitions, no photorealistic people).
   - Sound requirements: instruments and style, dynamic arc with hit points, SFX types.
   - Technical requirements: for B, "every frame is a pure function of time t", "storyboard before code", "sample frames for self-check before final render", "assert diagram data"; for A, "shot-consistency constraints", "text-avoidance strategy (overlay complex text in post, never rely on the model)".
   - One closing line granting the model creative freedom (storyboard skeleton fixed, wow-factor first).

### Step 5 - Credibility statement

- Two lists: directly observed versus inferred (with basis for each inference).
- Author-disclosed original prompt, if any: quoted verbatim in its own block with source (description, comments, or title). All inferences defer to it.
- Sampling method and blind spots: frame interval, muted capture, failed segments.

## Iron Rules

1. Transcribe on-screen text character-for-character, Chinese and English, including diagram labels.
2. Never invent content the video does not contain.
3. Illegible regions: write 「看不清」. No audio or data: write 「无法判断」 with the reason.
4. Time ranges are always approximate with a stated error bound.
5. Every inference is labeled as inference, never stated as fact.
6. Cite the source of any author quote (description, comments, or title).

## Checkable Completion Criteria

- [ ] Generation-method verdict carries a confidence level and at least three cited evidence items.
- [ ] Shot table covers the full duration; every on-screen text is verbatim or marked 「看不清」.
- [ ] One-liner is at most 50 Chinese characters.
- [ ] Full prompt contains all seven required blocks.
- [ ] Credibility section separates observed from inferred and declares sampling blind spots.
- [ ] Iron Rules 1 through 6 are all honored in the delivered analysis.
