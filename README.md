# Rapid Word Reader

Rapid Word Reader is a lightweight browser-based speed reading application built around the **RSVP (Rapid Serial Visual Presentation)** technique.

Instead of moving your eyes across lines of text, the app displays one word at a time in a fixed position. Each word is aligned around its **Optimal Recognition Position (ORP)**, highlighted with a red letter in the center of the screen.

The goal is to reduce unnecessary eye movement and make high-speed reading more comfortable and consistent.

## Features

- RSVP word-by-word reading
- ORP fixation point with a highlighted red letter
- Accurate word alignment around the fixation point
- Default reading speed of **500 WPM**
- Adjustable reading speed from 100 to 1200 WPM
- Reading progress indicator
- Current word position and total word count
- Play / pause controls
- Keyboard shortcuts
- File upload support
- Manual text input
- Ukrainian and English interface
- Light and dark themes
- Responsive layout for desktop and mobile
- Local browser processing
- No account or backend required

## Supported Files

Rapid Word Reader can currently extract text from:

- TXT
- Markdown
- PDF
- DOCX

Files are processed directly in the browser and are not uploaded to a server.

## Controls

While reading:

- `Space` — pause or resume reading
- `Esc` — exit the reader
- `←` — move back 10 words
- `→` — move forward 10 words

## How It Works

Rapid Word Reader uses **RSVP**, a reading technique where words are presented sequentially in the same visual location.

Each word also has an **Optimal Recognition Position** — usually slightly left of the visual center of the word.

The app calculates this position and aligns every word so that its ORP remains fixed on the same point on the screen.

The highlighted red letter acts as a visual anchor.

For example:

`rea[d]ing`

`fo[c]us`

`s[p]eed`

Your eyes remain focused on the same area while the words change around that point.

## Privacy

Rapid Word Reader is a fully client-side application.

Your text and uploaded files are processed locally in your browser and are not sent to a backend server.

Some document formats use browser-loaded third-party libraries for text extraction.

## Technology

The application is built with:

- HTML
- CSS
- Vanilla JavaScript
- Lucide Icons
- PDF.js
- Mammoth.js

No framework, build step, database, or backend is required.

## Design

The visual system follows the design language of the **Shwydkochyt** speed reading project:

- warm neutral backgrounds
- orange accent color
- rounded UI elements
- minimal controls
- distraction-free reading mode
- light and dark themes

## Running Locally

Clone the repository:

```bash
git clone https://github.com/pavlo-bondarchuk/rapid-word-reader.git
```

Open:

```text
index.html
```

in your browser.

You can also serve the directory using any local HTTP server.

For example:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## GitHub Pages

The project is designed to work as a static website and can be deployed directly with GitHub Pages.

Repository:

```text
https://github.com/pavlo-bondarchuk/rapid-word-reader
```

## Roadmap

Possible future improvements:

- EPUB support
- reading session statistics
- estimated remaining reading time
- punctuation-aware timing
- longer pauses after sentences and paragraphs
- reading history
- saved reading position
- custom typography settings
- font size controls
- accessibility improvements
- offline PWA mode
