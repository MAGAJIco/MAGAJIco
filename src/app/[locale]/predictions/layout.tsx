// app/[locale]/predictions/layout.tsx

"use client";

import React from "react";

export default function PredictionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-white rounded-xl shadow-sm p-4 md:p-6">
      {children}
    </div>
  );
}
