import Head from "next/head";

export default function ProjectsPage() {
    return (
        <>
            <Head>
                <title>Projects – Richa Singh</title>
            </Head>

            <main className="min-h-screen page-grid-bg text-foreground">
                <section className="max-w-4xl mx-auto px-6 pt-24 pb-24">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">
                        .projects
                    </p>
                    <h1 className="text-3xl md:text-4xl font-medium mb-4">
                        Projects page
                    </h1>
                    <p className="text-sm md:text-base text-foreground/80">
                        Still in development for now.
                    </p>
                </section>
            </main>
        </>
    );
}