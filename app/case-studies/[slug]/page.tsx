import { getAllCaseStudyMeta, getCaseStudyMeta } from '@/lib/content'
import { notFound } from 'next/navigation'

// Dynamic import helper for MDX files under content/case-studies
async function importCaseStudy(slug: string) {
  try {
    const mod = await import(`../../content/case-studies/${slug}.mdx`)
    return mod.default as React.ComponentType
  } catch {
    return null
  }
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const metas = getAllCaseStudyMeta()
  return metas.map((m) => ({ slug: m.slug }))
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const meta = getCaseStudyMeta(slug)
  if (!meta) notFound()

  const { frontmatter } = meta
  const MDXContent = await importCaseStudy(slug)
  if (!MDXContent) notFound()

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{frontmatter.title}</h1>
        <p className="mt-2 text-gray-600">{frontmatter.summary}</p>
        {frontmatter.tags && Array.isArray(frontmatter.tags) && frontmatter.tags.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {frontmatter.tags.map((t) => (
              <span key={t} className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <section className="prose max-w-none">
        <MDXContent />
      </section>

      <footer className="mt-10 border-t pt-6 text-sm text-gray-600">
        <div className="flex flex-wrap gap-4">
          {frontmatter.liveUrl ? (
            <a className="underline" href={frontmatter.liveUrl} target="_blank" rel="noreferrer">
              Live demo
            </a>
          ) : null}
          {frontmatter.repoUrl ? (
            <a className="underline" href={frontmatter.repoUrl} target="_blank" rel="noreferrer">
              Source code
            </a>
          ) : null}
        </div>
      </footer>
    </article>
  )
}