export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-16">
      <section className="w-full rounded-control border border-border bg-surface p-8 shadow-surface">
        <p className="mb-3 text-sm font-semibold tracking-wide text-interactive uppercase">
          Project NorthStar
        </p>
        <h1 className="text-3xl font-semibold text-foreground">
          BIG client-review application foundation
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
          The invited client-review boundary is operational. Review invitations
          and authentication have not been implemented.
        </p>
      </section>
    </main>
  );
}
