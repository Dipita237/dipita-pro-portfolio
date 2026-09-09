import fs from 'fs'
import path from 'path'

export type CaseStudyFrontmatter = {
  title: string
  date: string
  tags: string[]
  summary: string
  coverImage?: string
  liveUrl?: string
  repoUrl?: string
  metrics?: string[]
}

export type CaseStudyMeta = {
  slug: string
  frontmatter: CaseStudyFrontmatter
}

const contentDir = path.join(process.cwd(), 'content/case-studies')

export function getCaseStudySlugs(): string[] {
  if (!fs.existsSync(contentDir)) return []
  const files = fs.readdirSync(contentDir)
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

export function getCaseStudyMeta(slug: string): CaseStudyMeta | null {
  const filePath = path.join(contentDir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const source = fs.readFileSync(filePath, 'utf8')
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(source)
  if (!match) return null

  const fmText = match[1]
  const frontmatter = parseFrontmatter(fmText) as CaseStudyFrontmatter

  return { slug, frontmatter }
}

export function getAllCaseStudyMeta(): CaseStudyMeta[] {
  return getCaseStudySlugs()
    .map((slug) => getCaseStudyMeta(slug))
    .filter((m): m is CaseStudyMeta => m !== null)
    .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
}
function parseFrontmatter(text: string): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  const lines = text.split('\n')
  let currentKey: string | null = null

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim()) continue

    if (line.startsWith('- ')) {
      if (currentKey && Array.isArray(out[currentKey])) {
        const arr = out[currentKey] as string[]
        arr.push(line.slice(2).trim())
      }
      continue
    }

    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()

    if (value === '') {
      currentKey = key
      out[key] = []
    } else {
      currentKey = null
      
      // Check if the value is an inline bracketed array: ["A", "B"]
      if (value.startsWith('[') && value.endsWith(']')) {
        out[key] = value
          .slice(1, -1)              // Remove brackets [ ]
          .split(',')                 // Split by comma
          .map((item) =>              // Trim and unquote each item
            item.trim().replace(/^["'](.*)["']$/, '$1')
          )
          .filter(Boolean)            // Clear empty slots if any
      } else {
        // Unquote simple strings
        out[key] = value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')
      }
    }
  }

  return out
}
