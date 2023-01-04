import { createTheme } from "@mui/material/styles";

// THIS OBJECT SHOULD BE SIMILAR TO ../tailwind.config.js
const themeConstants = {
  paper: "#F9F9F9",
  primary: {
    main: "#01A7C2",
    dark: "#01A7C2",
  },
  secondary: {
    main: "#007090",
   // dark: "#3A3A3A",
  },
  error: {
    main: "#66101F",
    dark: "#8b0000",
  },
  warning: {
    main: "#E76F51",
    dark: "#E76F51" 
  },
  fg: { main: "#fff", dark: "rgba(55, 65, 81, 1)" },
  breakpoints: {
    xs: 0,
    mb: 350,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

// Check here for more configurations https://material-ui.com/customization/default-theme/

const theme = createTheme({
  palette: {
    primary: {
      main: "#01A7C2",
      dark: "#01A7C2",
    },
    secondary: {
      main: "#007090",
     // dark: "#3A3A3A",
    },
    error: {
      main: "#66101F",
      dark: "#8b0000",
    },
    warning: {
      main: "#E76F51",
      dark: "#E76F51" 
    },
  },
  breakpoints: {
    values: themeConstants.breakpoints,
  },
});

export default theme;
