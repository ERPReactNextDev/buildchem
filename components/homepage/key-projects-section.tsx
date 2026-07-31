"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, ArrowLeft, ArrowRight } from "lucide-react";

interface KeyProject {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  order?: number;
  createdAt?: any;
  updatedAt?: any;
}

/* =========================
   Animation Variants
========================= */

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/* =========================
   Arrow Icon (row affordance)
========================= */

function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 15.5L15.5 4.5M15.5 4.5H6.5M15.5 4.5V13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================
   Skeleton loader
========================= */

function KeyProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start animate-pulse">
      <div className="w-full aspect-[4/3] lg:aspect-[16/12] rounded-2xl bg-gray-100" />
      <div className="flex flex-col">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="border-b border-gray-200 py-6 md:py-7 flex items-start gap-5 md:gap-6"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-gray-100 shrink-0" />
            <div className="flex-1 space-y-3 pt-1.5">
              <div className="h-6 bg-gray-100 rounded w-2/3" />
              {i === 0 && <div className="h-4 bg-gray-100 rounded w-full max-w-md" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface KeyProjectsSectionProps {
  className?: string;
}

export function KeyProjectsSection({ className }: KeyProjectsSectionProps) {
  const [projects, setProjects] = useState<KeyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = collection(db, "buildchemKeyProjects");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as KeyProject[];

      // Keep this in sync with the order set in the admin CMS so the
      // sequence on the live site always matches what was arranged there.
      projectsData.sort((a, b) => {
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) return orderA - orderB;
        const createdA = a.createdAt?.toMillis?.() ?? 0;
        const createdB = b.createdAt?.toMillis?.() ?? 0;
        return createdA - createdB;
      });

      setProjects(projectsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const activeProject = projects[activeIndex];

  const goPrev = () =>
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
  const goNext = () =>
    setActiveIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));

  // Keyboard navigation: up/down arrows move through the list when the
  // list itself (or a row inside it) has focus.
  const handleListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      goPrev();
    }
  };

  // When the active project changes, keep its row visible within the
  // scrollable list (useful if the list ever exceeds viewport height).
  useEffect(() => {
    const activeEl = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`,
    );
    activeEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  return (
    <section
      className={cn(
        "w-full bg-white py-24 border-b border-gray-200/50",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
          className="flex flex-col gap-6 mb-16"
        >
          <div className="flex items-center gap-3 px-4 py-2 border border-gray-300 w-fit">
            <div className="w-2.5 h-2.5 bg-[#004AAD]" />
            <span className="text-sm font-medium text-gray-600 tracking-wide">
              Our Portfolio
            </span>
          </div>

          <h2 className="text-balance text-gray-900 text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] max-w-[700px] tracking-tight">
            {"Key Projects"
              .split(" ")
              .map((word, i) => (
                <motion.span
                  key={i}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { filter: "blur(10px)", opacity: 0 }
                  }
                  whileInView={{ filter: "blur(0px)", opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
          </h2>
        </motion.div>

        {/* Body */}
        {loading ? (
          <KeyProjectsSkeleton />
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-gray-500 flex flex-col items-center gap-3">
            <ImageIcon className="w-8 h-8 text-gray-300" />
            <p>No projects to display yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: sticky preview panel */}
            <div className="lg:sticky lg:top-28">
              <div className="relative w-full aspect-[4/3] lg:aspect-[16/12] rounded-2xl overflow-hidden bg-[#0A0A0A] shadow-xl shadow-gray-200/60 ring-1 ring-gray-200/50">
                <AnimatePresence mode="wait">
                  {activeProject?.imageUrl ? (
                    <motion.img
                      key={activeProject.id}
                      src={activeProject.imageUrl}
                      alt={activeProject.title}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 1.04, filter: "brightness(0.9)" }
                      }
                      animate={{ opacity: 1, scale: 1, filter: "brightness(1)" }}
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.98 }
                      }
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 w-full h-full object-cover [filter:saturate(1.1)_contrast(1.05)]"
                    />
                  ) : (
                    <motion.div
                      key={activeProject?.id ?? "empty"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm"
                    >
                      No preview available
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Caption overlay — always tells the viewer exactly which
                    project the image belongs to, no need to look at the
                    list on the right to figure it out. */}
                <AnimatePresence mode="wait">
                  {activeProject && (
                    <motion.div
                      key={`caption-${activeProject.id}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-x-0 bottom-0 p-5 md:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                    >
                      <span className="text-xs font-medium text-white/70 tabular-nums">
                        {String(activeIndex + 1).padStart(2, "0")} /{" "}
                        {String(projects.length).padStart(2, "0")}
                      </span>
                      <h3 className="text-white text-lg md:text-xl font-medium tracking-tight mt-0.5">
                        {activeProject.title}
                      </h3>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Previous / Next — gives touch and keyboard users a way to
                  step through projects without hunting the list, and
                  doubles as the primary control on mobile where hover
                  doesn't exist. */}
              <div className="flex items-center justify-between mt-4">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous project"
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[48px] border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004AAD] focus-visible:ring-offset-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next project"
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[48px] bg-[#004AAD] text-white rounded-lg text-sm font-medium hover:bg-[#003a8a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004AAD] focus-visible:ring-offset-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: interactive numbered list */}
            <motion.div
              ref={listRef}
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              onKeyDown={handleListKeyDown}
              className="flex flex-col"
            >
              {projects.map((project, index) => {
                const isActive = index === activeIndex;
                return (
                  <motion.button
                    key={project.id}
                    type="button"
                    data-index={index}
                    variants={rowVariants}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    aria-current={isActive}
                    whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "group w-full text-left border-b border-gray-200 py-6 md:py-7 px-4 -mx-4 rounded-lg flex items-start gap-5 md:gap-6 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004AAD] focus-visible:ring-offset-2",
                      isActive
                        ? "bg-[#004AAD]/[0.04] shadow-sm"
                        : "hover:bg-gray-50/70",
                    )}
                  >
                    {/* Index number */}
                    <span
                      className={cn(
                        "text-sm font-medium pt-1.5 tabular-nums transition-colors duration-300 shrink-0",
                        isActive ? "text-[#004AAD]" : "text-gray-400",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Thumbnail — lets people visually match each title to
                        its image at a glance, without needing to hover
                        (important on mobile/touch where hover doesn't apply). */}
                    <div
                      className={cn(
                        "relative shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-gray-100 transition-opacity duration-300",
                        isActive ? "opacity-100" : "opacity-60 group-hover:opacity-90",
                      )}
                    >
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      {isActive && (
                        <div className="absolute inset-0 ring-2 ring-inset ring-[#004AAD] rounded-lg" />
                      )}
                    </div>

                    {/* Title + description */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <h4
                        className={cn(
                          "text-2xl md:text-3xl font-medium tracking-tight transition-colors duration-300",
                          isActive ? "text-gray-900" : "text-gray-400",
                        )}
                      >
                        {project.title}
                      </h4>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="text-gray-600 text-base leading-[1.7] overflow-hidden"
                          >
                            {project.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Arrow */}
                    <motion.div
                      animate={{
                        opacity: isActive ? 1 : 0,
                        x: isActive ? 0 : -8,
                      }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="pt-1.5 shrink-0 text-[#004AAD]"
                    >
                      <ArrowIcon />
                    </motion.div>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}