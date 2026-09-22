export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-website-theme className="min-h-screen flex flex-col">
      {children}
    </div>
  );
}
