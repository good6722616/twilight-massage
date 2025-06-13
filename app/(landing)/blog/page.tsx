import React from "react"
import BlogNewsletter from "@/components/blog/BlogNewsletter"
import BlogList from "@/components/blog/BlogList"

const blogPosts = [
  {
    slug: "achieve-ultimate-relaxation",
    title: "Achieve ultimate relaxation with these spa tips",
    date: "2024-12-16",
    category: "Tips",
    summary:
      "Eu et lacus sem lacus eget facilisis diam habitasse feugiat non diam egestas.",
    image: "/blog/spa-tips.jpg", // Placeholder image path
  },
  {
    slug: "how-to-choose-right-treatment",
    title: "How to choose the right spa treatment for your needs",
    date: "2024-12-16",
    category: "Resources",
    summary:
      "Morbi est libero proin iaculis nibh vitae sit in amet dui varius sollicitudin egestas.",
    image: "/blog/spa-choice.jpg", // Placeholder image path
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#f8f3ef] px-4 py-12 pt-40 md:pt-40">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-4 text-center font-serif text-6xl text-[#3d3327]">
          Articles & news
        </h1>
        <p className="mx-auto mb-16 max-w-2xl text-center text-2xl text-[#7c6f5f]">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip.
        </p>
        <div className="flex flex-col items-start justify-center gap-12 md:flex-row md:gap-20">
          <BlogNewsletter />
          <BlogList posts={blogPosts} />
        </div>
      </div>
    </main>
  )
}
