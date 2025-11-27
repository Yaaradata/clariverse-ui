export default function AddonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}

