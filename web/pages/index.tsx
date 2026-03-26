import { GetServerSideProps } from "next";
import { groq } from "next-sanity";
import { client, urlFor } from "../sanity/client";
import { motion } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";
import RotatingText from "../components/RotatingText";

const heroQuery = groq`*[_type == "hero"][0]`;
const profileQuery = groq`*[_type == "profile"][0]`;
const projectsQuery = groq`*[_type == "project"] | order(year desc){
  _id,
  title,
  year,
  summary,
  liveUrl,
  caseStudyUrl,
  coverImage,
  tags,
  stackColor
}`;
const playgroundQuery = groq`*[_type == "playgroundItem"] | order(year desc, _createdAt desc)`;
const notesQuery = groq`*[_type == "note"] | order(date desc)[0..2]`;
const contactQuery = groq`*[_type == "contact"][0]`;

type RotatingLine = {
  text?: string;
  color?: { hex?: string };
};

type Hero = {
  greeting?: string;
  line1?: string;
  line1Color?: { hex?: string };
  line2?: string;
  line2Color?: { hex?: string };
  rotatingLines?: RotatingLine[];
  currentRole?: string;
  roleColor?: { hex?: string };
  roleDotColor?: { hex?: string };
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
  tags?: string[];
  stackColor?: { hex?: string };
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
}: HomeProps) {
  return (
    <main className="min-h-screen relative overflow-hidden page-grid-bg text-white">
      {/* TOP TABLE-LIKE BAR */}
      <section className="max-w-6xl mx-auto px-6 pt-6 pb-10">
        <div className="flex items-center justify-between gap-4">
          {/* LEFT: nav bar */}
          <div className="flex-1">
            <div className="border border-white/40 rounded-3xl px-4 py-3 md:px-6 md:py-4 bg-black/70 backdrop-blur-xl">
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_repeat(5,minmax(0,1fr))] gap-0 items-stretch text-xs md:text-[13px]">
                {/* Left cell: GIF */}
                <div className="flex items-center justify-center border-b border-white/15 md:border-b-0 md:border-r border-white/25 min-h-[40px]">
                  <motion.img
                    src="/gif-hero.gif"
                    alt="Hero icon"
                    className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
                    animate={{ x: [-4, 4, -4] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>

                {/* Desktop nav: use pages */}
                <a
                  href="/projects"
                  className="hidden md:flex items-center justify-center border-r border-white/25 text-gray-200 hover:text-white transition-colors min-h-[40px]"
                >
                  <span className="uppercase tracking-[0.2em] text-[11px]">
                    projects
                  </span>
                </a>

                <a
                  href="/about"
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

                {/* Mobile nav */}
                <div className="flex md:hidden flex-wrap gap-3 py-2 justify-center text-[11px] text-gray-400 border-t border-white/15 mt-2">
                  <a
                    href="/projects"
                    className="uppercase tracking-[0.16em] hover:text-white"
                  >
                    projects
                  </a>
                  <a
                    href="/about"
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
          </div>

          {/* RIGHT: toggle */}
          <ThemeToggle />
        </div>
      </section>

      {/* BG GRADIENTS */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute top-40 -right-32 h-96 w-96 rounded-full bg-cyan-400/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-[40rem] -translate-x-1/2 translate-y-1/3 rounded-[999px] bg-gradient-to-r from-purple-500/20 via-fuchsia-500/25 to-cyan-400/20 blur-3xl" />
      </div>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-0 pb-24 border-t border-white/10">
        <div className="flex items-start justify-between mb-16">
          {/* greeting */}
          <p className="text-base md:text-lg text-foreground">
            {hero?.greeting}
          </p>

          {/* role + dot */}
          {hero?.currentRole && (
            <div className="flex items-center gap-2 text-xs">
              <span
                className="inline-block h-2 w-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: hero.roleDotColor?.hex || "#ec4899",
                }}
              />
              <span
                className="lowercase tracking-[0.25em]"
                style={{ color: hero.roleColor?.hex || "var(--foreground)" }}
              >
                {hero.currentRole}
              </span>
            </div>
          )}
        </div>

        {/* main hero heading */}
        <div className="text-4xl md:text-6xl lg:text-7xl leading-tight font-medium max-w-4xl text-foreground space-y-2">
          {/* Line 1 */}
          {hero?.line1 && (
            <p style={{ color: hero.line1Color?.hex || "var(--foreground)" }}>
              {hero.line1}
            </p>
          )}

          {/* Line 2 */}
          {hero?.line2 && (
            <p style={{ color: hero.line2Color?.hex || "var(--foreground)" }}>
              {hero.line2}
            </p>
          )}

          {/* Line 3 – rotating items */}
          {hero?.rotatingLines && hero.rotatingLines.length > 0 && (
            <RotatingText
              text={hero.rotatingLines.map((item) => item.text || "")}
              colors={hero.rotatingLines.map((item) => item.color?.hex)}
              durationMs={2500}
              slideOffset={40}
              className="text-4xl md:text-6xl lg:text-7xl"
            />
          )}
        </div>
      </section>

      {/* ABOUT (overview) */}
      <section
        id="about-section"
        className="max-w-6xl mx-auto px-6 pb-24 border-t border-white/10 pt-16"
      >
        <p className="ext-xs tracking-[0.3em] text-gray-400 mb-3">
          .about
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left: text */}
          <div className="space-y-4 text-foreground">
            {/* Gradient heading similar to Framer snippet */}
            <p
              className="inline-block text-2xl md:text-3xl font-medium tracking-[-0.5px] leading-snug"
              style={{
                fontFamily:
                  '"Manrope", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundImage:
                  "linear-gradient(45deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.87) 58%)",
              }}
            >
              {profile?.headline ||
                "I design for clarity and build with intent."}
            </p>

            {/* Body copy */}
            <p className="text-sm md:text-base leading-relaxed">
              {profile?.bio ||
                "Write your about text in the Profile document in Sanity."}
            </p>

            <a
              href="/about"
              className="inline-flex items-center text-xs uppercase tracking-[0.25em] text-cyan-400 hover:text-cyan-200 mt-4"
            >
              View full about ↗
            </a>
          </div>

          {/* Right: image with depth + subtle moving texture */}
          {profile?.avatar && (
            <motion.div
              className="relative h-[420px] md:h-[520px] w-full rounded-3xl overflow-hidden border border-white/10"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.4, ease: "easeOut" },
              }}
            >
              <img
                src={urlFor(profile.avatar).width(600).height(600).url()}
                alt={profile.name || "Profile photo"}
                className="w-full h-full object-cover"
              />

              {/* subtle moving grain / texture overlay */}
              <motion.div
                className="pointer-events-none absolute -inset-[200%]"
                style={{
                  backgroundImage: 'url("/noise-texture.png")',
                  backgroundRepeat: "repeat",
                  opacity: 0.08,
                }}
                animate={{ x: ["-1%", "1%", "-1%"], y: ["-1%", "1%", "-1%"] }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* PLAYGROUND */}
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

      {/* LATEST NOTES */}
      <section
        id="latest"
        className="max-w-6xl mx-auto px-6 pb-32 border-t border-white/10 pt-12 text-foreground"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-foreground mb-3">
          .latest notes
        </p>

        <div className="space-y-6 text-sm">
          {notes.map((note) => (
            <div key={note._id}>
              <h3 className="font-medium mb-1 text-foreground">
                {note.title}
              </h3>
              <p className="text-xs text-foreground/70">
                {note.date || "—"} · {note.type || "note"}
              </p>
            </div>
          ))}

          {notes.length === 0 && (
            <p className="text-sm text-foreground/70">
              Add some Notes in Sanity to show them here.
            </p>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="max-w-6xl mx-auto px-6 pb-16 border-t border-white/10 pt-12 text-sm text-foreground"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-foreground mb-3">
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
                className="text-xs uppercase tracking-[0.2em] text-cyan-500 hover:text-cyan-600"
              >
                {contact.portfolioLink} ↗
              </a>
            )}

            {contact?.secondaryUrl && contact?.secondaryLabel && (
              <a
                href={contact.secondaryUrl}
                target="_blank"
                className="text-xs uppercase tracking-[0.2em] text-foreground/70 hover:text-foreground"
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