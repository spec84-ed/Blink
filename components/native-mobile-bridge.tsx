"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
import { StatusBar, Style } from "@capacitor/status-bar";

export function NativeMobileBridge() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    void StatusBar.setStyle({ style: Style.Light });
    void StatusBar.setBackgroundColor({ color: "#fbfcf7" });

    const listeners = [
      App.addListener("appStateChange", ({ isActive }) => {
        document.documentElement.dataset.appState = isActive ? "active" : "background";
      }),
      Keyboard.addListener("keyboardWillShow", () => {
        document.documentElement.dataset.keyboard = "visible";
      }),
      Keyboard.addListener("keyboardWillHide", () => {
        document.documentElement.dataset.keyboard = "hidden";
      })
    ];

    return () => {
      listeners.forEach((listener) => {
        void listener.then((handle) => handle.remove());
      });
    };
  }, []);

  return null;
}
