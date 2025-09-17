"use client";

import { useEffect } from "react";

/**
 * Component that listens for custom events to open the consent manager dialog
 * This allows other components to trigger the dialog without direct access to the manager
 */
export default function CookieConsentTrigger() {
  useEffect(() => {
    const handleOpenDialog = () => {
      // Find the consent manager customize button and click it
      const customizeButton = document.querySelector(
        '[data-c15t="customize-button"]',
      ) as HTMLButtonElement;
      if (customizeButton) {
        customizeButton.click();
      } else {
        // Fallback: try to find any button with "Consent settings" or "Valitse" text
        const buttons = document.querySelectorAll("button");
        const consentButton = Array.from(buttons).find(
          (btn) =>
            btn.textContent?.includes("Consent settings") ||
            btn.textContent?.includes("Valitse") ||
            btn.textContent?.includes("customize"),
        );
        if (consentButton) {
          (consentButton as HTMLButtonElement).click();
        }
      }
    };

    window.addEventListener("c15t:open-dialog", handleOpenDialog);

    return () => {
      window.removeEventListener("c15t:open-dialog", handleOpenDialog);
    };
  }, []);

  return null;
}
