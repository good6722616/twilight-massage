import Link from "next/link"

export interface BlogPost {
  slug: string
  title: string
  date: string
  category: string
  summary: string
  image: string
}

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="mx-auto w-full max-w-2xl flex-1 md:mx-0">
      {posts.map((post, idx) => (
        <div
          key={post.slug}
          className={idx !== 0 ? "border-t border-[#e5ded6] pt-14" : ""}
        >
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[#e5ded6]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="text-lg font-medium text-[#a67c52]">
                  {post.category}
                </span>
                <span className="text-base text-[#b6a995]">
                  —{" "}
                  {new Date(post.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h3 className="mb-3 font-serif text-3xl text-[#3d3327]">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p className="mb-2 text-lg text-[#7c6f5f]">{post.summary}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
