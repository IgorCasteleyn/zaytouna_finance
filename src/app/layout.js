import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: " ",
  description: "content",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <header>
          <Navbar />
        </header>
        <main className="flex-grow antialiased">{children}</main>
      </body>
    </html>
  );
}
