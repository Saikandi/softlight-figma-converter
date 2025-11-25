import { NormalizedNode } from './types.js';

export function normalizeNode(node: any): NormalizedNode | null {
  const sanitizedId = node.id.replace(/:/g, '-');
  
  switch (node.type) {
    case 'CANVAS':
    case 'FRAME':
    case 'COMPONENT':
    case 'INSTANCE':
    case 'GROUP':
    case 'SECTION':
      return {
        id: node.id,
        type: node.type,
        className: `node-${sanitizedId}`,
        rawNode: node,
        children: (node.children || []).map(normalizeNode).filter(Boolean) as NormalizedNode[],
      };
    case 'TEXT':
      return {
        id: node.id,
        type: 'TEXT',
        className: `text-${sanitizedId}`,
        rawNode: node,
        html: node.characters || '',
      };
    case 'RECTANGLE':
    case 'ELLIPSE':
    case 'VECTOR':
    case 'LINE':
    case 'STAR':
    case 'POLYGON':
      return {
        id: node.id,
        type: node.type,
        className: `shape-${sanitizedId}`,
        rawNode: node,
        children: [],
      };
    default:
      console.log(`Skipping unsupported node type: ${node.type}`);
      return null;
  }
}
