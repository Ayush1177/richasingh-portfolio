import { GetServerSideProps } from "next";
import { groq } from "next-sanity";
import { client, urlFor } from "../sanity/client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import RotatingText from "../components/RotatingText";
import CustomCursor from "../components/CustomCursor";
import { ArrowForwardIcon } from "@/components/icons/ArrowForwardIcon";

const heroQuery = groq`*[_type == "hero"][0]{
  greeting,
  line1,
  line1Color,
  line2,
  line2Color,
  rotatingLines[]{
    text,
    color
  },
  currentRole,
  roleColor,
  roleDotColor,
  heroImages[]{
    alt,
    rotation,
    image
  }
}`;

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
    url,
    icon
  }
}`;

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

const notesQuery = groq`
  *[_type == "note"] | order(date desc) {
    _id,
    title,
    date,
    type,
    slug,
    previewText,
    body,
    coverImage,
    readingTime,
    ctaLabel,
    ctaLink,
    sections[]{
      previewText,
      body,
      image
    }
  }
`;

const contactQuery = groq`*[_type == "contact"][0]{
  headline,
  body,
  email,
  links[]{
    label,
    url,
    icon
  },
  resumeLabel,
  resume{
    asset->{
      url
    }
  },
  resumeIcon
}`;

type RotatingLine = {
  text?: string;
  color?: { hex?: string };
};

type HeroImageItem = {
  alt?: string;
  rotation?: number;
  image?: any;
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
  heroImages?: HeroImageItem[];
};

type SocialLink = {
  label?: string;
  url?: string;
  icon?: any;
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

type NoteSection = {
  previewText?: string;
  body?: string;
  image?: any;
};

type Note = {
  _id: string;
  title?: string;
  date?: string;
  type?: string;
  slug?: { current?: string };
  previewText?: string;
  body?: string;
  coverImage?: any;
  readingTime?: string;
  ctaLabel?: string;
  ctaLink?: string;
  sections?: NoteSection[];
};

type ContactLink = {
  label?: string;
  url?: string;
  icon?: any;
};

type Contact = {
  headline?: string;
  body?: string;
  email?: string;
  links?: ContactLink[];
  resumeLabel?: string;
  resume?: {
    asset?: {
      url?: string;
    };
  };
  resumeIcon?: any;
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
  const cardText = backgroundColor?.toLowerCase() === "#ece9e4" ? "#a55416" : fallback.text;
  const borderColor = custom ? `${custom}99` : fallback.border;
  const imageWrap = custom ? `${custom}33` : fallback.imageWrap;

  const formatDate = (value?: string) =>
    value
      ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      : "";

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
        className="relative overflow-hidden rounded-[1.35rem] sm:rounded-[1.6rem] border"
        style={{
          backgroundColor,
          borderColor,
          color: cardText,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_110px] gap-0 min-h-[180px] lg:min-h-[210px]">
          <div
            className="relative m-3 rounded-[1rem] sm:rounded-[1.2rem] overflow-hidden min-h-[170px] lg:min-h-[calc(100%-24px)]"
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

          <div className="px-4 sm:px-5 pb-5 pt-4 lg:px-4 lg:pt-5 lg:pb-4 flex flex-col justify-between">
            <div className="text-[11px] sm:text-[13px] uppercase tracking-[0.18em] opacity-90">
              <span>{project.year || "2024"}</span>
            </div>

            <div className="mt-3">
              <h3 className="text-[1.65rem] sm:text-[2rem] md:text-[2.6rem] leading-[0.95] font-medium tracking-[-0.04em]">
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

function HeroImageStack({
  images = [],
}: {
  images?: { alt?: string; rotation?: number; image?: any }[];
}) {
  const validImages = images.filter((item) => item?.image);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (validImages.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % validImages.length);
    }, 800);

    return () => clearInterval(interval);
  }, [validImages.length]);

  if (!validImages.length) {
    return (
      <div className="relative mx-auto h-[250px] w-[200px] sm:h-[300px] sm:w-[230px] md:h-[380px] md:w-[290px] rounded-[2rem] border border-white/10 bg-white/[0.03]" />
    );
  }

  return (
    <div className="relative mx-auto h-[250px] w-[200px] sm:h-[300px] sm:w-[230px] md:h-[340px] md:w-[260px] lg:h-[380px] lg:w-[290px]">
      {validImages.map((item, index) => {
        const isActive = index === activeIndex;

        const fallbackRotations = [-8, 6, -5, 4, -3];
        const fallbackX = [-10, 12, -8, 10, -6];
        const fallbackY = [8, -6, 12, -4, 6];

        const rotate =
          item.rotation ?? fallbackRotations[index % fallbackRotations.length];
        const x = fallbackX[index % fallbackX.length];
        const y = fallbackY[index % fallbackY.length];

        return (
          <motion.div
            key={`${item.alt || "hero-image"}-${index}`}
            className="absolute inset-0 flex items-center justify-center"
            animate={{ zIndex: isActive ? 20 : index + 1 }}
          >
            <motion.div
              initial={false}
              animate={
                isActive
                  ? {
                    scale: 1,
                    rotate: 0,
                    x: 0,
                    y: 0,
                    opacity: 1,
                  }
                  : {
                    scale: 0.94,
                    rotate,
                    x,
                    y,
                    opacity: 0.78,
                  }
              }
              transition={{
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute h-[88%] w-[86%] overflow-hidden rounded-[1.35rem] sm:rounded-[1.6rem] border border-white/10 bg-zinc-900 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
            >
              <img
                src={urlFor(item.image).width(1200).height(1600).url()}
                alt={item.alt || "Hero image"}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredContactItem, setHoveredContactItem] = useState<string | null>(null)

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

  const closeContact = () => {
    setIsContactOpen(false);
  };

  const [isLatestOpen, setIsLatestOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [hoveredNote, setHoveredNote] = useState<Note | null>(null);
  const latestScrollRef = useRef<HTMLDivElement | null>(null);

  const previewNote = hoveredNote ?? notes?.[0] ?? null;

  const relatedNotes = notes
    .filter((note) => note._id !== selectedNote?._id)
    .slice(0, 3);

  const formatNoteDate = (value?: string) =>
    value
      ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      : "No date";

  const openLatest = () => {
    setSelectedNote(notes?.[0] ?? null);
    setIsLatestOpen(true);
  };

  const closeLatest = () => {
    setSelectedNote(null);
    setIsLatestOpen(false);
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      setIsDarkMode(root.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (selectedProject) {
          setSelectedProject(null);
          return;
        }

        if (isLatestOpen) {
          closeLatest();
          return;
        }

        if (isContactOpen) {
          closeContact();
          return;
        }

        if (isAboutOpen) {
          closeAbout();
          return;
        }

        if (isProjectsOpen) {
          closeProjects();
          return;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    if (
      isProjectsOpen ||
      isAboutOpen ||
      isContactOpen ||
      isLatestOpen ||
      selectedProject
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [
    isProjectsOpen,
    isAboutOpen,
    isContactOpen,
    isLatestOpen,
    selectedProject,
    notes,
  ]);

  const overlayBackdropClass =
    "absolute inset-0 bg-black/25 dark:bg-black/68";

  const overlayGridClass =
    "pointer-events-none absolute inset-0 opacity-[0.18] bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:120px_120px]";

  const overlayPanelClass =
    "rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 bg-[#5a5754] dark:bg-[#050509] overflow-hidden shadow-2xl";

  const overlayHeaderClass =
    "flex items-start justify-between gap-4 sm:gap-6 border-b border-white/10 px-4 sm:px-5 md:px-8 py-4 sm:py-5 md:py-6";

  const overlayLabelClass =
    "text-[11px] sm:text-xs tracking-[0.3em] text-white/45 mb-3";

  const overlayTitleClass = "text-white/85";
  const overlayBodyClass = "text-white/72";
  const overlayMutedClass = "text-white/55";
  const overlayStrongClass = "text-white/88";

  const overlayCardClass =
    "rounded-[1.2rem] sm:rounded-[1.5rem] border border-white/10 bg-white/10";

  const overlayButtonClass =
    "inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white hover:text-black transition-colors";

  const overlayIconButtonClass =
    "relative z-10 inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white hover:text-black transition-colors shrink-0";

  const overlayDividerClass = "border-white/10";

  return (
    <>
      <CustomCursor />

      <main className="min-h-screen relative overflow-hidden page-grid-bg text-zinc-900 dark:text-white">

        {/* Container Sections */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-8 sm:pb-10">
          {/* MOBILE / TABLET NAV */}
          <div className="md:hidden">
            <motion.div
              layout
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[1.75rem] border-2 border-white/25 dark:border-white/25 bg-[var(--background)] text-[var(--foreground)] overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <motion.img
                    src="/gif-hero.gif"
                    alt="Hero icon"
                    className="h-11 w-11 rounded-full object-cover border border-white/25 dark:border-white/10"
                    animate={{ x: [-3, 3, -3] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.24em] font-bold dark:font-normal text-zinc-500 dark:text-zinc-400">
                      Navigation
                    </p>
                    <p className="text-sm font-bold dark:font-normal text-zinc-900 dark:text-zinc-100 truncate">
                      Explore portfolio
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <ThemeToggle />

                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    aria-expanded={isMobileMenuOpen}
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    className="group inline-flex items-center gap-3 rounded-full border border-white/25 dark:border-white/25 px-3 py-2 text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold dark:font-normal">
                      {isMobileMenuOpen ? "Close" : "Menu"}
                    </span>

                    <span className="relative flex h-4 w-4 items-center justify-center">
                      <motion.span
                        animate={
                          isMobileMenuOpen
                            ? { rotate: 45, y: 0 }
                            : { rotate: 0, y: -4 }
                        }
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute h-[1.5px] w-4 rounded-full bg-current"
                      />
                      <motion.span
                        animate={
                          isMobileMenuOpen
                            ? { rotate: -45, y: 0 }
                            : { rotate: 0, y: 4 }
                        }
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute h-[1.5px] w-4 rounded-full bg-current"
                      />
                    </span>
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isMobileMenuOpen && (
                  <motion.div
                    key="mobile-nav-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden border-t border-white/25 dark:border-white/25"
                  >
                    <div className="px-3 pb-3 pt-3">
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProjectsOpen(true)
                            setIsMobileMenuOpen(false)
                          }}
                          className="w-full rounded-full border border-white/25 dark:border-white/25 px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] font-bold dark:font-normal text-zinc-900 dark:text-zinc-100 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                          Projects
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsAboutOpen(true)
                            setIsMobileMenuOpen(false)
                          }}
                          className="w-full rounded-full border border-white/25 dark:border-white/25 px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] font-bold dark:font-normal text-zinc-900 dark:text-zinc-100 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                          About
                        </button>

                        <a
                          href="#playground"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full rounded-full border border-white/25 dark:border-white/25 px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] font-bold dark:font-normal text-zinc-900 dark:text-zinc-100 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                          Playground
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            openLatest()
                            setIsMobileMenuOpen(false)
                          }}
                          className="w-full rounded-full border border-white/25 dark:border-white/25 px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] font-bold dark:font-normal text-zinc-900 dark:text-zinc-100 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                          Latest
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsContactOpen(true)
                            setIsMobileMenuOpen(false)
                          }}
                          className="w-full rounded-full border border-white/25 dark:border-white/25 px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] font-bold dark:font-normal text-zinc-900 dark:text-zinc-100 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="rounded-[1.75rem] border-1 border-white/40 dark:border-white/40 bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
                <div className="px-4 py-3 md:px-6 md:py-4">
                  <div className="grid grid-cols-[1.2fr_repeat(5,minmax(0,1fr))] gap-0 items-stretch text-[13px]">
                    <div className="flex items-center justify-center border-r border-white/25 dark:border-white/25 min-h-[40px]">
                      <motion.img
                        src="/gif-hero.gif"
                        alt="Hero icon"
                        className="h-12 w-12 rounded-full object-cover"
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
                      className="flex items-center justify-center border-r border-white/25 dark:border-white/25 font-bold dark:font-normal text-zinc-900 dark:text-zinc-100 hover:text-black dark:hover:text-white transition-colors min-h-[40px]"
                    >
                      <span className="uppercase tracking-[0.2em] text-[11px]">projects</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsAboutOpen(true)}
                      className="flex items-center justify-center border-r border-white/25 dark:border-white/25 font-bold dark:font-normal text-zinc-900 dark:text-zinc-100 hover:text-black dark:hover:text-white transition-colors min-h-[40px]"
                    >
                      <span className="uppercase tracking-[0.2em] text-[11px]">about</span>
                    </button>

                    <a
                      href="#playground"
                      className="flex items-center justify-center border-r border-white/25 dark:border-white/25 font-bold dark:font-normal text-zinc-900 dark:text-zinc-100 hover:text-black dark:hover:text-white transition-colors min-h-[40px]"
                    >
                      <span className="uppercase tracking-[0.2em] text-[11px]">playground</span>
                    </a>

                    <button
                      type="button"
                      onClick={openLatest}
                      className="flex items-center justify-center border-r border-white/25 dark:border-white/25 font-bold dark:font-normal text-zinc-900 dark:text-zinc-100 hover:text-black dark:hover:text-white transition-colors min-h-[40px]"
                    >
                      <span className="uppercase tracking-[0.2em] text-[11px]">latest</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsContactOpen(true)}
                      className="flex items-center justify-center text-zinc-700 dark:text-gray-200 hover:text-black dark:hover:text-white font-bold dark:font-normal text-zinc-900 dark:text-zinc-100 transition-colors min-h-[40px]"
                    >
                      <span className="uppercase tracking-[0.2em] text-[11px]">contact</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </section>

        {/* Background effects */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-purple-500/10 dark:bg-purple-500/30 blur-3xl" />
          <div className="absolute top-40 -right-32 h-96 w-96 rounded-full bg-cyan-400/10 dark:bg-cyan-400/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-72 w-[32rem] sm:w-[40rem] -translate-x-1/2 translate-y-1/3 rounded-[999px] bg-gradient-to-r from-purple-500/8 via-fuchsia-500/10 to-cyan-400/8 dark:from-purple-500/20 dark:via-fuchsia-500/25 dark:to-cyan-400/20 blur-3xl" />
        </div>

        {/* Hero section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-0 pb-8 sm:pb-10 border-t border-white/20 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-10 sm:mb-12 lg:mb-16">
            <p className="text-sm sm:text-base md:text-lg font-semibold dark:font-normal text-zinc-900 dark:text-zinc-100">
              {hero?.greeting}
            </p>

            {hero?.currentRole && (
              <div className="flex items-center gap-2 text-[10px] sm:text-xs">
                <span
                  className="inline-block h-2 w-2 rounded-full animate-pulse"
                  style={{
                    backgroundColor: hero.roleDotColor?.hex || "#ec4899",
                  }}
                />
                <span
                  className="lowercase tracking-[0.22em] sm:tracking-[0.25em] font-semibold dark:font-normal text-zinc-200 dark:text-zinc-100"
                  style={{ color: isDarkMode ? hero.roleColor?.hex || undefined : undefined }}
                >
                  {hero.currentRole}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] items-start gap-8 sm:gap-10 lg:gap-4">
            <div className="min-w-0 lg:max-w-[860px] xl:max-w-[920px]">
              <div className="text-[2.25rem] sm:text-[3rem] md:text-6xl lg:text-[5.2rem] xl:text-[5.3rem] leading-[0.95] font-medium text-zinc-900 dark:text-zinc-100 space-y-2">
                {hero?.line1 && (
                  <p
                    className="whitespace-normal lg:whitespace-nowrap text-zinc-900 dark:text-zinc-100"
                    style={{ color: isDarkMode ? hero.line1Color?.hex || undefined : undefined }}
                  >
                    {hero.line1}
                  </p>
                )}

                {hero?.line2 && (
                  <p
                    className="whitespace-normal lg:whitespace-nowrap text-zinc-900 dark:text-zinc-100"
                    style={{ color: isDarkMode ? hero.line2Color?.hex || undefined : undefined }}
                  >
                    {hero.line2}
                  </p>
                )}

                {hero?.rotatingLines && hero.rotatingLines.length > 0 && (
                  <RotatingText
                    text={hero.rotatingLines.map((item) => item.text || "")}
                    colors={hero.rotatingLines.map((item) => item.color?.hex)}
                    durationMs={2500}
                    slideOffset={40}
                    className="text-[2.25rem] sm:text-[3rem] md:text-6xl lg:text-[5.2rem] xl:text-[5.5rem]"
                  />
                )}
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end mt-2 sm:mt-4 lg:mt-0">
              <div className="relative flex w-full justify-center lg:justify-end lg:translate-x-16 xl:translate-x-24 2xl:translate-x-28 lg:-translate-y-4 xl:-translate-y-6">
                <HeroImageStack images={hero?.heroImages || []} />
              </div>
            </div>
          </div>
        </section>

        {/* About section */}
        <section
          id="about-section"
          className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24 border-t border-white/20 dark:border-white/10 pt-12 sm:pt-16"
        >
          <p className="text-[11px] sm:text-xs tracking-[0.3em] font-semibold dark:font-normal text-zinc-500 dark:text-gray-400 mb-3">
            .about
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-start">
            <div className="space-y-5">
              <p
                className="inline-block text-xl sm:text-2xl md:text-3xl font-medium tracking-[-0.5px] font-semibold dark:font-normal leading-snug text-zinc-900 dark:text-zinc-100"
                style={{
                  fontFamily:
                    '"Manrope", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                }}
              >
                {profile?.headline ||
                  "I design for clarity and build with intent."}
              </p>

              <p className="max-w-xl text-sm md:text-base leading-relaxed font-semibold dark:font-normal text-zinc-900 dark:text-zinc-100 whitespace-pre-line">
                {profile?.bio ||
                  "Write your short bio in the Profile document in Sanity Studio."}
              </p>

              <button
                type="button"
                onClick={() => setIsAboutOpen(true)}
                className="inline-flex items-center text-xs uppercase tracking-[0.25em] font-semibold dark:font-normal text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-200 mt-4"
              >
                about me⤴
              </button>
            </div>

            {profile?.avatar && (
              <motion.div
                className="relative h-[280px] sm:h-[360px] md:h-[520px] w-full rounded-[1.5rem] sm:rounded-3xl overflow-hidden border border-white/20 dark:border-white/10"
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

        {/* Playground section */}
        <section
          id="playground"
          className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24 border-t border-white/20 dark:border-white/10 pt-12"
        >
          <p className="text-[11px] sm:text-xs tracking-[0.3em] font-semibold dark:font-normal text-zinc-500 dark:text-gray-400 mb-3">
            .playground
          </p>

          {playgroundItems.length === 0 && (
            <p className="text-zinc-600 dark:text-gray-500 text-sm">
              No playground experiments yet. Add some in Sanity Studio.
            </p>
          )}

          {playgroundItems.length > 0 && (
            <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-3xl border border-white/20 dark:border-white/10 bg-black/[0.03] dark:bg-white/5">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-16 bg-gradient-to-r from-[var(--background)] to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-16 bg-gradient-to-l from-[var(--background)] to-transparent z-10" />

              <div className="playground-scroll gap-4 py-4 px-4">
                {[...playgroundItems, ...playgroundItems].map((item, idx) => (
                  <div
                    key={`${item._id}-${idx}`}
                    className="relative flex-shrink-0 w-56 sm:w-64 md:w-80 overflow-hidden rounded-[1.2rem] sm:rounded-2xl border border-white/20 dark:border-white/10"
                  >
                    {item.image && (
                      <img
                        src={urlFor(item.image).width(800).height(600).url()}
                        alt={item.title || "Playground experiment"}
                        className="h-36 sm:h-40 md:h-52 w-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Latest section */}
        <section
          id="latest"
          className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 sm:pb-14 border-t border-white/20 dark:border-white/10 pt-12"
        >
          <p className="text-[11px] sm:text-xs tracking-[0.3em] font-bold dark:font-normal text-zinc-500 dark:text-gray-400 mb-3">
            .latest
          </p>

          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div className="space-y-6">
              <p className="inline-block text-2xl md:text-3xl font-large tracking-[-0.5px] font-bold dark:font-bold leading-snug text-zinc-900 dark:text-zinc-100">
                {previewNote?.previewText ||
                  "A short editorial preview for the latest note goes here."}
              </p>

              {previewNote?.coverImage && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNote(previewNote);
                    setIsLatestOpen(true);
                  }}
                  className="group block w-full text-left"
                >
                  <div className="overflow-hidden rounded-[1.35rem] sm:rounded-[1.6rem] border border-white/20 dark:border-white/10 bg-black/5 dark:bg-white/5">
                    <img
                      src={urlFor(previewNote.coverImage).width(1200).height(800).url()}
                      alt={previewNote?.title || "Latest note cover image"}
                      className="w-full h-[100px] sm:h-[150px] md:h-[320px] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                  </div>

                  <span className="mt-10 inline-flex items-center text-xs uppercase tracking-[0.25em] font-semibold dark:font-normal text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-200">
                    latest note ⤴
                  </span>
                </button>
              )}
            </div>

            <div
              className="space-y-6 text-sm"
              onMouseLeave={() => setHoveredNote(null)}
            >
              {notes.map((note) => (
                <button
                  key={note._id}
                  type="button"
                  onMouseEnter={() => setHoveredNote(note)}
                  onFocus={() => setHoveredNote(note)}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsLatestOpen(true);
                  }}
                  className="block w-full text-left"
                >
                  <h3 className="inline-block text-2xl md:text-2xl font-medium tracking-[-0.5px] mb-1 font-semibold dark:font-normal text-zinc-900 dark:text-zinc-100">
                    {note.title}
                  </h3>
                  <p className="text-xs font-bold dark:font-normal text-zinc-900 dark:text-zinc-100">
                    {note.date} {note.type ? `· ${note.type}` : ""}
                  </p>
                </button>
              ))}

              {notes.length === 0 && (
                <p className="text-sm text-zinc-700 dark:text-zinc-400">
                  Add some Notes in Sanity to show them here.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Contact section */}
        <section
          id="contact"
          className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 border-t border-white/20 dark:border-white/10 pt-12 text-sm"
        >
          <p className="text-[11px] sm:text-xs tracking-[0.3em] font-bold dark:font-normal text-zinc-500 dark:text-gray-400 mb-3">
            .contact
          </p>

          <div className="space-y-8 w-full">
            <div className="max-w-xl">
              <h3 className="text-base md:text-lg font-bold dark:font-bold text-zinc-900 dark:text-zinc-100">
                {contact?.headline || "Let’s work together"}
              </h3>

              <p className="font-semibold dark:font-normal text-zinc-900 dark:text-zinc-100">
                {contact?.body ||
                  "Feel free to reach out for collaborations, freelance work, or just to say hi."}
              </p>
            </div>

            <div className="mt-2 flex w-full items-start justify-between gap-3 sm:gap-4">
              <div className="flex flex-1 flex-wrap items-center gap-3 min-w-0">
                {contact?.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-3 rounded-full border border-white/20 dark:border-white/15 bg-black/5 dark:bg-white/5 px-4 py-3 text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] font-bold dark:font-bold text-zinc-900 dark:text-zinc-100 hover:bg-black/10 dark:hover:bg-white hover:text-black dark:hover:text-black transition-colors"
                  >
                    <span>{contact.email}</span>
                  </a>
                )}

                {contact?.links?.map((item, index) =>
                  item?.label && item?.url ? (
                    <a
                      key={`${item.label}-${index}`}
                      href={item.url}
                      target={item.url?.startsWith("mailto:") ? undefined : "_blank"}
                      rel={item.url?.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      className="inline-flex items-center gap-3 rounded-full border border-white/20 dark:border-white/15 bg-black/5 dark:bg-white/5 px-4 py-3 text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] font-bold dark:font-normal text-zinc-900 dark:text-zinc-100 hover:bg-black/10 dark:hover:bg-white hover:text-black dark:hover:text-black transition-colors"
                    >
                      {item.icon && (
                        <img
                          src={urlFor(item.icon).width(80).height(80).url()}
                          alt={item.label || "Contact icon"}
                          className="h-5 w-5 object-cover rounded-sm"
                        />
                      )}
                      <span>{item.label}</span>
                    </a>
                  ) : null
                )}
              </div>

              {contact?.resume?.asset?.url && (
                <div className="flex-shrink-0 self-start">
                  <a
                    href={contact.resume.asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 rounded-full border border-white/20 dark:border-white/15 bg-black/5 dark:bg-white/5 px-4 py-3 text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] font-bold dark:font-normal text-zinc-900 dark:text-zinc-100 hover:bg-black/10 dark:hover:bg-white hover:text-black dark:hover:text-black transition-colors whitespace-nowrap"
                  >
                    {contact.resumeIcon && (
                      <img
                        src={urlFor(contact.resumeIcon).width(80).height(80).url()}
                        alt={contact.resumeLabel || "Resume icon"}
                        className="h-5 w-5 object-cover rounded-sm"
                      />
                    )}
                    <span>{contact.resumeLabel || "Resume"}</span>
                  </a>
                </div>
              )}

              {!contact?.email && !contact?.links?.length && !contact?.resume?.asset?.url && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Add contact data in Sanity Studio.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Project overlay and nested project */}
      <AnimatePresence>
        {isProjectsOpen && (
          <motion.div
            className="fixed inset-0 z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Dimmed backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/30 dark:bg-black/68 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeProjects}
            />

            {/* Projects sheet */}
            <motion.div
              className="absolute inset-0 overflow-y-auto"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="min-h-screen relative">
                {/* Grid overlay (dark mode only) */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 hidden dark:block bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:120px_120px] opacity-[0.18]" />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                  <div
                    className={`rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[rgba(6,6,8,0.88)] text-zinc-900 dark:text-white/95 backdrop-blur-2xl overflow-hidden shadow-2xl transition-all duration-300 
                      ${selectedProject
                        ? "blur-[10px] scale-[0.985] opacity-60 pointer-events-none"
                        : "blur-0 scale-100 opacity-100"
                      }`}
                  >
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-4 sm:gap-6 border-b border-[#d8cfc2] dark:border-white/10 px-4 sm:px-5 md:px-8 py-4 sm:py-5 md:py-6">
                      <div className="max-w-3xl">
                        <p className="text-[11px] sm:text-xs tracking-[0.3em] lowercase text-zinc-500 dark:text-gray-400 mb-3">
                          .projects
                        </p>
                        <p className="mt-4 sm:mt-6 max-w-3xl text-[1rem] sm:text-[1.1rem] md:text-[2.3rem] leading-[1.15] md:leading-[1.08] tracking-[-0.02em] md:tracking-[-0.04em] text-zinc-800 dark:text-white/80">
                          Experiences that combine empathy, systems thinking, and simplicity
                          to create meaningful user experiences at scale.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={closeProjects}
                        className="relative z-10 inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-white/80 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors shrink-0"
                        aria-label="Close projects overlay"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Body */}
                    <div className="px-4 sm:px-5 md:px-8 py-6 sm:py-8 md:py-10">
                      {projects.length === 0 ? (
                        <div className="rounded-3xl border border-[#d8cfc2] dark:border-white/10 bg-[#efe7da] dark:bg-white/5 p-8 text-zinc-700 dark:text-white/70">
                          No projects yet. Add some in Sanity Studio.
                        </div>
                      ) : (
                        <div className="space-y-5 sm:space-y-6 md:space-y-8">
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

            {/* Nested: project detail overlay */}
            <AnimatePresence>
              {selectedProject && (
                <motion.div
                  className="fixed inset-0 z-[110] bg-black/35 dark:bg-black/96"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Grid overlay */}
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 hidden dark:block bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:120px_120px] opacity-[0.18]" />
                  </div>

                  <motion.div
                    className="relative h-full overflow-y-auto"
                    initial={{ y: 36, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-20 sm:pb-24">
                      <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[rgba(6,6,8,0.88)] text-zinc-900 dark:text-white backdrop-blur-2xl overflow-hidden shadow-2xl">
                        {/* Top bar */}
                        <div className="flex items-start sm:items-center justify-between gap-4 border-b border-[#d8cfc2] dark:border-white/10 px-4 sm:px-5 md:px-8 py-4 sm:py-5 md:py-6">
                          <div>
                            <p className="text-[10px] md:text-xs lowercase tracking-[0.35em] text-zinc-500 dark:text-white/40 mb-1">
                              .project detail
                            </p>
                          </div>

                          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <button
                              type="button"
                              onClick={closeProjectDetails}
                              className="inline-flex items-center justify-center rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 px-3 sm:px-4 py-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-zinc-800 dark:text-white/80 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                            >
                              Back
                            </button>

                            <button
                              type="button"
                              onClick={closeProjects}
                              className="inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-white/80 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                              aria-label="Close project details"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        <div className="px-4 sm:px-5 md:px-8 py-6 sm:py-8 md:py-10">
                          {/* Title + summary */}
                          <section className="pt-2 sm:pt-4 md:pt-6">
                            <h2 className="max-w-5xl text-[2rem] sm:text-[2.6rem] md:text-[5.8rem] leading-[0.95] md:leading-[0.92] tracking-[-0.06em] md:tracking-[-0.08em] text-zinc-900 dark:text-white/80 font-medium">
                              {selectedProject.title || "Project title"}
                            </h2>

                            <p className="mt-5 sm:mt-6 md:mt-8 max-w-4xl text-[1rem] sm:text-[1.15rem] md:text-[2.2rem] leading-[1.2] md:leading-[1.08] tracking-[-0.02em] md:tracking-[-0.04em] text-zinc-700 dark:text-white/68">
                              {selectedProject.summary ||
                                "A project summary that introduces the problem space, design thinking, and project outcome in a concise way."}
                            </p>
                          </section>

                          {/* Hero visual */}
                          <section className="mt-10 sm:mt-12 border-t border-[#9c8d1d] pt-6 sm:pt-8">
                            <div className="rounded-[1.4rem] sm:rounded-[2rem] overflow-hidden border border-[#d8cfc2] dark:border-white/10 bg-[#efe7da] dark:bg-[#1a1a1a]">
                              {selectedProject.coverImage ? (
                                <img
                                  src={urlFor(selectedProject.coverImage)
                                    .width(1800)
                                    .height(1200)
                                    .url()}
                                  alt={selectedProject.title || "Project image"}
                                  className="w-full h-[220px] sm:h-[300px] md:h-[620px] object-cover"
                                />
                              ) : (
                                <div className="w-full h-[220px] sm:h-[300px] md:h-[620px] bg-gradient-to-br from-[#efe7da] to-[#e4d8c8] dark:from-zinc-700 dark:to-zinc-950" />
                              )}
                            </div>
                          </section>

                          {/* Content + aside */}
                          <section className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-10 sm:gap-12 items-start">
                            <div className="space-y-10 sm:space-y-14">
                              {/* Problem / solution */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                                <div>
                                  <p className="text-[#b98b00] dark:text-[#d6bf24] text-base sm:text-[1.05rem] md:text-[1.35rem] mb-4 sm:mb-5">
                                    problem
                                  </p>
                                  <p className="text-zinc-700 dark:text-white/72 text-base sm:text-lg md:text-[1.15rem] leading-[1.7]">
                                    Existing solutions were often fragmented, over-technical,
                                    or lacked a user-first interface. The challenge was to
                                    simplify complexity into a clear and elegant experience.
                                  </p>
                                </div>

                                <div>
                                  <p className="text-[#b98b00] dark:text-[#d6bf24] text-base sm:text-[1.05rem] md:text-[1.35rem] mb-4 sm:mb-5">
                                    solution
                                  </p>
                                  <p className="text-zinc-700 dark:text-white/72 text-base sm:text-lg md:text-[1.15rem] leading-[1.7]">
                                    The project focused on clarity, structure, and intuitive
                                    interaction patterns to build a system that feels both
                                    modern and easy to use.
                                  </p>
                                </div>
                              </div>

                              {/* Editorial note */}
                              <div>
                                <p className="text-zinc-900/80 dark:text-white/80 text-base sm:text-lg md:text-xl leading-[1.8] max-w-4xl">
                                  This detail page is intentionally designed like an editorial
                                  case study. Later we can make this fully dynamic with real
                                  case study blocks, richer storytelling, additional images,
                                  process sections, and motion transitions.
                                </p>
                              </div>

                              {/* Secondary visual */}
                              {selectedProject.coverImage && (
                                <div className="rounded-[1.35rem] sm:rounded-[1.6rem] overflow-hidden border border-[#d8cfc2] dark:border-white/10">
                                  <img
                                    src={urlFor(selectedProject.coverImage)
                                      .width(1400)
                                      .height(1000)
                                      .url()}
                                    alt={selectedProject.title || "Project visual"}
                                    className="w-full h-[220px] sm:h-[300px] md:h-[480px] object-cover"
                                  />
                                </div>
                              )}

                              {/* Links */}
                              <div className="pt-2 sm:pt-4 flex flex-wrap gap-3">
                                {selectedProject.liveUrl && (
                                  <a
                                    href={selectedProject.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center rounded-full border border-black/15 dark:border-white/20 px-4 sm:px-5 py-3 text-sm text-zinc-900 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                  >
                                    Live site ⤴
                                  </a>
                                )}

                                {selectedProject.caseStudyUrl && (
                                  <a
                                    href={selectedProject.caseStudyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 px-4 sm:px-5 py-3 text-sm text-zinc-700 dark:text-white/80 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                  >
                                    Case study ⤴
                                  </a>
                                )}
                              </div>
                            </div>

                            {/* Aside */}
                            <aside className="lg:sticky lg:top-8 border-t lg:border-t-0 lg:border-l border-[#d8cfc2] dark:border-white/10 pt-8 lg:pt-0 lg:pl-8 space-y-8 sm:space-y-10">
                              <div>
                                <p className="text-[#b98b00] dark:text-[#d6bf24] text-base sm:text-lg mb-2">
                                  year
                                </p>
                                <p className="text-zinc-900 dark:text-white/82 text-2xl sm:text-3xl">
                                  {selectedProject.year || "2024"}
                                </p>
                              </div>

                              <div>
                                <p className="text-[#b98b00] dark:text-[#d6bf24] text-base sm:text-lg mb-2">
                                  category
                                </p>
                                <p className="text-zinc-900 dark:text-white/82 text-lg sm:text-xl">
                                  {selectedProject.tags?.[0] || "UI / UX"}
                                </p>
                              </div>

                              <div>
                                <p className="text-[#b98b00] dark:text-[#d6bf24] text-base sm:text-lg mb-2">
                                  tools
                                </p>
                                <p className="text-zinc-900 dark:text-white/82 text-lg sm:text-xl">
                                  {selectedProject.tags?.slice(0, 3).join(", ") ||
                                    "Figma, Framer, Design systems"}
                                </p>
                              </div>

                              <div>
                                <p className="text-[#b98b00] dark:text-[#d6bf24] text-base sm:text-lg mb-2">
                                  summary
                                </p>
                                <p className="text-zinc-700 dark:text-white/68 text-base leading-relaxed">
                                  {selectedProject.summary ||
                                    "A concise summary of the project, the design challenge, and the experience direction."}
                                </p>
                              </div>
                            </aside>
                          </section>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* About overlay */}
      <AnimatePresence>
        {isAboutOpen && (
          <motion.div
            className="fixed inset-0 z-[95]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/45 dark:bg-black/68 backdrop-blur-md"
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
                  <div className="absolute inset-0 hidden dark:block bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:120px_120px] opacity-[0.18]" />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                  <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[rgba(6,6,8,0.88)] backdrop-blur-2xl overflow-hidden shadow-2xl">
                    <div className="flex items-start justify-between gap-4 sm:gap-6 border-b border-black/10 dark:border-white/10 px-4 sm:px-5 md:px-8 py-4 sm:py-5 md:py-6">
                      <div className="max-w-4xl">
                        <p className="text-[11px] sm:text-xs tracking-[0.3em] text-zinc-500 dark:text-gray-400 mb-3">
                          .about
                        </p>
                        <p className="mt-4 sm:mt-6 max-w-4xl text-[1rem] sm:text-[1.1rem] md:text-[2.3rem] leading-[1.15] md:leading-[1.08] tracking-[-0.02em] md:tracking-[-0.04em] text-zinc-700 dark:text-white/68 whitespace-pre-line">
                          {profile?.introLine ??
                            "Write your intro line in the Profile document in the Sanity Studio."}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={closeAbout}
                        className="relative z-10 inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-white/80 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors shrink-0"
                        aria-label="Close about overlay"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="px-4 sm:px-5 md:px-8 py-6 sm:py-8 md:py-10">
                      <div className="space-y-10 sm:space-y-14">
                        <section className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-12 items-start">
                          {profile?.avatar && (
                            <div className="rounded-[1.5rem] sm:rounded-[1.8rem] overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                              <img
                                src={urlFor(profile.avatar)
                                  .width(1200)
                                  .height(1400)
                                  .url()}
                                alt={profile.name || "Profile image"}
                                className="w-full h-[280px] sm:h-[420px] md:h-[700px] object-cover"
                              />
                            </div>
                          )}

                          <div className="space-y-6 sm:space-y-8">
                            {profile?.headline && (
                              <div>
                                <p className="text-[10px] md:text-xs lowercase tracking-[0.35em] text-zinc-500 dark:text-white/35 mb-4">
                                  .about me
                                </p>
                                <p className="max-w-3xl text-[1.25rem] sm:text-[1.5rem] md:text-[3rem] leading-[1.1] md:leading-[1.06] tracking-[-0.04em] md:tracking-[-0.05em] text-zinc-900/85 dark:text-white/80 whitespace-pre-line">
                                  {profile.headline}
                                </p>
                              </div>
                            )}

                            <div className="border-t border-black/10 dark:border-white/10 pt-6">
                              <p className="max-w-2xl text-sm sm:text-base md:text-lg leading-[1.85] md:leading-[1.9] text-zinc-700 dark:text-white/65 whitespace-pre-line">
                                {profile?.aboutLong ||
                                  "Write your long editorial about text in the Profile document in Sanity Studio."}
                              </p>
                            </div>
                          </div>
                        </section>

                        {(profile?.education ||
                          profile?.location ||
                          profile?.currentRole) && (
                            <section className="border-t border-black/10 dark:border-white/10 pt-8">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">
                                <div className="space-y-2">
                                  <p className="text-[11px] sm:text-xs tracking-[0.3em] text-zinc-500 dark:text-gray-400 mb-3">
                                    .education
                                  </p>
                                  <p className="text-zinc-900 dark:text-white/82 text-[1rem] sm:text-[1.1rem] md:text-[1.45rem] leading-snug">
                                    {profile?.education || "Add education"}
                                  </p>
                                  {profile?.educationSubtext && (
                                    <p className="text-zinc-600 dark:text-white/55 text-sm md:text-base leading-relaxed">
                                      {profile.educationSubtext}
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <p className="text-[11px] sm:text-xs tracking-[0.3em] text-zinc-500 dark:text-gray-400 mb-3">
                                    .location
                                  </p>
                                  <p className="text-zinc-900 dark:text-white/82 text-[1rem] sm:text-[1.1rem] md:text-[1.45rem] leading-snug">
                                    {profile?.location || "Add location"}
                                  </p>
                                  {profile?.locationSubtext && (
                                    <p className="text-zinc-600 dark:text-white/55 text-sm md:text-base leading-relaxed">
                                      {profile.locationSubtext}
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <p className="text-[11px] sm:text-xs tracking-[0.3em] text-zinc-500 dark:text-gray-400 mb-3">
                                    .current work
                                  </p>
                                  <p className="text-zinc-900 dark:text-white/82 text-[1rem] sm:text-[1.1rem] md:text-[1.45rem] leading-snug">
                                    {profile?.currentRole || "Add current work"}
                                  </p>
                                  {profile?.currentRoleSubtext && (
                                    <p className="text-zinc-600 dark:text-white/55 text-sm md:text-base leading-relaxed">
                                      {profile.currentRoleSubtext}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </section>
                          )}

                        {profile?.experience && profile.experience.length > 0 && (
                          <section className="border-t border-black/10 dark:border-white/10 pt-8">
                            <p className="text-[11px] sm:text-xs tracking-[0.3em] text-zinc-500 dark:text-gray-400 mb-3">
                              .work experience
                            </p>

                            <div className="space-y-0">
                              {profile.experience.map((item, index) => (
                                <div
                                  key={`${item.company || "experience"}-${index}`}
                                  className="grid grid-cols-1 md:grid-cols-[220px_1fr_1.3fr] gap-5 sm:gap-6 md:gap-10 py-6 sm:py-8 border-t border-black/10 dark:border-white/10 first:border-t-0"
                                >
                                  <div>
                                    <p className="text-zinc-900 dark:text-white/82 text-[1.3rem] sm:text-[1.75rem] md:text-[2.2rem] leading-none tracking-[-0.04em]">
                                      {item.period}
                                    </p>
                                  </div>

                                  <div>
                                    <h4 className="text-zinc-900 dark:text-white/82 text-[1.45rem] sm:text-[1.8rem] md:text-[2.5rem] leading-[0.95] tracking-[-0.05em]">
                                      {item.company || "Company"}
                                    </h4>
                                    {item.role && (
                                      <p className="mt-3 text-zinc-700 dark:text-white/68 text-base md:text-[1.1rem] leading-relaxed">
                                        {item.role}
                                      </p>
                                    )}
                                  </div>

                                  <div>
                                    {item.description && (
                                      <p className="max-w-xl text-zinc-600 dark:text-white/62 text-sm sm:text-base md:text-lg leading-[1.8] whitespace-pre-line">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}

                        {profile?.featuredSection?.title &&
                          profile?.featuredSection?.description &&
                          profile?.featuredSection?.image && (
                            <section className="border-t border-black/10 dark:border-white/10 pt-8">
                              <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-zinc-500 dark:text-white/35 mb-4">
                                .{profile.featuredSection.label || "featured"}
                              </p>

                              <div className="rounded-[1.35rem] sm:rounded-[1.6rem] overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
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
                                    className="w-full h-[200px] sm:h-[240px] md:h-[320px] object-cover"
                                  />
                                )}

                                <div className="p-4 sm:p-5 md:p-6">
                                  {profile.featuredSection.title && (
                                    <h3 className="text-zinc-900 dark:text-white/85 text-lg sm:text-xl md:text-2xl mb-3">
                                      {profile.featuredSection.title}
                                    </h3>
                                  )}

                                  {profile.featuredSection.description && (
                                    <p className="text-zinc-700 dark:text-white/65 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                                      {profile.featuredSection.description}
                                    </p>
                                  )}

                                  {profile.featuredSection.link &&
                                    profile.featuredSection.linkLabel && (
                                      <a
                                        href={profile.featuredSection.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center mt-5 rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 px-5 py-3 text-xs uppercase tracking-[0.2em] text-zinc-800 dark:text-white/80 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                      >
                                        {profile.featuredSection.linkLabel}
                                      </a>
                                    )}
                                </div>
                              </div>
                            </section>
                          )}

                        {profile?.stackItems && profile.stackItems.length > 0 && (
                          <section className="border-t border-black/10 dark:border-white/10 pt-8">
                            <p className="text-[11px] sm:text-xs tracking-[0.3em] text-zinc-500 dark:text-gray-400 mb-3">
                              .tools
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {profile.stackItems.map((item, index) => (
                                <div
                                  key={`${item.title || "stack"}-${index}`}
                                  className="rounded-[1.2rem] sm:rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4"
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

                                  <h4 className="text-zinc-900 dark:text-white/85 text-base sm:text-[1rem]">
                                    {item.title}
                                  </h4>

                                  {item.subtitle && (
                                    <p className="text-zinc-600 dark:text-white/55 mt-1 text-sm leading-relaxed">
                                      {item.subtitle}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </section>
                        )}

                        {profile?.socials && profile.socials.length > 0 && (
                          <section className="border-t border-black/10 dark:border-white/10 pt-8">
                            <p className="text-[11px] sm:text-xs tracking-[0.3em] text-zinc-500 dark:text-gray-400 mb-3">
                              .links
                            </p>

                            <div className="mt-2 flex w-full items-start">
                              <div className="flex flex-1 flex-wrap items-center gap-3 min-w-0">
                                {profile.socials.map((item, index) =>
                                  item?.url ? (
                                    <a
                                      key={`${item.label || "link"}-${index}`}
                                      href={item.url}
                                      target={item.url?.startsWith("mailto:") ? undefined : "_blank"}
                                      rel={
                                        item.url?.startsWith("mailto:")
                                          ? undefined
                                          : "noopener noreferrer"
                                      }
                                      className="inline-flex items-center gap-3 rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 px-4 py-3 text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] text-zinc-800 dark:text-white/80 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                    >
                                      {item.icon && (
                                        <img
                                          src={urlFor(item.icon).width(80).height(80).url()}
                                          alt={item.label || "Social icon"}
                                          className="h-5 w-5 object-cover rounded-sm"
                                        />
                                      )}
                                      <span>{item.label || "Link"}</span>
                                    </a>
                                  ) : null
                                )}
                              </div>
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

      {/* Latest note overlay */}
      <AnimatePresence>
        {isLatestOpen && selectedNote && (
          <motion.div
            className="fixed inset-0 z-[96]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/30 dark:bg-black/68 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLatest}
            />

            <motion.div
              ref={latestScrollRef}
              className="absolute inset-0 overflow-y-auto"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="min-h-screen relative">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 hidden dark:block bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:120px_120px] opacity-[0.18]" />
                </div>

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                  <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[rgba(6,6,8,0.88)] text-zinc-900 dark:text-white/95 backdrop-blur-2xl overflow-hidden shadow-2xl">
                    <div className="flex items-start justify-between gap-4 sm:gap-6 border-b border-black/10 dark:border-white/10 px-4 sm:px-5 md:px-8 py-4 sm:py-5 md:py-6">
                      <div className="max-w-3xl">
                        <p className="text-[10px] md:text-xs lowercase tracking-[0.35em] text-zinc-500 dark:text-white/35 mb-3">
                          .latest
                        </p>

                        <h2 className="text-[1.9rem] sm:text-[2.4rem] md:text-[4.5rem] leading-[0.95] tracking-[-0.06em] md:tracking-[-0.08em] text-zinc-900/85 dark:text-white/85 font-medium">
                          {selectedNote.title || "Latest note"}
                        </h2>

                        <p className="mt-4 text-sm sm:text-base md:text-lg text-zinc-600 dark:text-white/55">
                          {formatNoteDate(selectedNote.date)}
                          {selectedNote.type ? ` · ${selectedNote.type}` : ""}
                          {selectedNote.readingTime ? ` · ${selectedNote.readingTime}` : ""}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={closeLatest}
                        className="relative z-10 inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-white/80 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors shrink-0"
                        aria-label="Close latest overlay"
                      >
                        ×
                      </button>
                    </div>

                    <div className="px-4 sm:px-5 md:px-8 py-6 sm:py-8 md:py-10 space-y-8 sm:space-y-10">
                      <motion.div
                        key={selectedNote._id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-8 sm:space-y-10"
                      >
                        {selectedNote.coverImage && (
                          <div className="rounded-[1.35rem] sm:rounded-[1.6rem] overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                            <img
                              src={urlFor(selectedNote.coverImage).width(1600).height(1000).url()}
                              alt={selectedNote.title || "Note cover image"}
                              className="w-full h-[220px] sm:h-[320px] md:h-[420px] object-cover"
                            />
                          </div>
                        )}

                        <div className="max-w-3xl space-y-6">
                          {selectedNote.previewText && (
                            <p className="text-zinc-900 dark:text-white/90 text-[1.2rem] sm:text-[1.45rem] md:text-[2rem] leading-[1.2] tracking-[-0.03em] font-semibold whitespace-pre-line">
                              {selectedNote.previewText}
                            </p>
                          )}

                          <p className="text-zinc-700 dark:text-white/75 text-base sm:text-lg md:text-[1.15rem] leading-8 whitespace-pre-line">
                            {selectedNote.body || "Add note body content in Sanity Studio."}
                          </p>
                        </div>

                        {selectedNote.sections && selectedNote.sections.length > 0 && (
                          <section className="mt-8 sm:mt-10 border-t border-black/10 dark:border-white/10 pt-8 sm:pt-10">
                            <div className="space-y-10 sm:space-y-12">
                              {selectedNote.sections.map((section, index) => {
                                const isImageLeft = index % 2 === 1;

                                const textBlock = (
                                  <div className="space-y-5 sm:space-y-6">
                                    {section.previewText && (
                                      <p className="max-w-3xl text-[1.15rem] sm:text-[1.4rem] md:text-[1.9rem] leading-[1.15] tracking-[-0.035em] text-zinc-900 dark:text-white/90 font-semibold whitespace-pre-line">
                                        {section.previewText}
                                      </p>
                                    )}

                                    {section.body && (
                                      <p className="max-w-2xl text-sm sm:text-base md:text-lg leading-[1.9] text-zinc-700 dark:text-white/70 whitespace-pre-line">
                                        {section.body}
                                      </p>
                                    )}
                                  </div>
                                );

                                const imageBlock = (
                                  <div>
                                    {section.image && (
                                      <div className="overflow-hidden rounded-[1.35rem] sm:rounded-[1.6rem] border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                                        <img
                                          src={urlFor(section.image).width(1200).height(900).url()}
                                          alt={section.previewText || `Note section ${index + 1} image`}
                                          className="w-full h-[220px] sm:h-[260px] md:h-[320px] object-cover"
                                        />
                                      </div>
                                    )}
                                  </div>
                                );

                                return (
                                  <div
                                    key={`note-section-${index}`}
                                    className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-8 md:gap-10 items-start"
                                  >
                                    {isImageLeft ? (
                                      <>
                                        {imageBlock}
                                        {textBlock}
                                      </>
                                    ) : (
                                      <>
                                        {textBlock}
                                        {imageBlock}
                                      </>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </section>
                        )}

                        {selectedNote.ctaLabel && selectedNote.ctaLink && (
                          <div className="pt-2">
                            <a
                              href={selectedNote.ctaLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 px-5 py-3 text-xs uppercase tracking-[0.2em] text-zinc-800 dark:text-white/80 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                            >
                              {selectedNote.ctaLabel}
                            </a>
                          </div>
                        )}
                      </motion.div>

                      {relatedNotes.length > 0 && (
                        <section className="mt-10 sm:mt-12 border-t border-black/10 dark:border-white/10 pt-8 sm:pt-10">
                          <p className="text-[11px] sm:text-xs lowercase tracking-[0.3em] text-zinc-500 dark:text-white/40 mb-8">
                            .see also
                          </p>

                          <div className="space-y-0">
                            {relatedNotes.map((note) => (
                              <button
                                key={note._id}
                                type="button"
                                onClick={() => {
                                  setSelectedNote(note);
                                  latestScrollRef.current?.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                }}
                                className="group grid w-full grid-cols-[1fr_auto] items-start gap-6 border-t border-black/10 dark:border-white/10 py-7 text-left first:border-t-0"
                              >
                                <div className="min-w-0">
                                  <h3 className="max-w-3xl text-[1.55rem] sm:text-[1.9rem] md:text-[2.25rem] leading-[1.04] tracking-[-0.05em] text-zinc-900 dark:text-white/88">
                                    {note.title}
                                  </h3>

                                  <p className="mt-3 text-[13px] sm:text-sm tracking-[0.16em] uppercase text-zinc-500 dark:text-white/42 font-mono">
                                    {formatNoteDate(note.date)}
                                    {note.type ? ` · ${note.type}` : ""}
                                    {note.readingTime ? ` · ${note.readingTime}` : ""}
                                  </p>
                                </div>

                                <div className="pt-1 shrink-0">
                                  <span className="inline-block text-[30px] sm:text-[38px] leading-none text-zinc-500 dark:text-white/65 transition-transform duration-200 group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:text-zinc-900 dark:group-hover:text-white">
                                    ↗
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isContactOpen && (
          <motion.div
            className="fixed inset-0 z-[97]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/45 dark:bg-black/68 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeContact}
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
                  <div className="absolute inset-0 hidden dark:block bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:120px_120px] opacity-[0.18]" />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                  <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[rgba(6,6,8,0.88)] backdrop-blur-2xl overflow-hidden shadow-2xl">
                    <div className="flex items-start justify-between gap-4 sm:gap-6 border-b border-black/10 dark:border-white/10 px-4 sm:px-5 md:px-8 py-4 sm:py-5 md:py-6">
                      <div className="max-w-4xl">
                        <p className="text-[11px] sm:text-xs tracking-[0.3em] text-zinc-500 dark:text-gray-400 mb-3">
                          .contact
                        </p>

                        <h3 className="mt-4 sm:mt-6 max-w-4xl text-[1.6rem] sm:text-[2rem] md:text-[3rem] leading-[1.02] tracking-[-0.05em] text-zinc-900 dark:text-white/82 whitespace-pre-line font-medium">
                          {contact?.headline ?? "Let’s work together"}
                        </h3>

                        <p className="mt-3 sm:mt-4 max-w-2xl text-[0.92rem] sm:text-[1rem] md:text-[1.1rem] leading-[1.75] text-zinc-700 dark:text-zinc-300">
                          {contact?.body ??
                            "Feel free to reach out for collaborations, freelance work, or just to say hi."}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={closeContact}
                        className="relative z-10 inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-white/80 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors shrink-0"
                        aria-label="Close contact overlay"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="px-4 sm:px-5 md:px-8 py-6 sm:py-8 md:py-10">
                      <div className="space-y-4 sm:space-y-5">
                        {contact?.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            onMouseEnter={() => setHoveredContactItem("email")}
                            onMouseLeave={() => setHoveredContactItem(null)}
                            className="group block w-full rounded-[1.4rem] sm:rounded-full border border-black/10 dark:border-white/15 bg-black/[0.03] dark:bg-white/5 px-4 sm:px-6 md:px-8 py-4 sm:py-5 text-zinc-800 dark:text-white/80 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 min-w-0">
                              <span className="text-[11px] sm:text-xs capitalize tracking-[0.22em] text-zinc-500 dark:text-white/45 shrink-0 group-hover:text-white/70 dark:group-hover:text-black/55 transition-colors">
                                Email
                              </span>

                              <span className="flex items-center gap-3 min-w-0 sm:max-w-[72%] sm:ml-auto">
                                <span className="text-sm sm:text-base md:text-[1.05rem] break-all sm:break-normal sm:text-right min-w-0">
                                  {contact.email}
                                </span>

                                <span className="relative flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center overflow-hidden">
                                  <AnimatePresence mode="wait">
                                    {hoveredContactItem === "email" && (
                                      <motion.span
                                        key="email-arrow"
                                        initial={{ opacity: 0, x: -8, y: 2, scale: 0.92 }}
                                        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -6, y: 2, scale: 0.96 }}
                                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                                        className="absolute text-current text-[15px] sm:text-[17px] leading-none"
                                      >
                                        ⤴
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                                </span>
                              </span>
                            </div>
                          </a>
                        )}

                        {contact?.links?.map((item, index) =>
                          item?.label && item?.url ? (
                            <a
                              key={`${item.label || "contact-link"}-${index}`}
                              href={item.url}
                              target={item.url?.startsWith("mailto:") ? undefined : "_blank"}
                              rel={item.url?.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                              onMouseEnter={() => setHoveredContactItem(`link-${index}`)}
                              onMouseLeave={() => setHoveredContactItem(null)}
                              className="group block w-full rounded-[1.4rem] sm:rounded-full border border-black/10 dark:border-white/15 bg-black/[0.03] dark:bg-white/5 px-4 sm:px-6 md:px-8 py-4 sm:py-5 text-zinc-800 dark:text-white/80 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 min-w-0">
                                <span className="text-[11px] sm:text-xs capitalize tracking-[0.22em] text-zinc-500 dark:text-white/45 shrink-0 group-hover:text-white/70 dark:group-hover:text-black/55 transition-colors">
                                  {item.label}
                                </span>

                                <span className="flex items-center gap-3 min-w-0 sm:max-w-[72%] sm:ml-auto">
                                  <span className="text-sm sm:text-base md:text-[1.05rem] break-all sm:break-normal sm:text-right min-w-0">
                                    {item.url.replace(/^https?:\/\//, "").replace(/^www\./, "")}
                                  </span>

                                  <span className="relative flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center overflow-hidden">
                                    <AnimatePresence mode="wait">
                                      {hoveredContactItem === `link-${index}` && (
                                        <motion.span
                                          key={`arrow-${index}`}
                                          initial={{ opacity: 0, x: -8, y: 2, scale: 0.92 }}
                                          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, x: -6, y: 2, scale: 0.96 }}
                                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                                          className="absolute text-current text-[15px] sm:text-[17px] leading-none"
                                        >
                                          ⤴
                                        </motion.span>
                                      )}
                                    </AnimatePresence>
                                  </span>
                                </span>
                              </div>
                            </a>
                          ) : null
                        )}

                        {contact?.resume?.asset?.url && (
                          <a
                            href={contact.resume.asset.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseEnter={() => setHoveredContactItem("resume")}
                            onMouseLeave={() => setHoveredContactItem(null)}
                            className="group block w-full rounded-[1.4rem] sm:rounded-full border border-black/10 dark:border-white/15 bg-black/[0.03] dark:bg-white/5 px-4 sm:px-6 md:px-8 py-4 sm:py-5 text-zinc-800 dark:text-white/80 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 min-w-0">
                              <span className="text-[11px] sm:text-xs capitalize tracking-[0.22em] text-zinc-500 dark:text-white/45 shrink-0 group-hover:text-white/70 dark:group-hover:text-black/55 transition-colors">
                                {contact.resumeLabel ?? "Resume"}
                              </span>

                              <span className="flex items-center gap-3 min-w-0 sm:max-w-[72%] sm:ml-auto">
                                <span className="text-sm sm:text-base md:text-[1.05rem] break-all sm:break-normal sm:text-right min-w-0">
                                  Open PDF
                                </span>

                                <span className="relative flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center overflow-hidden">
                                  <AnimatePresence mode="wait">
                                    {hoveredContactItem === "resume" && (
                                      <motion.span
                                        key="resume-arrow"
                                        initial={{ opacity: 0, x: -8, y: 2, scale: 0.92 }}
                                        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -6, y: 2, scale: 0.96 }}
                                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                                        className="absolute text-current text-[15px] sm:text-[17px] leading-none"
                                      >
                                        ⤴
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                                </span>
                              </span>
                            </div>
                          </a>
                        )}

                        {!contact?.email &&
                          !contact?.links?.length &&
                          !contact?.resume?.asset?.url && (
                            <div className="rounded-[1.4rem] sm:rounded-[1.6rem] border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/5 p-6 sm:p-8">
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Add contact data in Sanity Studio.
                              </p>
                            </div>
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