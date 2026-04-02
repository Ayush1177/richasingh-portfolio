import { GetServerSideProps } from "next";
import { groq } from "next-sanity";
import { client, urlFor } from "../sanity/client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import RotatingText from "../components/RotatingText";
import CustomCursor from "../components/CustomCursor";

const heroQuery = groq`*[_type == "hero"][0]`;

const profileQuery = groq`*[_type == "profile"][0]{
   name, 
   headline, 
   bio, 
   introLine,
   aboutLong, 
   avatar,
   location, 
   locationSubtext,
   currentRole,
   currentRoleSubtext,
   education,
   educationSubtext,
   featuredSection{
      label,
      title,
      description,
      image,
      link,
      linkLabel
    },
    stackItems[]{
      title,
      subtitle,
      icon
    },
    experience[]{
      period,
      company,
      role,
      description
    },
    socials[]{
      label,
      url
    }
  }
`;

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
  label?: string;
  url?: string;
};

type StackItem = {
  title?: string;
  subtitle?: string;
  icon?: any;
};

type ExperienceItem = {
  period?: string;
  company?: string;
  role?: string;
  description?: string;
};

type FeaturedSection = {
  label?: string;
  title?: string;
  description?: string;
  image?: any;
  link?: string;
  linkLabel?: string;
};

type Profile = {
  name?: string;
  headline?: string;
  bio?: string;
  introLine?: string;
  aboutLong?: string;
  avatar?: any;
  location?: string;
  locationSubtext?: string;
  currentRole?: string;
  currentRoleSubtext?: string;
  education?: string;
  educationSubtext?: string;
  featuredSection?: FeaturedSection;
  stackItems?: StackItem[];
  experience?: ExperienceItem[];
  socials?: SocialLink[];
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

function EditorialProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  const accentPalette = [
    {
      bg: "#ff6a1a",
      text: "#141414",
      border: "#ff8f52",
      imageWrap: "#f4b38a",
    },
    {
      bg: "#ece9e4",
      text: "#af5a17",
      border: "#d7d1ca",
      imageWrap: "#f3f0eb",
    },
    {
      bg: "#2f3c44",
      text: "#d6f3d7",
      border: "#43545f",
      imageWrap: "#cfead0",
    },
  ];

  const fallback = accentPalette[index % accentPalette.length];
  const custom = project.stackColor?.hex;

  const backgroundColor = custom || fallback.bg;
  const cardText =
    backgroundColor?.toLowerCase() === "#ece9e4" ? "#a55416" : fallback.text;
  const borderColor = custom ? `${custom}99` : fallback.border;
  const imageWrap = custom ? `${custom}33` : fallback.imageWrap;

  return (
    <motion.button
      type="button"
      data-cursor="card"
      onClick={() => onOpen(project)}
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group block w-full text-left"
    >
      <div
        className="relative overflow-hidden rounded-[1.6rem] border"
        style={{
          backgroundColor,
          borderColor,
          color: cardText,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_110px] gap-0 min-h-[180px] lg:min-h-[210px]">
          <div
            className="relative m-3 rounded-[1.2rem] overflow-hidden min-h-[170px] lg:min-h-[calc(100%-24px)]"
            style={{ backgroundColor: imageWrap }}
          >
            {project.coverImage ? (
              <motion.img
                src={urlFor(project.coverImage).width(900).height(700).url()}
                alt={project.title || "Project image"}
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ) : (
              <div className="h-full w-full bg-black/10" />
            )}
          </div>

          <div className="px-5 pb-5 pt-4 lg:px-4 lg:pt-5 lg:pb-4 flex flex-col justify-between">
            <div className="text-[13px] uppercase tracking-[0.18em] opacity-90">
              <span>{project.year || "2024"}</span>
            </div>

            <div className="mt-3">
              <h3 className="text-[2rem] md:text-[2.6rem] leading-[0.95] font-medium tracking-[-0.04em]">
                {project.title || "Project title"}
              </h3>

              <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed opacity-85">
                {project.summary || "Project summary goes here."}
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center pr-6">
            <motion.div
              className="text-5xl leading-none"
              whileHover={{ x: 4, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              ↗
            </motion.div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-white/0 via-white/5 to-white/0" />
      </div>
    </motion.button>
  );
}

export default function Home({
  hero,
  profile,
  projects,
  playgroundItems,
  notes,
  contact,
}: HomeProps) {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const closeProjects = () => {
    setSelectedProject(null);
    setIsProjectsOpen(false);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  const closeAbout = () => {
    setIsAboutOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (selectedProject) {
          setSelectedProject(null);
          return;
        }

        if (isAboutOpen) {
          setIsAboutOpen(false);
          return;
        }

        if (isProjectsOpen) {
          closeProjects();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    if (isProjectsOpen || isAboutOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isProjectsOpen, isAboutOpen, selectedProject]);

  return (
    <>
      <CustomCursor />

      <main className="min-h-screen relative overflow-hidden page-grid-bg text-zinc-900 dark:text-white">
        <section className="max-w-6xl mx-auto px-6 pt-6 pb-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="border border-black/15 dark:border-white/40 rounded-3xl px-4 py-3 md:px-6 md:py-4 bg-white/70 dark:bg-black/70 backdrop-blur-xl">
                <div className="grid grid-cols-1 md:grid-cols-[1.2fr_repeat(5,minmax(0,1fr))] gap-0 items-stretch text-xs md:text-[13px]">
                  <div className="flex items-center justify-center border-b border-black/10 dark:border-white/15 md:border-b-0 md:border-r border-black/15 dark:border-white/25 min-h-[40px]">
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

                  <button
                    type="button"
                    onClick={() => setIsProjectsOpen(true)}
                    className="hidden md:flex items-center justify-center border-r border-black/15 dark:border-white/25 text-zinc-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors min-h-[40px]"
                  >
                    <span className="uppercase tracking-[0.2em] text-[11px]">
                      projects
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAboutOpen(true)}
                    className="hidden md:flex items-center justify-center border-r border-black/15 dark:border-white/25 text-zinc-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors min-h-[40px]"
                  >
                    <span className="uppercase tracking-[0.2em] text-[11px]">
                      about
                    </span>
                  </button>

                  <a
                    href="#playground"
                    className="hidden md:flex items-center justify-center border-r border-black/15 dark:border-white/25 text-zinc-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors min-h-[40px]"
                  >
                    <span className="uppercase tracking-[0.2em] text-[11px]">
                      playground
                    </span>
                  </a>

                  <a
                    href="#latest"
                    className="hidden md:flex items-center justify-center border-r border-black/15 dark:border-white/25 text-zinc-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors min-h-[40px]"
                  >
                    <span className="uppercase tracking-[0.2em] text-[11px]">
                      latest
                    </span>
                  </a>

                  <a
                    href="#contact"
                    className="hidden md:flex items-center justify-center text-zinc-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors min-h-[40px]"
                  >
                    <span className="uppercase tracking-[0.2em] text-[11px]">
                      contact
                    </span>
                  </a>

                  <div className="flex md:hidden flex-wrap gap-3 py-2 justify-center text-[11px] text-zinc-500 dark:text-gray-400 border-t border-black/10 dark:border-white/15 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsProjectsOpen(true)}
                      className="uppercase tracking-[0.16em] hover:text-black dark:hover:text-white"
                    >
                      projects
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAboutOpen(true)}
                      className="uppercase tracking-[0.16em] hover:text-black dark:hover:text-white"
                    >
                      about
                    </button>
                    <a
                      href="#playground"
                      className="uppercase tracking-[0.16em] hover:text-black dark:hover:text-white"
                    >
                      playground
                    </a>
                    <a
                      href="#latest"
                      className="uppercase tracking-[0.16em] hover:text-black dark:hover:text-white"
                    >
                      latest
                    </a>
                    <a
                      href="#contact"
                      className="uppercase tracking-[0.16em] hover:text-black dark:hover:text-white"
                    >
                      contact
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <ThemeToggle />
          </div>
        </section>

        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-purple-500/10 dark:bg-purple-500/30 blur-3xl" />
          <div className="absolute top-40 -right-32 h-96 w-96 rounded-full bg-cyan-400/10 dark:bg-cyan-400/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-72 w-[40rem] -translate-x-1/2 translate-y-1/3 rounded-[999px] bg-gradient-to-r from-purple-500/8 via-fuchsia-500/10 to-cyan-400/8 dark:from-purple-500/20 dark:via-fuchsia-500/25 dark:to-cyan-400/20 blur-3xl" />
        </div>

        <section className="max-w-6xl mx-auto px-6 pt-0 pb-24 border-t border-black/10 dark:border-white/10">
          <div className="flex items-start justify-between mb-16">
            <p className="text-base md:text-lg text-zinc-900 dark:text-zinc-100">
              {hero?.greeting}
            </p>

            {hero?.currentRole && (
              <div className="flex items-center gap-2 text-xs">
                <span
                  className="inline-block h-2 w-2 rounded-full animate-pulse"
                  style={{
                    backgroundColor: hero.roleDotColor?.hex || "#ec4899",
                  }}
                />
                <span className="lowercase tracking-[0.25em] text-zinc-700 dark:text-zinc-200">
                  {hero.currentRole}
                </span>
              </div>
            )}
          </div>

          <div className="text-4xl md:text-6xl lg:text-7xl leading-tight font-medium max-w-4xl space-y-2">
            {hero?.line1 && (
              <p
                style={{ color: hero.line1Color?.hex || undefined }}
                className="text-zinc-900 dark:text-zinc-100"
              >
                {hero.line1}
              </p>
            )}

            {hero?.line2 && (
              <p
                style={{ color: hero.line2Color?.hex || undefined }}
                className="text-zinc-900 dark:text-zinc-100"
              >
                {hero.line2}
              </p>
            )}

            {hero?.rotatingLines && hero.rotatingLines.length > 0 && (
              <RotatingText
                text={hero.rotatingLines.map((item) => item.text || "")}
                colors={hero.rotatingLines.map((item) =>
                  item.color?.hex ? item.color.hex : undefined
                )}
                durationMs={2500}
                slideOffset={40}
                className="text-4xl md:text-6xl lg:text-7xl"
              />
            )}
          </div>
        </section>

        <section
          id="about-section"
          className="max-w-6xl mx-auto px-6 pb-24 border-t border-black/10 dark:border-white/10 pt-16"
        >
          <p className="text-xs tracking-[0.3em] text-zinc-500 dark:text-gray-400 mb-3">
            .about
          </p>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="space-y-5">
              <p
                className="inline-block text-2xl md:text-3xl font-medium tracking-[-0.5px] leading-snug text-zinc-900 dark:text-zinc-100"
                style={{
                  fontFamily:
                    '"Manrope", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                }}
              >
                {profile?.headline ||
                  "I design for clarity and build with intent."}
              </p>

              <p className="max-w-xl text-sm md:text-base leading-relaxed text-zinc-800 dark:text-zinc-300 whitespace-pre-line">
                {profile?.bio ||
                  "Write your short bio in the Profile document in Sanity Studio."}
              </p>

              <button
                type="button"
                onClick={() => setIsAboutOpen(true)}
                className="inline-flex items-center text-xs uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-200 mt-4"
              >
                View full about ↗
              </button>
            </div>

            {profile?.avatar && (
              <motion.div
                className="relative h-[420px] md:h-[520px] w-full rounded-3xl overflow-hidden border border-black/10 dark:border-white/10"
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

                <motion.div
                  className="pointer-events-none absolute -inset-[200%]"
                  style={{
                    backgroundImage: 'url("/noise-texture.png")',
                    backgroundRepeat: "repeat",
                    opacity: 0.08,
                  }}
                  animate={{
                    x: ["-1%", "1%", "-1%"],
                    y: ["-1%", "1%", "-1%"],
                  }}
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

        <section
          id="playground"
          className="max-w-6xl mx-auto px-6 pb-24 border-t border-black/10 dark:border-white/10 pt-12"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 dark:text-gray-400 mb-4">
            .playground
          </p>

          {playgroundItems.length === 0 && (
            <p className="text-zinc-600 dark:text-gray-500 text-sm">
              No playground experiments yet. Add some in Sanity Studio.
            </p>
          )}

          {playgroundItems.length > 0 && (
            <div className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/5 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--background)] to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--background)] to-transparent z-10" />

              <div className="playground-scroll gap-4 py-4 px-4">
                {[...playgroundItems, ...playgroundItems].map((item, idx) => (
                  <div
                    key={`${item._id}-${idx}`}
                    className="relative flex-shrink-0 w-64 md:w-80 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"
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

        <section
          id="latest"
          className="max-w-6xl mx-auto px-6 pb-32 border-t border-black/10 dark:border-white/10 pt-12"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 mb-3">
            .latest notes
          </p>

          <div className="space-y-6 text-sm">
            {notes.map((note) => (
              <div key={note._id}>
                <h3 className="font-medium mb-1 text-zinc-900 dark:text-zinc-100">
                  {note.title}
                </h3>
                <p className="text-xs text-zinc-700 dark:text-zinc-400">
                  {note.date || "—"} · {note.type || "note"}
                </p>
              </div>
            ))}

            {notes.length === 0 && (
              <p className="text-sm text-zinc-700 dark:text-zinc-400">
                Add some Notes in Sanity to show them here.
              </p>
            )}
          </div>
        </section>

        <section
          id="contact"
          className="max-w-6xl mx-auto px-6 pb-16 border-t border-black/10 dark:border-white/10 pt-12 text-sm"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 mb-3">
            .contact
          </p>

          <div className="space-y-4 max-w-xl">
            <h3 className="text-base md:text-lg font-medium text-zinc-900 dark:text-zinc-100">
              {contact?.headline || "Let’s work together"}
            </h3>
            <p className="text-zinc-800 dark:text-zinc-300">
              {contact?.body ||
                "Feel free to reach out for collaborations, freelance work, or just to say hi."}
            </p>

            <div className="flex flex-wrap gap-4 items-center mt-2">
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center text-xs uppercase tracking-[0.25em] border border-black/20 dark:border-white/40 rounded-full px-4 py-2 text-zinc-900 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  {contact.email}
                </a>
              )}

              {contact?.portfolioUrl && contact?.portfolioLink && (
                <a
                  href={contact.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300"
                >
                  {contact.portfolioLink} ↗
                </a>
              )}

              {contact?.secondaryUrl && contact?.secondaryLabel && (
                <a
                  href={contact.secondaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  {contact.secondaryLabel} ↗
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {isProjectsOpen && (
          <motion.div
            className="fixed inset-0 z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/68 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeProjects}
            />

            <motion.div
              className="absolute inset-0 overflow-y-auto"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="min-h-screen relative">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:120px_120px] opacity-[0.18]" />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6">
                  <div className="rounded-[2rem] border border-white/10 bg-[rgba(6,6,8,0.88)] backdrop-blur-2xl overflow-hidden shadow-2xl">
                    <div className="flex items-start justify-between gap-6 border-b border-white/10 px-5 md:px-8 py-5 md:py-6">
                      <div className="max-w-3xl">
                        <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/40 mb-2">
                          .projects
                        </p>
                        <h2 className="text-[3rem] md:text-[6rem] leading-[0.9] tracking-[-0.08em] text-white/80 font-medium">
                          projects
                        </h2>
                        <p className="mt-6 max-w-3xl text-[1.25rem] md:text-[2.3rem] leading-[1.08] tracking-[-0.04em] text-white/68">
                          Experiences that combine empathy, systems thinking,
                          and simplicity to create meaningful user experiences
                          at scale.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={closeProjects}
                        className="relative z-10 inline-flex items-center justify-center h-11 w-11 md:h-12 md:w-12 rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white hover:text-black transition-colors"
                        aria-label="Close projects overlay"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="px-5 md:px-8 py-8 md:py-10">
                      {projects.length === 0 ? (
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white/60">
                          No projects yet. Add some in Sanity Studio.
                        </div>
                      ) : (
                        <div className="space-y-6 md:space-y-8">
                          {projects.map((project, index) => (
                            <EditorialProjectCard
                              key={project._id}
                              project={project}
                              index={index}
                              onOpen={(item) => setSelectedProject(item)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {selectedProject && (
                <motion.div
                  className="fixed inset-0 z-[110] bg-black/96"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:120px_120px] opacity-[0.18]" />
                  </div>

                  <motion.div
                    className="relative h-full overflow-y-auto"
                    initial={{ y: 36, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-24">
                      <div className="flex items-center justify-between border-b border-white/10 pb-5">
                        <div>
                          <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/40 mb-1">
                            .project detail
                          </p>
                          <h3 className="text-lg md:text-2xl font-medium text-white">
                            {selectedProject.title || "Project"}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={closeProjectDetails}
                            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 hover:bg-white hover:text-black transition-colors"
                          >
                            Back
                          </button>

                          <button
                            type="button"
                            onClick={closeProjects}
                            className="inline-flex items-center justify-center h-11 w-11 rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white hover:text-black transition-colors"
                            aria-label="Close project details"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <section className="pt-10 md:pt-14">
                        <h2 className="max-w-5xl text-[2.8rem] md:text-[5.8rem] leading-[0.92] tracking-[-0.08em] text-white/80 font-medium">
                          {selectedProject.title || "Project title"}
                        </h2>

                        <p className="mt-8 max-w-4xl text-[1.2rem] md:text-[2.2rem] leading-[1.08] tracking-[-0.04em] text-white/68">
                          {selectedProject.summary ||
                            "A project summary that introduces the problem space, design thinking, and project outcome in a concise way."}
                        </p>
                      </section>

                      <section className="mt-12 border-t border-[#9c8d1d] pt-8">
                        <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-[#1a1a1a]">
                          {selectedProject.coverImage ? (
                            <img
                              src={urlFor(selectedProject.coverImage)
                                .width(1800)
                                .height(1200)
                                .url()}
                              alt={selectedProject.title || "Project image"}
                              className="w-full h-[240px] md:h-[620px] object-cover"
                            />
                          ) : (
                            <div className="w-full h-[240px] md:h-[620px] bg-gradient-to-br from-zinc-700 to-zinc-950" />
                          )}
                        </div>
                      </section>

                      <section className="mt-12 grid lg:grid-cols-[1.3fr_0.7fr] gap-12 items-start">
                        <div className="space-y-14">
                          <div className="grid md:grid-cols-2 gap-12">
                            <div>
                              <p className="text-[#d6bf24] text-[1.05rem] md:text-[1.35rem] mb-5">
                                problem
                              </p>
                              <p className="text-white/72 text-lg md:text-[1.15rem] leading-[1.7]">
                                Existing solutions were often fragmented,
                                over-technical, or lacked a user-first
                                interface. The challenge was to simplify
                                complexity into a clear and elegant experience.
                              </p>
                            </div>

                            <div>
                              <p className="text-[#d6bf24] text-[1.05rem] md:text-[1.35rem] mb-5">
                                solution
                              </p>
                              <p className="text-white/72 text-lg md:text-[1.15rem] leading-[1.7]">
                                The project focused on clarity, structure, and
                                intuitive interaction patterns to build a system
                                that feels both modern and easy to use.
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-white/80 text-lg md:text-xl leading-[1.8] max-w-4xl">
                              This detail page is intentionally designed like an
                              editorial case study. Later we can make this fully
                              dynamic with real case study blocks, richer
                              storytelling, additional images, process sections,
                              and motion transitions.
                            </p>
                          </div>

                          {selectedProject.coverImage && (
                            <div className="rounded-[1.6rem] overflow-hidden border border-white/10">
                              <img
                                src={urlFor(selectedProject.coverImage)
                                  .width(1400)
                                  .height(1000)
                                  .url()}
                                alt={selectedProject.title || "Project visual"}
                                className="w-full h-[240px] md:h-[480px] object-cover"
                              />
                            </div>
                          )}

                          <div className="pt-4">
                            {selectedProject.liveUrl && (
                              <a
                                href={selectedProject.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center rounded-full border border-white/20 px-5 py-3 text-sm text-white hover:bg-white hover:text-black transition-colors mr-3"
                              >
                                Live site ↗
                              </a>
                            )}

                            {selectedProject.caseStudyUrl && (
                              <a
                                href={selectedProject.caseStudyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center rounded-full border border-white/10 px-5 py-3 text-sm text-white/80 hover:text-white transition-colors"
                              >
                                Case study ↗
                              </a>
                            )}
                          </div>
                        </div>

                        <aside className="lg:sticky lg:top-8 border-l border-white/10 pl-8 space-y-10">
                          <div>
                            <p className="text-[#d6bf24] text-lg mb-2">year</p>
                            <p className="text-white/82 text-3xl">
                              {selectedProject.year || "2024"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[#d6bf24] text-lg mb-2">
                              category
                            </p>
                            <p className="text-white/82 text-xl">
                              {selectedProject.tags?.[0] || "UI / UX"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[#d6bf24] text-lg mb-2">tools</p>
                            <p className="text-white/82 text-xl">
                              {selectedProject.tags?.slice(0, 3).join(", ") ||
                                "Figma, Framer, Design systems"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[#d6bf24] text-lg mb-2">
                              summary
                            </p>
                            <p className="text-white/68 text-base leading-relaxed">
                              {selectedProject.summary ||
                                "A concise summary of the project, the design challenge, and the experience direction."}
                            </p>
                          </div>
                        </aside>
                      </section>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAboutOpen && (
          <motion.div
            className="fixed inset-0 z-[95]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/68 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAbout}
            />

            <motion.div
              className="absolute inset-0 overflow-y-auto"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="min-h-screen relative">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:120px_120px] opacity-[0.18]" />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6">
                  <div className="rounded-[2rem] border border-white/10 bg-[rgba(6,6,8,0.88)] backdrop-blur-2xl overflow-hidden shadow-2xl">
                    <div className="flex items-start justify-between gap-6 border-b border-white/10 px-5 md:px-8 py-5 md:py-6">
                      <div className="max-w-4xl">
                        <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/40 mb-2">
                          .about
                        </p>
                        <h2 className="text-[3rem] md:text-[6rem] leading-[0.9] tracking-[-0.08em] text-white/80 font-medium">
                          ...
                        </h2>
                        <p className="mt-6 max-w-4xl text-[1.25rem] md:text-[2.3rem] leading-[1.08] tracking-[-0.04em] text-white/68 whitespace-pre-line">
                          {profile?.introLine ?? "Write your intro line in the Profile document in Sanity Studio."}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={closeAbout}
                        className="relative z-10 inline-flex items-center justify-center h-11 w-11 md:h-12 md:w-12 rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white hover:text-black transition-colors"
                        aria-label="Close about overlay"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="px-5 md:px-8 py-8 md:py-10">
                      <div className="space-y-14">
                        <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-12 items-start">
                          {profile?.avatar && (
                            <div className="rounded-[1.8rem] overflow-hidden border border-white/10 bg-white/5">
                              <img
                                src={urlFor(profile.avatar)
                                  .width(1200)
                                  .height(1400)
                                  .url()}
                                alt={profile.name || "Profile image"}
                                className="w-full h-[320px] md:h-[700px] object-cover"
                              />
                            </div>
                          )}

                          <div className="space-y-8">
                            {profile?.headline && (
                              <div>
                                <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/35 mb-4">
                                  .about me
                                </p>
                                <p className="max-w-3xl text-[1.5rem] md:text-[3rem] leading-[1.06] tracking-[-0.05em] text-white/80 whitespace-pre-line">
                                  {profile.headline}
                                </p>
                              </div>
                            )}

                            <div className="border-t border-white/10 pt-6">
                              <p className="max-w-2xl text-sm md:text-lg leading-[1.9] text-white/65 whitespace-pre-line">
                                {profile?.aboutLong ||
                                  "Write your long editorial about text in the Profile document in Sanity Studio."}
                              </p>
                            </div>
                          </div>
                        </section>

                        {(profile?.education ||
                          profile?.educationSubtext ||
                          profile?.location ||
                          profile?.locationSubtext ||
                          profile?.currentRole ||
                          profile?.currentRoleSubtext) && (
                            <section className="border-t border-white/10 pt-8">
                              <div className="grid md:grid-cols-3 gap-10 md:gap-8">
                                <div className="space-y-2">
                                  <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/35">
                                    .education
                                  </p>
                                  <p className="text-white/82 text-[1.1rem] md:text-[1.45rem] leading-snug">
                                    {profile?.education || "Add education"}
                                  </p>
                                  {profile?.educationSubtext && (
                                    <p className="text-white/55 text-sm md:text-base leading-relaxed">
                                      {profile.educationSubtext}
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/35">
                                    .location
                                  </p>
                                  <p className="text-white/82 text-[1.1rem] md:text-[1.45rem] leading-snug">
                                    {profile?.location || "Add location"}
                                  </p>
                                  {profile?.locationSubtext && (
                                    <p className="text-white/55 text-sm md:text-base leading-relaxed">
                                      {profile.locationSubtext}
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/35">
                                    .current work
                                  </p>
                                  <p className="text-white/82 text-[1.1rem] md:text-[1.45rem] leading-snug">
                                    {profile?.currentRole || "Add current work"}
                                  </p>
                                  {profile?.currentRoleSubtext && (
                                    <p className="text-white/55 text-sm md:text-base leading-relaxed">
                                      {profile.currentRoleSubtext}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </section>
                          )}

                        {profile?.experience && profile.experience.length > 0 && (
                          <section className="border-t border-white/10 pt-8">
                            <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/35 mb-6">
                              .work experience
                            </p>

                            <div className="space-y-0">
                              {profile.experience.map((item, index) => (
                                <div
                                  key={`${item.company || "experience"}-${index}`}
                                  className="grid md:grid-cols-[220px_1fr_1.3fr] gap-6 md:gap-10 py-8 border-t border-white/10 first:border-t-0"
                                >
                                  <div>
                                    <p className="text-white/82 text-[1.75rem] md:text-[2.2rem] leading-none tracking-[-0.04em]">
                                      {item.period}
                                    </p>
                                  </div>

                                  <div>
                                    <h4 className="text-white/82 text-[1.8rem] md:text-[2.5rem] leading-[0.95] tracking-[-0.05em]">
                                      {item.company || "Company"}
                                    </h4>
                                    {item.role && (
                                      <p className="mt-3 text-white/68 text-base md:text-[1.1rem] leading-relaxed">
                                        {item.role}
                                      </p>
                                    )}
                                  </div>

                                  <div>
                                    {item.description && (
                                      <p className="max-w-xl text-white/62 text-sm md:text-lg leading-[1.8] whitespace-pre-line">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}

                        {profile?.featuredSection &&
                          (profile.featuredSection.title ||
                            profile.featuredSection.description ||
                            profile.featuredSection.image) && (
                            <section className="border-t border-white/10 pt-8">
                              <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/35 mb-4">
                                .{profile.featuredSection.label || "featured"}
                              </p>

                              <div className="rounded-[1.6rem] overflow-hidden border border-white/10 bg-white/5">
                                {profile.featuredSection.image && (
                                  <img
                                    src={urlFor(profile.featuredSection.image)
                                      .width(1200)
                                      .height(800)
                                      .url()}
                                    alt={
                                      profile.featuredSection.title ||
                                      "Featured section image"
                                    }
                                    className="w-full h-[220px] md:h-[320px] object-cover"
                                  />
                                )}

                                <div className="p-5 md:p-6">
                                  {profile.featuredSection.title && (
                                    <h3 className="text-white/85 text-xl md:text-2xl mb-3">
                                      {profile.featuredSection.title}
                                    </h3>
                                  )}

                                  {profile.featuredSection.description && (
                                    <p className="text-white/65 leading-relaxed whitespace-pre-line">
                                      {profile.featuredSection.description}
                                    </p>
                                  )}

                                  {profile.featuredSection.link &&
                                    profile.featuredSection.linkLabel && (
                                      <a
                                        href={profile.featuredSection.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center mt-5 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-xs uppercase tracking-[0.2em] text-white/80 hover:bg-white hover:text-black transition-colors"
                                      >
                                        {profile.featuredSection.linkLabel} ↗
                                      </a>
                                    )}
                                </div>
                              </div>
                            </section>
                          )}

                        {profile?.stackItems && profile.stackItems.length > 0 && (
                          <section className="border-t border-white/10 pt-8">
                            <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/35 mb-4">
                              .stack
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">
                              {profile.stackItems.map((item, index) => (
                                <div
                                  key={`${item.title || "stack"}-${index}`}
                                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                                >
                                  {item.icon && (
                                    <img
                                      src={urlFor(item.icon)
                                        .width(120)
                                        .height(120)
                                        .url()}
                                      alt={item.title || "Stack icon"}
                                      className="h-10 w-10 object-cover rounded-lg mb-3"
                                    />
                                  )}

                                  <h4 className="text-white/85">
                                    {item.title}
                                  </h4>

                                  {item.subtitle && (
                                    <p className="text-white/55 mt-1 text-sm leading-relaxed">
                                      {item.subtitle}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </section>
                        )}

                        {profile?.socials && profile.socials.length > 0 && (
                          <section className="border-t border-white/10 pt-8">
                            <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/35 mb-4">
                              .links
                            </p>

                            <div className="flex flex-wrap gap-3">
                              {profile.socials.map((item, index) => (
                                <a
                                  key={`${item.label || "link"}-${index}`}
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-xs uppercase tracking-[0.2em] text-white/80 hover:bg-white hover:text-black transition-colors"
                                >
                                  {item.label || "Link"} ↗
                                </a>
                              ))}
                            </div>
                          </section>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}