import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { StrictMode } from "react";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <CookiesProvider
      defaultSetOptions={{
        path: "/",
      }}
    >
      {" "}
      <QueryClientProvider client={queryClient}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <ModalsProvider>
            <App />
            <Notifications />
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </CookiesProvider>
  </StrictMode>
);
