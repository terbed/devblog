import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="font-serif text-2xl font-semibold leading-tight text-ink sm:text-[2rem] sm:leading-[1.2]">
      {children}
    </h1>
  )
}
