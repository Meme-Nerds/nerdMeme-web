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

export type OptionsState = {
  [k: string]: JSX.Element[]
}

export type AlertType =  'warning' | 'error' | 'info' | 'success'

export type AlertInfo = {
  type: AlertType,
  message: string
}
