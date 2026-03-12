import { GetServerSideProps } from "next";
import { groq } from "next-sanity";
import { client, urlFor } from "../sanity/client";
import { motion } from "framer-motion";

const heroQuery = groq`*[_type == "hero"][0]`;
const profileQuery = groq`*[_type == "profile"][0]`;
const projectsQuery = groq`*[_type == "project"] | order(year desc)`;
const playgroundQuery = groq`*[_type == "playgroundItem"] | order(year desc, _createdAt desc)`;
const notesQuery = groq`*[_type == "note"] | order(date desc)[0..2]`;
const contactQuery = groq`*[_type == "contact"][0]`;

type Hero = {
  greeting?: string;
  line1?: string;
  line2?: string;
  currentRole?: string;
  roleColor?: string;
  roleDotColor?: string;
};

type SocialLink = {
  label: string;
  url: string;
};

type Profile = {
  name?: string;
  headline?: string;
  bio?: string;
  socials?: SocialLink[];
  avatar?: any;
};

type Project = {
  _id: string;
  title?: string;
  year?: string;
  summary?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  coverImage?: any;
};

type PlaygroundItem = {
  _id: string;
  title?: string;
  year?: string;
  image?: any;
  link?: string;
};

type Note = {
  _id: string;
  title?: string;
  date?: string;
  type?: string;
};

type Contact = {
  headline?: string;
  body?: string;
  email?: string;
  portfolioLink?: string;
  portfolioUrl?: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
};

type HomeProps = {
  hero: Hero | null;
  profile: Profile | null;
  projects: Project[];
  playgroundItems: PlaygroundItem[];
  notes: Note[];
  contact: Contact | null;
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const [hero, profile, projects, playgroundItems, notes, contact] =
    await Promise.all([
      client.fetch(heroQuery),
      client.fetch(profileQuery),
      client.fetch(projectsQuery),
      client.fetch(playgroundQuery),
      client.fetch(notesQuery),
      client.fetch(contactQuery),
    ]);

  return {
    props: {
      hero: hero || null,
      profile: profile || null,
      projects: projects || [],
      playgroundItems: playgroundItems || [],
      notes: notes || [],
      contact: contact || null,
    },
  };
};

export default function Home({
  hero,
  profile,
  projects,
  playgroundItems,
  notes,
  contact,
}: 

HomeProps) {
  return (
    <main className="min-h-screen relative overflow-hidden page-grid-bg text-white">
      {/* TOP TABLE-LIKE BAR */}
      <section className="max-w-6xl mx-auto px-6 pt-6 pb-10">
        <div className="border border-white/40 rounded-3xl px-4 py-3 md:px-6 md:py-4 bg-black/70 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_repeat(5,minmax(0,1fr))] gap-0 items-stretch text-xs md:text-[13px]">
            {/* Left cell: reserved for future icon / GIF */}
            <div className="flex items-center justify-center border-b border-white/15 md:border-b-0 md:border-r border-white/25 min-h-[40px]">
            <img
            src="/gif-hero.gif"
            alt="Hero icon"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
            />
            </div>

            {/* Desktop cells: centered labels with clear dividers */}
            <a
              href="#projects"
              className="hidden md:flex items-center justify-center border-r border-white/25 text-gray-200 hover:text-white transition-colors min-h-[40px]"
            >
              <span className="uppercase tracking-[0.2em] text-[11px]">
                projects
              </span>
            </a>

            <a
              href="#about-section"
              className="hidden md:flex items-center justify-center border-r border-white/25 text-gray-200 hover:text-white transition-colors min-h-[40px]"
            >
              <span className="uppercase tracking-[0.2em] text-[11px]">
                about
              </span>
            </a>

            <a
              href="#playground"
              className="hidden md:flex items-center justify-center border-r border-white/25 text-gray-200 hover:text-white transition-colors min-h-[40px]"
            >
              <span className="uppercase tracking-[0.2em] text-[11px]">
                playground
              </span>
            </a>

            <a
              href="#latest"
              className="hidden md:flex items-center justify-center border-r border-white/25 text-gray-200 hover:text-white transition-colors min-h-[40px]"
            >
              <span className="uppercase tracking-[0.2em] text-[11px]">
                latest
              </span>
            </a>

            <a
              href="#contact"
              className="hidden md:flex items-center justify-center text-gray-200 hover:text-white transition-colors min-h-[40px]"
            >
              <span className="uppercase tracking-[0.2em] text-[11px]">
                contact
              </span>
            </a>

            {/* Mobile: compact row of links under the empty left cell */}
            <div className="flex md:hidden flex-wrap gap-3 py-2 justify-center text-[11px] text-gray-400 border-t border-white/15 mt-2">
              <a
                href="#projects"
                className="uppercase tracking-[0.16em] hover:text-white"
              >
                projects
              </a>
              <a
                href="#about-section"
                className="uppercase tracking-[0.16em] hover:text-white"
              >
                about
              </a>
              <a
                href="#playground"
                className="uppercase tracking-[0.16em] hover:text-white"
              >
                playground
              </a>
              <a
                href="#latest"
                className="uppercase tracking-[0.16em] hover:text-white"
              >
                latest
              </a>
              <a
                href="#contact"
                className="uppercase tracking-[0.16em] hover:text-white"
              >
                contact
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* OPTIONAL BACKGROUND GRADIENTS */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute top-40 -right-32 h-96 w-96 rounded-full bg-cyan-400/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-[40rem] -translate-x-1/2 translate-y-1/3 rounded-[999px] bg-gradient-to-r from-purple-500/20 via-fuchsia-500/25 to-cyan-400/20 blur-3xl" />
      </div>

      {/* 1) HERO – all text from Hero doc, second line glitched */}
      <section className="max-w-6xl mx-auto px-6 pt-0 pb-24 border-t border-white/10">
        <div className="flex items-start justify-between mb-16">
        <p className="text-base md:text-lg text-gray-400">{hero?.greeting}</p>

          {/* Right: blinking dot + editable small purple text */}
          {hero?.currentRole && (
            <div className="flex items-center gap-2 text-xs">
              <span
                className="inline-block h-2 w-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: hero.roleDotColor || "#ec4899",
                }}
              />
              <span
                className="lowercase tracking-[0.25em]"
                style={{
                  color: hero.roleColor || "#ffffff",
                }}
              >
                {hero.currentRole}
              </span>
            </div>
          )}
        </div>

        <div className="text-4xl md:text-6xl lg:text-7xl leading-tight font-medium max-w-4xl">
          <p>{hero?.line1}</p>

          <motion.p
            className="mt-2 inline-block"
            variants={{
              initial: { x: 0 },
              animate: {
                x: [0, -1, 1, -1, 0],
                transition: {
                  duration: 0.50,
                  repeat: Infinity,
                  repeatDelay: 0,
                  ease: "easeInOut",
                },
              },
            }}
            initial="initial"
            animate="animate"
          >
            {hero?.line2}
          </motion.p>
        </div>
      </section>

      {/* 2) PROJECTS – STACKED + ANIMATED */}
      <section
        id="projects"
        className="max-w-6xl mx-auto px-6 pb-25 border-t border-white/10 pt-20"
      >
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="ext-xs tracking-[0.3em] text-gray-400 mb-3">
              .projects
            </p>
          </div>
          <p className="text-xs text-gray-500">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>

        {projects.length === 0 && (
          <p className="text-gray-500 text-sm">
            No projects yet. Add some in Sanity Studio.
          </p>
        )}

        <div className="space-y-0">
          {projects.map((project, index) => (
            <motion.article
              key={project._id}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 hover:border-purple-400/80 transition-colors duration-300"
              style={{
                marginTop: index === 0 ? 0 : -40,
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6, scale: 1.01 }}
            >
              {project.coverImage && (
                <div className="mb-4 overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={urlFor(project.coverImage)
                      .width(1200)
                      .height(600)
                      .url()}
                    alt={project.title || "Project image"}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {project.year || "—"}
                  </p>
                  <h3 className="text-xl md:text-2xl font-semibold">
                    {project.title || "Untitled project"}
                  </h3>
                </div>
                {project.caseStudyUrl && (
                  <a
                    href={project.caseStudyUrl}
                    target="_blank"
                    className="text-xs uppercase tracking-[0.2em] text-cyan-300 hover:text-cyan-100"
                  >
                    View ↗
                  </a>
                )}
              </div>

              <p className="text-sm text-gray-200 mb-4 max-w-2xl">
                {project.summary}
              </p>

              <div className="flex gap-4 text-xs">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    className="text-purple-300 hover:text-purple-100 underline-offset-4 hover:underline"
                  >
                    Live site
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

    {/* 3) ABOUT – text left, big image right */}
    <section
  id="about-section"
  className="max-w-6xl mx-auto px-6 pb-24 border-t border-white/10 pt-12"
>
  <p className="ext-xs tracking-[0.3em] text-gray-400 mb-3">
    .about
  </p>

  <div className="grid md:grid-cols-2 gap-10 items-start">
    {/* Left: about text */}
    <div className="text-sm md:text-base text-gray-300 leading-relaxed space-y-4">
      <p>
        {profile?.bio ||
          "Write your about text in the Profile document in Sanity."}
      </p>
    </div>

    {/* Right: tall image filling the right side */}
    {profile?.avatar && (
      <div className="h-[420px] md:h-[520px] w-full rounded-3xl overflow-hidden border border-white/10">
        <img
          src={urlFor(profile.avatar).width(800).height(800).url()}
          alt={profile.name || "Profile photo"}
          className="w-full h-full object-cover"
        />
      </div>
    )}
  </div>
</section>

      {/* 4) PLAYGROUND – horizontal auto-scrolling strip of images */}
      <section
        id="playground"
        className="max-w-6xl mx-auto px-6 pb-24 border-t border-white/10 pt-12"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">
          .playground
        </p>

        {playgroundItems.length === 0 && (
          <p className="text-gray-500 text-sm">
            No playground experiments yet. Add some in Sanity Studio.
          </p>
        )}

        {playgroundItems.length > 0 && (
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            {/* gradient fades on edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent z-10" />

            <div className="playground-scroll gap-4 py-4 px-4">
              {[...playgroundItems, ...playgroundItems].map((item, idx) => (
                <div
                  key={`${item._id}-${idx}`}
                  className="relative flex-shrink-0 w-64 md:w-80 overflow-hidden rounded-2xl border border-white/10"
                >
                  {item.image && (
                    <img
                      src={urlFor(item.image).width(800).height(600).url()}
                      alt={item.title || "Playground experiment"}
                      className="h-40 md:h-52 w-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 5) LATEST NOTES – FROM SANITY */}
      <section
        id="latest"
        className="max-w-6xl mx-auto px-6 pb-32 border-t border-white/10 pt-12"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3">
          .latest notes
        </p>
        <div className="space-y-6 text-sm">
          {notes.map((note) => (
            <div key={note._id}>
              <h3 className="font-medium mb-1">{note.title}</h3>
              <p className="text-gray-400 text-xs">
                {note.date || "—"} · {note.type || "note"}
              </p>
            </div>
          ))}

          {notes.length === 0 && (
            <p className="text-gray-500 text-sm">
              Add some Notes in Sanity to show them here.
            </p>
          )}
        </div>
      </section>

      {/* 6) CONTACT – from Contact doc */}
      <section
        id="contact"
        className="max-w-6xl mx-auto px-6 pb-16 border-t border-white/10 pt-12 text-sm text-gray-300"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3">
          .contact
        </p>

        <div className="space-y-4 max-w-xl">
          <h3 className="text-base md:text-lg font-medium">
            {contact?.headline || "Let’s work together"}
          </h3>
          <p>
            {contact?.body ||
              "Feel free to reach out for collaborations, freelance work, or just to say hi."}
          </p>

          <div className="flex flex-wrap gap-4 items-center mt-2">
            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center text-xs uppercase tracking-[0.25em] border border-white/40 rounded-full px-4 py-2 hover:bg-white hover:text-black transition-colors"
              >
                {contact.email}
              </a>
            )}

            {contact?.portfolioUrl && contact?.portfolioLink && (
              <a
                href={contact.portfolioUrl}
                target="_blank"
                className="text-xs uppercase tracking-[0.2em] text-cyan-300 hover:text-cyan-100"
              >
                {contact.portfolioLink} ↗
              </a>
            )}

            {contact?.secondaryUrl && contact?.secondaryLabel && (
              <a
                href={contact.secondaryUrl}
                target="_blank"
                className="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white"
              >
                {contact.secondaryLabel} ↗
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
