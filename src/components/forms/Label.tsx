import * as React from "react";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={"mb-1 block text-sm font-medium text-gray-900 " + (className || "")}
        {...props}
      />
    );
  },
);
Label.displayName = "Label";

export default Label;
