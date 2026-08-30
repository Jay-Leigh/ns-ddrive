"use client";

export default function ErrorBoundary({
  reset,
}: Readonly<{ reset: () => void }>) {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-16">
      <section
        className="w-full rounded-control border border-border bg-surface p-8 shadow-surface"
        role="alert"
      >
        <h1 className="text-2xl font-semibold text-foreground">
          The client-review application could not load
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-700">
          Try the operation again. No review has been submitted.
        </p>
        <button
          className="mt-6 rounded-control bg-interactive px-4 py-2 font-semibold text-white hover:bg-interactive-hover"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
