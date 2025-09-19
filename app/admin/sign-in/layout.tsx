import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admina panelis - Pierakstīšanās",
  description: "Admina panelis - Pierakstīšanās",
};

export default function AdminSignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}