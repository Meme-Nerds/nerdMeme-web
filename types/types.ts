export interface Meme {
  setting: string;
  image: string;
  quote: string;
  author: string;
}

export type NumIndexed = {
  [k: number]: string,
}

export type StringIndexed = {
  [k: string]: string
}
