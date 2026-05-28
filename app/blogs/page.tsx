"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import Navbar from "@/components/homepage/nav";
import { Footer } from "@/components/homepage/footer";

export default function BlogsPage() {
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(
          collection(db, "blogs"),
          where("website", "==", "buildchemsolutionsinc"),
          orderBy("createdAt", "desc"),
        );
        const querySnapshot = await getDocs(q);
        const blogs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllPosts(blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={36} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[55vh] min-h-[400px] flex items-end">
        <Image
          src="/images/hero-image.jpg"
          alt="Blogs"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pb-16 md:pb-24">
          <p className="text-xs md:text-sm uppercase tracking-wider text-white/60 mb-3 font-medium">
            Buildchem Solutions
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-4 leading-tight">
            Our <span className="text-white/60">Blogs</span>
          </h1>
          <p className="text-white/70 text-base max-w-xl leading-relaxed">
            Insights and updates from our industry experts on construction
            chemicals and building solutions.
          </p>
        </div>
      </section>

      {/* ── BLOGS GRID ── */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          {/* Header */}
          <div className="flex flex-col gap-6 mb-16">
            <div className="flex items-center gap-3 px-4 py-2 border border-gray-300 w-fit">
              <div className="w-2.5 h-2.5 bg-blue-600" />
              <span className="text-sm font-medium text-gray-600 tracking-wide">
                Latest Articles
              </span>
            </div>
            <div className="flex items-end justify-between gap-8">
              <h2 className="text-4xl md:text-5xl font-normal text-gray-900 tracking-tight">
                {"Industry Insights".split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ filter: "blur(10px)", opacity: 0 }}
                    whileInView={{ filter: "blur(0px)", opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="inline-block mr-[0.25em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </h2>
              {allPosts.length > 0 && (
                <p className="text-sm text-gray-500 flex-shrink-0 pb-1">
                  {allPosts.length} article{allPosts.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>

          {/* Empty State */}
          {allPosts.length === 0 ? (
            <div className="text-center py-32 border border-gray-200">
              <p className="text-lg text-gray-500 mb-2">No articles yet.</p>
              <p className="text-sm text-gray-400">
                Check back soon for insights from our team.
              </p>
            </div>
          ) : (
            <>
              {/* Featured Post (First) */}
              {currentPage === 1 && currentPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <Link
                    href={`/blogs/${currentPosts[0].slug || currentPosts[0].id}`}
                  >
                    <div className="group grid grid-cols-1 md:grid-cols-2 border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all duration-300 overflow-hidden">
                      <div className="relative aspect-[4/3] md:aspect-auto md:h-80 overflow-hidden">
                        <Image
                          src={currentPosts[0].coverImage || "/placeholder.svg"}
                          alt={currentPosts[0].title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                          <Calendar size={13} />
                          <span>
                            {currentPosts[0].createdAt?.toDate
                              ? new Date(
                                  currentPosts[0].createdAt.toDate(),
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "Recent Post"}
                          </span>
                          <span className="text-blue-600 font-medium uppercase tracking-wider text-[10px] border border-blue-200 px-2 py-0.5">
                            Featured
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                          {currentPosts[0].title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
                          {(
                            currentPosts[0].excerpt ||
                            currentPosts[0].sections?.[0]?.description ||
                            ""
                          )
                            .replace(/<\/?[^>]+(>|$)/g, "")
                            .slice(0, 160)}
                        </p>
                        <span className="text-sm font-medium text-blue-600 flex items-center gap-2 group-hover:gap-3 transition-all">
                          Read Article
                          <span>→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Remaining Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(currentPage === 1 ? currentPosts.slice(1) : currentPosts).map(
                  (blog, index) => (
                    <motion.div
                      key={blog.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link href={`/blogs/${blog.slug || blog.id}`}>
                        <div className="group border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all duration-300 overflow-hidden h-full flex flex-col">
                          <div className="relative aspect-[16/9] overflow-hidden">
                            <Image
                              src={blog.coverImage || "/placeholder.svg"}
                              alt={blog.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-6 flex flex-col flex-1">
                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                              <Calendar size={12} />
                              <span>
                                {blog.createdAt?.toDate
                                  ? new Date(
                                      blog.createdAt.toDate(),
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "Recent Post"}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors flex-1">
                              {blog.title}
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                              {(
                                blog.excerpt ||
                                blog.sections?.[0]?.description ||
                                ""
                              )
                                .replace(/<\/?[^>]+(>|$)/g, "")
                                .slice(0, 100)}
                            </p>
                            <span className="text-sm font-medium text-blue-600 flex items-center gap-1.5 group-hover:gap-2.5 transition-all mt-auto">
                              Read More →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ),
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-16">
                  <button
                    onClick={() => goToPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 border border-gray-200 flex items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-9 h-9 border text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      goToPage(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 border border-gray-200 flex items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
