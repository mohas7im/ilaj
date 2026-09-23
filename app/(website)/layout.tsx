import Navbar from "@/components/website/layout/Navbar";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-website-theme className="min-h-screen flex flex-col relative">
      <Navbar />
      {children}
    </div>
  );
}
