// app/layout.tsx
import "./globals.css";
import { ReduxProvider } from "@/store";
import { ReactNode } from "react";
import { Providers } from "./providers";

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
      <body>
        <Providers>
          <ReduxProvider>{children}</ReduxProvider>
        </Providers>
      </body>
    </html>
  );
}
