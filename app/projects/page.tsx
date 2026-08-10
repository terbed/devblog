import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import PageHeader from '@/components/PageHeader'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <>
      <PageHeader
        title="projects"
        description="Here, I showcase some of my major projects."
        meta={`${projectsData.length} entries`}
      />

      <div className="grid gap-6 border-t border-rule pt-10 sm:grid-cols-2">
        {projectsData.map((d, i) => (
          <Card
            key={d.title}
            index={i}
            title={d.title}
            description={d.description}
            imgSrc={d.imgSrc}
            href={d.href}
          />
        ))}
      </div>
    </>
  )
}
