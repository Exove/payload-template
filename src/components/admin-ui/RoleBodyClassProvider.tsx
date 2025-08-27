"use client";

import { useAuth } from "@payloadcms/ui";
import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export function RoleBodyClassProvider({ children }: Props) {
  const { user } = useAuth();

  useEffect(() => {
    const root = document.documentElement;
    if (!root) return;

    root.classList.remove("role-admin", "role-editor", "role-user");
    const role = (user as unknown as { role?: string } | null)?.role;
    if (role) {
      root.classList.add(`role-${role}`);
    }
  }, [user]);

  return <>{children}</>;
}
