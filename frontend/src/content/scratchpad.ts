export interface WriteupEntry {
  id: string;
  slug: string;
  title: string;
  dek: string;
  date: string;
  tags: string[];
  readTime: string;
  body: string[];
}

export interface CollapsibleEntry {
  id: string;
  date: string;
  title: string;
  body: string;
}

export interface LinkEntry {
  id: string;
  date: string;
  title: string;
  url: string;
  domain: string;
  commentary: string;
}

export const WRITEUPS: WriteupEntry[] = [];
export const MILDLY_INTERESTING_STUFF: CollapsibleEntry[] = [];
export const RANDOM_IDEAS: CollapsibleEntry[] = [];
export const LINKS: LinkEntry[] = [];
