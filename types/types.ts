import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

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

export type ObjectOfElements = {
  [k:number]: ReactJSXElement
}
