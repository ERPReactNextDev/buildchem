"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";

interface Solution {
  id: string;
  title: string;
  description: string;
  mainImage: string;
}

export function Hero() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loadingSolutions, setLoadingSolutions] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const q = query(collection(db, "solutions"), limit(5));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          mainImage: doc.data().mainImage,
        }));
        setSolutions(data);
      } catch (error) {
        console.error("Error fetching solutions:", error);
      } finally {
        setLoadingSolutions(false);
      }
    };
    fetchSolutions();
  }, []);

  useEffect(() => {
    if (solutions.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % solutions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [solutions.length]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-image.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col pt-32">
        <div className="flex flex-1 items-center max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 w-full items-center">
            {/* LEFT — Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <div className="flex items-center gap-3 px-4 py-2 border border-white/30 w-fit mb-6">
                <div className="w-2 h-2 bg-[#004AAD]" />
                <span className="text-xs font-medium text-white/70 tracking-widest uppercase">
                  Construction Chemicals
                </span>
              </div>

              <h1 className="max-w-xl text-balance text-5xl font-normal tracking-tight text-white md:text-6xl lg:text-7xl leading-[1.05]">
                {"Concrete Made Better".split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ filter: "blur(10px)", opacity: 0 }}
                    animate={{ filter: "blur(0px)", opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    className="inline-block mr-[0.25em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-6 max-w-md text-balance text-sm leading-relaxed text-white/70 md:text-base"
              >
                A leading provider of construction chemicals and building
                materials solutions — engineered for performance and built to
                last.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-start"
              >
                <Link
                  href="/contact"
                  className="bg-[#004AAD] px-8 py-3.5 text-sm font-semibold text-white uppercase tracking-widest hover:bg-[#003a8c] transition-colors duration-300"
                >
                  Get a Free Quote
                </Link>
                <Link
                  href="/solutions"
                  className="border border-white/30 px-8 py-3.5 text-sm font-semibold text-white uppercase tracking-widest hover:bg-white/10 transition-colors duration-300 flex items-center gap-2"
                >
                  Our Solutions <ChevronRight size={14} />
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT — Floating Carousel (desktop only) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              {loadingSolutions ? (
                <div className="flex items-center justify-center aspect-[4/3] bg-white/5 border border-white/10">
                  <Loader2 className="animate-spin text-white/30" size={32} />
                </div>
              ) : solutions.length > 0 ? (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                      className="absolute inset-0"
                    >
                      <img
                        src={
                          solutions[activeIndex]?.mainImage ||
                          "/placeholder.svg"
                        }
                        alt={solutions[activeIndex]?.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <motion.p
                          key={`label-${activeIndex}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="text-[10px] text-white/60 uppercase tracking-widest mb-1 font-medium"
                        >
                          Featured Solution
                        </motion.p>
                        <motion.h3
                          key={`title-${activeIndex}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4, delay: 0.25 }}
                          className="text-white text-xl font-normal tracking-tight"
                        >
                          {solutions[activeIndex]?.title}
                        </motion.h3>
                        <Link
                          href={`/solutions/${solutions[activeIndex]?.id}`}
                          className="inline-flex items-center gap-1.5 mt-3 text-[11px] text-[#004AAD] bg-white px-3 py-1.5 font-semibold uppercase tracking-widest hover:bg-white/90 transition-colors"
                        >
                          Learn More <ChevronRight size={11} />
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : null}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
