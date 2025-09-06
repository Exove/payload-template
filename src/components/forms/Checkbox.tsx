import * as React from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={
          "h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900 " +
          (className || "")
        }
        {...props}
      />
    );
  },
);
Checkbox.displayName = "Checkbox";

export default Checkbox;
