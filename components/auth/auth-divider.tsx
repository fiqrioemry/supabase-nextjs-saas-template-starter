import React from "react";

export function AuthDivider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-card py-2 px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
    </div>
  );
}
