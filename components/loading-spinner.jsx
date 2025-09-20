import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ 
  size = "default", 
  text = "Loading...", 
  className = "" 
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  return (
    <div 
      className={`flex items-center justify-center gap-2 ${className}`}
      role="status"
      aria-label={text}
    >
      <Loader2 
        className={`animate-spin ${sizeClasses[size]}`}
        aria-hidden="true"
      />
      {text && (
        <span className="sr-only">{text}</span>
      )}
    </div>
  );
}
