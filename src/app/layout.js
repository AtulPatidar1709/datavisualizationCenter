import localFont from "next/font/local";
import "./globals.css";

// Load local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap", // To handle font loading gracefully
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

// Metadata for the app
export const metadata = {
  title: "Analytics Dashboard",
  description: "Interactive Analytics Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }} // Fallback to sans-serif
      >
        {children}
      </body>
    </html>
  );
}
