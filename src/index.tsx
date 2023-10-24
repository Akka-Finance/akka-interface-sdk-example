import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { core } from "./wagmi/chains/core";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [core],
  [publicProvider()]
);
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <ToastContainer
            position={"bottom-left"}
            autoClose={6000}
            hideProgressBar={false}
            closeOnClick={true}
            pauseOnHover={true}
            draggable={true}
            theme="light"
          />
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
