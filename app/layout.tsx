// app/layout.tsx
import "./globals.css";
import { ReduxProvider } from "@/store";
import { ReactNode } from "react";

export const metadata = {
  title: "Woorkroom - Onboarding",
  description: "Plan. Create. Control.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
