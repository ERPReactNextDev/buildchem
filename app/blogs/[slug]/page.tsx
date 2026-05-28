"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { Loader2, ArrowLeft, Calendar } from "lucide-react";
import Navbar from "@/components/homepage/nav";
import { Footer } from "@/components/homepage/footer";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      try {
        const q = query(
          collection(db, "blogs"),
          where("slug", "==", slug),
          where("website", "==", "buildchemsolutionsinc"),
          limit(1),
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setBlog(querySnapshot.docs[0].data());
        } else {
          setBlog(null);
        }
      } catch (err) {
        console.error("Firestore Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={36} />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] px-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Article not found
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              The article you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              <ArrowLeft size={14} /> Back to Blogs
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[50vh] min-h-[360px] flex items-end">
        <Image
          src={blog.coverImage || "/images/hero-image.jpg"}
          alt={blog.title || "Blog"}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 pb-12 md:pb-16">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-5 text-xs uppercase font-medium tracking-wider"
          >
            <ArrowLeft size={13} /> Back to Blogs
          </Link>
          {blog.createdAt?.toDate && (
            <div className="flex items-center gap-2 text-white/60 text-xs mb-4">
              <Calendar size={12} />
              <span>
                {new Date(blog.createdAt.toDate()).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
            {blog.title}
          </h1>
        </div>
      </section>

      {/* ── ARTICLE CONTENT ── */}
      <article className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Intro paragraph */}
        {blog.sections?.[0]?.type === "paragraph" && (
          <div className="mb-12">
            <style>{`
              .blog-intro h1 { font-size: 2em; font-weight: 800; margin: 0.67em 0; line-height: 1.2; }
              .blog-intro h2 { font-size: 1.5em; font-weight: 700; margin: 0.83em 0; line-height: 1.3; }
              .blog-intro p { margin: 1em 0; }
              .blog-intro strong { font-weight: 700; }
              .blog-intro em { font-style: italic; }
              .blog-intro ul { list-style-type: disc; padding-left: 1.5em; margin: 1em 0; }
              .blog-intro ol { list-style-type: decimal; padding-left: 1.5em; margin: 1em 0; }
              .blog-intro li { margin: 0.25em 0; }
              .blog-intro a { color: #2563eb; text-decoration: underline; }
              .blog-intro a:hover { color: #1d4ed8; }
            `}</style>
            <div
              className="blog-intro text-base text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.sections[0].description }}
            />
          </div>
        )}

        {/* Sections */}
        <div className="space-y-16">
          {blog.sections?.map((section: any, index: number) => {
            if (index === 0 && section.type === "paragraph") return null;

            return (
              <div key={index} className="space-y-6">
                {section.title && (
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
                    {section.title}
                  </h2>
                )}

                {section.imageUrl && (
                  <div className="w-full border border-gray-200 overflow-hidden">
                    <img
                      src={section.imageUrl}
                      alt={section.title || "Blog section"}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {section.description && (
                  <>
                    <style>{`
                      .blog-content h1 { font-size: 2em; font-weight: 800; margin: 0.67em 0; line-height: 1.2; }
                      .blog-content h2 { font-size: 1.5em; font-weight: 700; margin: 0.83em 0; line-height: 1.3; }
                      .blog-content p { margin: 1em 0; }
                      .blog-content strong { font-weight: 700; }
                      .blog-content em { font-style: italic; }
                      .blog-content ul { list-style-type: disc; padding-left: 1.5em; margin: 1em 0; }
                      .blog-content ol { list-style-type: decimal; padding-left: 1.5em; margin: 1em 0; }
                      .blog-content li { margin: 0.25em 0; }
                      .blog-content a { color: #2563eb; text-decoration: underline; }
                      .blog-content a:hover { color: #1d4ed8; }
                    `}</style>
                    <div
                      className="blog-content text-base text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: section.description }}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={14} /> Back to all articles
          </Link>
        </div>
      </article>

      <Footer />
    </main>
  );
}
