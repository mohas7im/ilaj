import Navbar from "@/components/website/layout/Navbar";
import Footer from "@/components/website/layout/Footer";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-website-theme className="min-h-screen flex flex-col relative">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
