"use client";

import { useConsentManager } from "@c15t/nextjs";
import { useEffect } from "react";

const TEST_COOKIE_NAME = "c15t_test_measurement";

export default function TestNonEssentialCookie() {
  const { has } = useConsentManager();
  const allowMeasurement = has("measurement");

  useEffect(() => {
    if (allowMeasurement) {
      document.cookie = `${TEST_COOKIE_NAME}=1; Path=/; SameSite=Lax`;
    } else {
      document.cookie = `${TEST_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
    }
  }, [allowMeasurement]);

  return null;
}
