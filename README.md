# Figma to HTML/CSS Converter

A simple tool that takes Figma designs and converts them into clean HTML and CSS that you can actually use. No fancy frameworks, just plain HTML/CSS that works.

## What does it do?

This tool connects to the Figma API, grabs your design, and spits out HTML/CSS files that look pretty much identical to what you designed. It handles:

- Layout and positioning (absolute positioning to match Figma exactly)
- Colors and backgrounds (including gradients!)
- Typography (fonts, sizes, weights, spacing)
- Borders and rounded corners
- Shadows and effects
- The basic structure of your design

## Getting Started

### Prerequisites

- Node.js (I'm using v22, but anything recent should work)
- A Figma account and access to the file you want to convert
- A Figma access token (you can generate one in your Figma settings)

### Installation

First, clone this repository to your local machine:

```bash
git clone <your-repo-url>
cd softlight-figma-converter
```

Then install all the dependencies:

```bash
npm install
```

### Setup

Create a `.env` file in the root directory with your Figma credentials:

```
FIGMA_TOKEN=your_figma_token_here
FIGMA_FILE_KEY=your_figma_file_key_here
```

**Where do I find these?**

- **Token**: Go to Figma → Settings → Account → Personal Access Tokens → Generate new token
- **File Key**: It's in the URL when you open your Figma file. For example, in `https://www.figma.com/file/ABC123/My-Design`, the file key is `ABC123`

## Usage

Run the converter with:

```bash
npm run convert -- --file YOUR_FILE_KEY --page "Page Name" --out dist
```

Or if you've set up the `.env` file:

```bash
npm run convert -- --file $FIGMA_FILE_KEY --page "Your Page Name" --out dist
```

This will generate `index.html` and `styles.css` in the `dist` folder.

### Options

- `--file` (required): Your Figma file key
- `--page` (optional): Specific page name to export. If not provided, it'll grab the first page
- `--out` (optional): Output directory (defaults to `dist`)

## Example

```bash
npm run convert -- --file MxMXpjiLPbdHlratvH0Wdy --page "Sign in screen" --out dist
```

Then just open `dist/index.html` in your browser!

## Quick Start for Reviewers

If someone shares this project with you and you just want to see the output:

1. **Just view the HTML**: Simply open `dist/index.html` in any browser - no setup needed! The HTML and CSS files are already generated and ready to view.

2. **Want to regenerate from Figma?** You'll need to:
   - Install Node.js
   - Run `npm install` in the project folder
   - Get a Figma token (see Setup section above)
   - Create a `.env` file with your credentials
   - Run the converter command

## How it works

1. **Fetches the Figma file** using their API
2. **Parses the design tree** and extracts all the nodes (frames, text, shapes, etc.)
3. **Computes styles** for each element based on Figma's styling info
4. **Generates HTML** with proper structure and class names
5. **Generates CSS** with all the positioning, colors, fonts, and effects

The converter uses absolute positioning to match Figma's layout exactly. Each element gets its own class and specific positioning values.

## What works well

- Static designs (landing pages, mockups, UI screens)
- Text styling and formatting
- Colors and gradients
- Layout and spacing
- Rounded corners and borders
- Button designs

## What doesn't work (yet)

- Interactive elements (you'll need to add JavaScript yourself)
- Images (exports the structure but not actual image assets)
- Complex animations
- Auto-layout (converts to absolute positioning instead)
- Component variants
- Responsive design (it's a 1:1 conversion of the Figma frame)

## Tech Stack

- TypeScript (for type safety)
- tsx (for running TypeScript directly)
- Figma API (for fetching designs)
- Node.js built-in modules (fs, path)

## Project Structure

```
src/
  cli.ts          - Command line interface
  convert.ts      - Main conversion logic
  figma.ts        - Figma API calls
  normalize.ts    - Converts Figma nodes to internal format
  styles.ts       - Extracts and computes CSS styles
  render.ts       - Generates HTML and CSS files
  types.ts        - TypeScript type definitions
  tokens.ts       - Design token extraction (colors, fonts)
  utils.ts        - Helper functions
```

## Building

If you want to compile TypeScript to JavaScript:

```bash
npm run build
```

This creates JavaScript files in the `dist` folder.

## Notes

- The converter uses Google Fonts for the Inter font family (since that's what the example design uses)
- Class names are based on Figma node IDs, so they might look a bit weird but they're unique
- The output is meant to be a starting point - you'll probably want to refine it for production use

## Future improvements

Some things I'd like to add:

- Better responsive layout handling
- Image asset downloading and embedding
- Support for more Figma node types
- Cleaner class naming
- CSS Grid/Flexbox instead of absolute positioning
- Component extraction

## License

Do whatever you want with it. It's just a tool I built to speed up front-end work.

## Questions?

If something breaks or you have ideas for improvements, feel free to reach out or open an issue!
