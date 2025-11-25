export interface NormalizedNode {
  id: string;
  type: string;
  className: string;
  rawNode?: any;
  style?: Record<string, string>;
  html?: string;
  children?: NormalizedNode[];
}

export interface Tokens {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  shadows?: Record<string, string>;
}

export type StyleMap = Record<string, string[]>;
