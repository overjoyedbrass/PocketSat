import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main/index.css';
import App from './App';

import { extendTheme, ChakraProvider, ColorModeScript } from "@chakra-ui/react"

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
    config: {
      initialColorMode: "dark",
      useSystemColorMode: false,
    },
    colors: {
        black: {
          50: '#f2f2f2',
          100: '#d9d9d9',
          200: '#bfbfbf',
          300: '#a6a6a6',
          400: '#8c8c8c',
          500: '#737373',
          600: '#595959',
          700: '#404040',
          800: '#262626',
          900: '#0d0d0d',
        }
    },
    styles: {
        global: (_props) => ({
          body: {
            bg: "rgb(14, 8, 35)",
          },
        }),
      },
})



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
        <App />
    </ChakraProvider>
    </>
);
