import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="font-mono text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl sm:leading-tight">
      {children}
    </h1>
  )
}
