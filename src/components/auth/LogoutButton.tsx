"use client";

import { useRouter } from "@/i18n/routing";
import { useClerk } from "@clerk/nextjs";
import { useState } from "react";
import Button from "../Button";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleLogout} size="sm" disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
