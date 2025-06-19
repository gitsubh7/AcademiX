// src/components/Button.jsx
import { forwardRef } from "react";

export const Button = forwardRef(({ className = "", ...props }, ref) => (
  <button
    ref={ref}
    className={`px-4 py-2 rounded transition ${className}`}
    {...props}
  />
));
