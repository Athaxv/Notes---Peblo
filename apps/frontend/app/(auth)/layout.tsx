export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="landing-theme min-h-screen">
      <section className="marketing-bg flex min-h-screen flex-col items-center justify-center p-4">
        {children}
      </section>
    </div>
  );
}
