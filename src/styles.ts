import { NormalizedNode, Tokens, StyleMap } from './types.js';

export function computeStyles(root: NormalizedNode, tokens: Tokens): StyleMap {
  const styles: StyleMap = {};
  traverse(root, styles, null);
  return styles;
}

function traverse(node: NormalizedNode, styles: StyleMap, parent: any) {
  const rules: string[] = [];
  const raw = node.rawNode;
  
  if (!raw) {
    styles[node.className] = ['display: block;'];
    (node.children || []).forEach(child => traverse(child, styles, raw));
    return;
  }

  // Layout positioning
  if (raw.absoluteBoundingBox) {
    const box = raw.absoluteBoundingBox;
    rules.push(`width: ${box.width}px;`);
    rules.push(`height: ${box.height}px;`);
    
    // Use absolute positioning for proper layout
    if (parent && parent.absoluteBoundingBox) {
      rules.push(`position: absolute;`);
      rules.push(`left: ${box.x - parent.absoluteBoundingBox.x}px;`);
      rules.push(`top: ${box.y - parent.absoluteBoundingBox.y}px;`);
    } else {
      rules.push(`position: relative;`);
    }
  }

  // Background colors (but not for text nodes - they use color instead)
  if (node.type !== 'TEXT' && raw.fills && raw.fills.length > 0) {
    const fill = raw.fills[0];
    if (fill.type === 'SOLID' && fill.visible !== false) {
      const color = fill.color;
      const opacity = fill.opacity !== undefined ? fill.opacity : 1;
      rules.push(`background-color: rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${opacity});`);
    } else if (fill.type === 'GRADIENT_LINEAR') {
      // Handle gradients
      const stops = fill.gradientStops?.map((stop: any) => {
        const c = stop.color;
        return `rgba(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}, ${c.a || 1}) ${Math.round(stop.position * 100)}%`;
      }).join(', ');
      if (stops) {
        rules.push(`background: linear-gradient(180deg, ${stops});`);
      }
    }
  }

  // Border radius
  if (raw.cornerRadius) {
    rules.push(`border-radius: ${raw.cornerRadius}px;`);
  } else if (raw.rectangleCornerRadii) {
    const radii = raw.rectangleCornerRadii;
    rules.push(`border-radius: ${radii[0]}px ${radii[1]}px ${radii[2]}px ${radii[3]}px;`);
  }

  // Strokes (borders)
  if (raw.strokes && raw.strokes.length > 0) {
    const stroke = raw.strokes[0];
    if (stroke.type === 'SOLID' && stroke.visible !== false) {
      const color = stroke.color;
      const weight = raw.strokeWeight || 1;
      rules.push(`border: ${weight}px solid rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, 1);`);
    }
  }

  // Box shadows / effects
  if (raw.effects && raw.effects.length > 0) {
    const shadows = raw.effects
      .filter((effect: any) => effect.type === 'DROP_SHADOW' && effect.visible !== false)
      .map((effect: any) => {
        const c = effect.color;
        return `${effect.offset?.x || 0}px ${effect.offset?.y || 0}px ${effect.radius || 0}px rgba(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}, ${c.a || 1})`;
      });
    if (shadows.length > 0) {
      rules.push(`box-shadow: ${shadows.join(', ')};`);
    }
  }

  // Text styles
  if (node.type === 'TEXT' && raw.style) {
    const style = raw.style;
    rules.push(`display: flex;`);
    rules.push(`align-items: center;`);
    if (style.fontFamily) rules.push(`font-family: ${style.fontFamily}, sans-serif;`);
    if (style.fontSize) rules.push(`font-size: ${style.fontSize}px;`);
    if (style.fontWeight) rules.push(`font-weight: ${style.fontWeight};`);
    if (style.lineHeightPx) rules.push(`line-height: ${style.lineHeightPx}px;`);
    if (style.letterSpacing) rules.push(`letter-spacing: ${style.letterSpacing}px;`);
    if (style.textAlignHorizontal) {
      const align = style.textAlignHorizontal.toLowerCase();
      rules.push(`text-align: ${align};`);
      if (align === 'center') rules.push(`justify-content: center;`);
      else if (align === 'right') rules.push(`justify-content: flex-end;`);
    }
    
    // Text color
    if (raw.fills && raw.fills.length > 0) {
      const fill = raw.fills[0];
      if (fill.type === 'SOLID') {
        const color = fill.color;
        const opacity = fill.opacity !== undefined ? fill.opacity : 1;
        rules.push(`color: rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${opacity});`);
      }
    }
  }

  // Padding
  if (raw.paddingLeft || raw.paddingRight || raw.paddingTop || raw.paddingBottom) {
    rules.push(`padding: ${raw.paddingTop || 0}px ${raw.paddingRight || 0}px ${raw.paddingBottom || 0}px ${raw.paddingLeft || 0}px;`);
  }

  // Opacity
  if (raw.opacity !== undefined && raw.opacity < 1) {
    rules.push(`opacity: ${raw.opacity};`);
  }

  // Box sizing
  rules.push(`box-sizing: border-box;`);

  styles[node.className] = rules;
  (node.children || []).forEach(child => traverse(child, styles, raw));
}
