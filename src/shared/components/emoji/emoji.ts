export interface WTHEmojiCode {
  base: string;
  fully_qualified: string;
  non_fully_qualified: string;
  output: string;
  default_matches: string[];
  greedy_matches: string[];
  decimal: any;
}

export interface WTHEmoji {
  name: string;
  unicode_version: number;
  category: string;
  order: number;
  display: number;
  shortname: string;
  shortname_alternates: any;
  ascii: any;
  diversity: any;
  diversities: any;
  gender: any;
  code_points: WTHEmojiCode;
  keywords: string[];
}

export interface WTHEmojiCategory {
  people: WTHEmoji;
  nature: WTHEmoji;
  food: WTHEmoji;
  activity: WTHEmoji;
  travel: WTHEmoji;
  objects: WTHEmoji;
  symbols: WTHEmoji;
  flags: WTHEmoji;
  regional: WTHEmoji;
  modifier: WTHEmoji;
}

export interface WTHEmojiCateCode {
  category: string;
  code: string;
}
