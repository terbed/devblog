'use client'

import { Fragment, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Menu, RadioGroup, Transition } from '@headlessui/react'
import { Sun, Moon, Monitor } from '@/components/PixelIcons'

const options = [
  { value: 'light', label: 'light', Icon: Sun },
  { value: 'dark', label: 'dark', Icon: Moon },
  { value: 'system', label: 'system', Icon: Monitor },
] as const

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  return (
    <Menu as="div" className="relative ml-3 inline-block text-left">
      <Menu.Button
        aria-label="Theme switcher"
        className="flex items-center text-ink-muted transition-colors hover:text-primary-500"
      >
        {mounted ? (
          resolvedTheme === 'dark' ? (
            <Moon />
          ) : (
            <Sun />
          )
        ) : (
          <span className="h-[18px] w-[18px]" />
        )}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-3 w-32 origin-top-right border border-rule bg-paper p-1 font-mono text-xs shadow-none focus:outline-none">
          <RadioGroup value={theme} onChange={setTheme}>
            {options.map(({ value, label, Icon }) => (
              <RadioGroup.Option key={value} value={value}>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex w-full items-center gap-2 px-2 py-1.5 lowercase transition-colors ${
                        active ? 'bg-primary-500/10 text-primary-500' : 'text-ink-muted'
                      } ${theme === value ? 'text-primary-500' : ''}`}
                    >
                      <Icon />
                      {label}
                      {theme === value && <span className="ml-auto text-primary-500">*</span>}
                    </button>
                  )}
                </Menu.Item>
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default ThemeSwitch
