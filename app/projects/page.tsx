import { getAllCaseStudyMeta } from '@/lib/content'
import Link from 'next/link'

export const metadata = {
  title: 'Projects — Dipita Pro Portfolio',
  description: 'Case studies and projects by Dipita Ebongue.',
}

export default function ProjectsPage() {
  const projects = getAllCaseStudyMeta()

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold">Projects</h1>
      <p className="mt-2 text-gray-700">
        Selected case studies with architecture, results, and lessons.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/case-studies/${p.slug}`}
            className="rounded-lg border p-5 transition hover:shadow-md"
          >
            <h3 className="font-semibold">{p.frontmatter.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-gray-700">
              {p.frontmatter.summary}
            </p>
            {p.frontmatter.tags && Array.isArray(p.frontmatter.tags) ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {p.frontmatter.tags.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </main>
  )
}