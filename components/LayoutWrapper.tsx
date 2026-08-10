import SectionContainer from './SectionContainer'
import Footer from './Footer'
import { ReactNode } from 'react'
import Header from './Header'

interface Props {
  children: ReactNode
}

// Fonts are declared once on <html> in app/layout.tsx, so nothing to load here.
const LayoutWrapper = ({ children }: Props) => {
  return (
    <SectionContainer>
      <div className="flex min-h-screen flex-col justify-between">
        <Header />
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
