import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-16">
      <section className="w-full rounded-control border border-border bg-surface p-8 shadow-surface">
        <p className="text-sm font-semibold text-interactive">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">
          Review page not found
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-700">
          The requested review page is not available.
        </p>
        <Link
          className="mt-6 inline-block font-semibold text-interactive underline"
          href="/"
        >
          Return to the client-review application
        </Link>
      </section>
    </main>
  );
}
