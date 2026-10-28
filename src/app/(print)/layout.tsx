import React from "react";

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-200/80 py-0 sm:py-6 print:py-0 print:bg-white">
      {children}
    </div>
  );
}
