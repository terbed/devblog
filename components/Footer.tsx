import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={7} />
          <SocialIcon kind="github" href={siteMetadata.github} size={6} />
          <SocialIcon kind="facebook" href={siteMetadata.facebook} size={6} />
          <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
          <SocialIcon kind="x" href={siteMetadata.x} size={6} />
          <SocialIcon kind="instagram" href={siteMetadata.instagram} size={6} />
          <SocialIcon kind="threads" href={siteMetadata.threads} size={6} />
          <SocialIcon kind="kofi" href={siteMetadata.kofi} size={7} />
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
        <div className="mb-8 flex items-center text-sm text-gray-500 dark:text-gray-400">
          {/*<Link href="https://github.com/timlrx/tailwind-nextjs-starter-blog">*/}
          {/*  Tailwind Nextjs Theme*/}
          {/*</Link>*/}
          <div className="flex flex-col items-center space-y-2">
            <span>Just Keep Going Patiently 🚀</span>
            <div className="flex items-center space-x-1">
              <span>Content Licensed Under</span>
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1"
              >
                <img
                  alt="Creative Commons License"
                  className="h-6 w-6 dark:invert"
                  src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
                />
                <img
                  alt="Attribution"
                  className="h-6 w-6 dark:invert"
                  src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
                />
                <span className="hover:underline">CC BY 4.0</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
