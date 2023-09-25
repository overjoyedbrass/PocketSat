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
        brand: {
            100: "#f7fafc",
            // ...
            900: "#1a202c",
        },
    },
    styles: {
        global: (props) => ({
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
