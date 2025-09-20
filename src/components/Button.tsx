"use client";

import { Link } from "@/i18n/routing";
import clsx from "clsx";

export type ButtonProps = {
  style?: "primary" | "secondary" | "text" | "disabled";
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  size?: "sm" | "md";
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  id?: string;
  disabled?: boolean;
};

export default function Button({
  type,
  style = "primary",
  children,
  href,
  onClick,
  size = "md",
  fullWidth = false,
  id,
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    "rounded-lg px-8 py-4 text-center break-words flex justify-center font-medium max-w-[270px]";
  const sizeStyles = size === "sm" ? "px-2 py-1 text-sm leading-tight" : "";
  const widthStyles = fullWidth ? "w-full max-w-full" : "";

  const styleVariants = {
    primary: "bg-stone-700 hover:bg-stone-600 active:bg-stone-700 text-white",
    secondary:
      "text-stone-100 outline outline-2 outline-offset-[-2px] outline-stone-600 hover:bg-stone-900 active:bg-stone-950",
    text: "text-slate-300 hover:text-slate-200 active:text-slate-300",
    disabled: "cursor-not-allowed bg-gray-500 text-white",
  };

  const buttonStyle = disabled ? "disabled" : style;

  if (href && !disabled) {
    return (
      <Link href={href} id={id}>
        <div className={clsx(baseStyles, sizeStyles, widthStyles, styleVariants[buttonStyle])}>
          {children}
        </div>
      </Link>
    );
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      type={type}
      className={clsx(baseStyles, sizeStyles, widthStyles, styleVariants[buttonStyle])}
      id={id}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
