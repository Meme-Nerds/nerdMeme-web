declare module "@mui/material/styles" {
  interface Palette {
    brand_grey: string;
  }
  interface PaletteOptions {
    brand_grey: string;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    brand_grey: true;
  }
}
