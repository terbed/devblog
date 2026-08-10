'use client'

import React, { useState, useRef } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import Image from 'next/image'
import { breakFractions, planPages, type MeasuredItem } from '@/lib/pdfPagination'

type Skill = { name: string; level: number }

// A labelled bar reads faster than a ring and shares its form with the tag
// histogram, so the whole site measures things the same way.
const SkillBar = ({ name, level }: Skill) => (
  <li className="grid grid-cols-[1fr_3rem_1.75rem] items-center gap-x-3 font-mono text-xs">
    <span className="truncate text-ink-muted">{name}</span>
    <span aria-hidden="true" className="h-1 bg-rule">
      <span className="block h-full bg-primary-500/60" style={{ width: `${level}%` }} />
    </span>
    <span className="text-right tabular-nums text-ink-faint">{level}</span>
  </li>
)

const SkillGroup = ({
  title,
  skills,
  className = '',
}: {
  title: string
  skills: Skill[]
  className?: string
}) => (
  <div className={`border border-rule p-4 sm:p-5 ${className}`}>
    <h4 className="rule-label mb-4">{title.toLowerCase()}</h4>
    <ul className="space-y-2.5">
      {skills.map((skill) => (
        <SkillBar key={skill.name} name={skill.name} level={skill.level} />
      ))}
    </ul>
  </div>
)

// Grouped so the section reads top-down: what I can investigate, what I can
// model, and what I can build and run it on.
const researchGroup = {
  title: 'Research & Communication',
  skills: [
    { name: 'Research', level: 90 },
    { name: 'Publication', level: 85 },
  ],
}

const modelingGroup = {
  title: 'Data & Modeling',
  skills: [
    { name: 'Python', level: 90 },
    { name: 'ML / DL', level: 90 },
    { name: 'Quantitative Finance', level: 85 },
    { name: 'Bayesian Inference', level: 85 },
  ],
}

const systemsGroup = {
  title: 'Systems & Infrastructure',
  skills: [
    { name: 'Rust', level: 80 },
    { name: 'Go', level: 65 },
    { name: 'DevOps', level: 65 },
    { name: 'MLOps', level: 75 },
    { name: 'Big Data', level: 90 },
  ],
}

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const CAPTURE_SCALE = 2

// Self-contained blocks: a page may break either side of one, never through it.
const BLOCK_SELECTOR = '.milestone-item'

// Headings may only *start* a page. Their bottom edge is deliberately not a
// candidate, because breaking there strands the heading alone at the foot of
// the previous page.
const HEADING_SELECTOR = '.resume-section, h1, h4'

/** Measure the résumé's blocks and headings, in document order. */
const collectBreakFractions = (root: HTMLElement): number[] => {
  const rootRect = root.getBoundingClientRect()

  const items: MeasuredItem[] = Array.from(
    root.querySelectorAll(`${BLOCK_SELECTOR}, ${HEADING_SELECTOR}`)
  ).map((el) => {
    const rect = el.getBoundingClientRect()
    return {
      kind: el.matches(BLOCK_SELECTOR) ? 'block' : 'heading',
      top: rect.top - rootRect.top,
      bottom: rect.bottom - rootRect.top,
    }
  })

  return breakFractions(items, rootRect.height)
}

const ResumePage = () => {
  // Create a reference for the resume content
  const resumeRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false) // State to track loading

  const generatePDF = async () => {
    setIsLoading(true)

    // Yield a frame so the loading modal paints before the (blocking) capture.
    setTimeout(async () => {
      const element = resumeRef.current
      if (!element) {
        console.error('Resume content is not available for PDF generation.')
        setIsLoading(false)
        return
      }

      try {
        // Measured inside html2canvas's clone rather than on the live page.
        // The clone is laid out in its own iframe, so its line wrapping and
        // block heights can differ from what is on screen — and any such
        // reflow silently invalidates offsets taken from the live DOM, which
        // is what kept slicing headings in half.
        let breakFractions: number[] = []

        const canvas = await html2canvas(element, {
          scale: CAPTURE_SCALE,
          backgroundColor: '#ffffff',
          useCORS: true,
          // Pin the clone's viewport to the real one so media queries and the
          // `container` width resolve identically on both sides.
          windowWidth: document.documentElement.clientWidth,
          windowHeight: document.documentElement.clientHeight,
          onclone: (doc, clonedRoot) => {
            // Capture the light palette regardless of the reader's theme — a
            // dark-mode CV is not what anyone wants out of a download button.
            doc.documentElement.classList.remove('dark')
            doc.documentElement.style.colorScheme = 'light'
            breakFractions = collectBreakFractions(clonedRoot)
          },
        })

        // Fall back to the live DOM if the clone could not be measured.
        if (breakFractions.length <= 1) breakFractions = collectBreakFractions(element)

        const breakpoints = breakFractions.map((f) => f * canvas.height)

        const pdf = new jsPDF('p', 'mm', 'a4')
        const pxPerMm = canvas.width / A4_WIDTH_MM
        const pageHeightPx = A4_HEIGHT_MM * pxPerMm

        planPages(canvas.height, pageHeightPx, breakpoints).forEach(({ top, bottom }, i) => {
          const sliceTop = Math.round(top)
          const sliceHeight = Math.round(bottom) - sliceTop
          if (sliceHeight <= 0) return

          // Re-draw just this slice so each page is its own image; offsetting a
          // single tall image is what produced the overlapping cuts before.
          const slice = document.createElement('canvas')
          slice.width = canvas.width
          slice.height = sliceHeight
          const ctx = slice.getContext('2d')
          if (!ctx) return
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, slice.width, slice.height)
          ctx.drawImage(
            canvas,
            0,
            sliceTop,
            canvas.width,
            sliceHeight,
            0,
            0,
            canvas.width,
            sliceHeight
          )

          if (i > 0) pdf.addPage()
          pdf.addImage(
            slice.toDataURL('image/png'),
            'PNG',
            0,
            0,
            A4_WIDTH_MM,
            sliceHeight / pxPerMm
          )
        })

        pdf.save('DanielTerbeCV.pdf')
      } catch (error) {
        console.error('Error generating PDF:', error)
      } finally {
        setIsLoading(false)
      }
    }, 0)
  }

  return (
    <div className="resume-doc container mx-auto py-10">
      <div ref={resumeRef} className="border border-rule bg-paper p-5 sm:p-8">
        {/* Header Section */}
        <div className="divide-y divide-rule">
          {/* Name, Title, and Contact Section */}
          <div className="flex flex-col items-center space-y-4 pb-8 pt-6 md:flex-row md:justify-between md:space-y-0">
            {/* Left: Name and Title */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Dániel Terbe
              </h1>
              <p className="mt-2 font-mono text-sm text-ink-muted">AI Researcher & Developer</p>
            </div>

            {/* Right: Contact Information */}
            <div className="flex flex-col space-y-2 text-right">
              {/* Email */}
              <div className="flex items-center space-x-2">
                <svg
                  fill="currentColor"
                  width="24px"
                  height="24px"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-ink-muted"
                  viewBox="0 0 1920 1920"
                >
                  <path d="M1920 428.266v1189.54l-464.16-580.146-88.203 70.585 468.679 585.904H83.684l468.679-585.904-88.202-70.585L0 1617.805V428.265l959.944 832.441L1920 428.266ZM1919.932 226v52.627l-959.943 832.44L.045 278.628V226h1919.887Z" />
                </svg>
                <a
                  href="mailto:daniel@terbe.dev"
                  className="font-mono text-xs text-primary-500 hover:underline"
                >
                  daniel@terbe.dev
                </a>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center space-x-2">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-ink-muted"
                  fill="currentColor"
                >
                  <title>LinkedIn</title>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <a
                  href="https://www.linkedin.com/in/terbed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-primary-500 hover:underline"
                >
                  linkedin.com/in/terbed
                </a>
              </div>

              {/* GitHub */}
              <div className="flex items-center space-x-2">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-ink-muted"
                  fill="currentColor"
                >
                  <title>GitHub</title>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <a
                  href="https://github.com/terbed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-primary-500 hover:underline"
                >
                  github.com/terbed
                </a>
              </div>

              {/* ORCID */}
              <div className="flex items-center space-x-2">
                <svg
                  role="img"
                  aria-label="ORCID"
                  viewBox="0 0 32 32"
                  className="h-6 w-6 text-ink-muted"
                  fill="currentColor"
                >
                  <path d="M16 0c-8.839 0-16 7.161-16 16s7.161 16 16 16c8.839 0 16-7.161 16-16s-7.161-16-16-16zM9.823 5.839c0.704 0 1.265 0.573 1.265 1.26 0 0.688-0.561 1.265-1.265 1.265-0.692-0.004-1.26-0.567-1.26-1.265 0-0.697 0.563-1.26 1.26-1.26zM8.864 9.885h1.923v13.391h-1.923zM13.615 9.885h5.197c4.948 0 7.125 3.541 7.125 6.703 0 3.439-2.687 6.699-7.099 6.699h-5.224zM15.536 11.625v9.927h3.063c4.365 0 5.365-3.312 5.365-4.964 0-2.687-1.713-4.963-5.464-4.963z" />
                </svg>
                <a
                  href="https://orcid.org/0000-0003-3548-4685"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-primary-500 hover:underline"
                >
                  orcid.org/0000-0003-3548-4685
                </a>
              </div>
            </div>
          </div>

          {/* Single Separator Line */}
          <hr className="my-4 border-rule" />
        </div>

        {/* ------------------------ Experience Section ----------------------------------------- */}
        <div className="mt-10">
          <h3 className="resume-section text-left md:ml-20">Experience</h3>
          <div className="relative mt-8">
            {/* Adjust line and dot position */}
            <div className="absolute left-1/4 hidden h-full w-1 bg-primary-500 md:block"></div>

            {/* experience item */}
            {/* Date section for mobile view */}
            <div className="mb-2 block text-gray-500 dark:text-gray-400 md:hidden">
              <span>August 2017 - Present</span>
            </div>
            <div className="mb-8 flex items-start">
              <div className="relative hidden w-1/4 pr-4 text-right md:block">
                <span className="block text-gray-500 dark:text-gray-400">August 2017</span>
                <span className="block text-primary-500">Present</span>
                <div className="absolute right-[-10px] top-1/2 h-2 w-2 bg-primary-500"></div>
              </div>

              <div className="w-full md:w-3/4 md:pl-12">
                <div className="milestone-item relative overflow-hidden">
                  {/* Role and Organization */}
                  <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                    Developer & Researcher – Institute for Computer Science and Control
                  </h4>

                  {/* Location */}
                  <p className="text-primary-500">
                    (HUN-REN SZTAKI) Optical Sensing and Processing Laboratory, Budapest, HUN
                  </p>

                  {/* Compressed Content Info */}
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    During my MSc studies, I began working here part-time on a project to detect
                    subtle skin color changes related to the cardiac cycle using regular cameras,
                    enabling <strong>remote pulse-rate measurement</strong>. This work became the
                    foundation of my MSc thesis. After graduating, I transitioned to a full-time
                    role and joined the <strong>digital holography</strong> project in 2020 – where
                    I am responsible for the AI-related tasks. This project eventually led to the
                    founding of a startup, <strong>HoloDetect</strong>. Learn more at:{' '}
                    <a
                      href="http://holodetect.com"
                      target="_blank"
                      className="text-primary-500 hover:underline"
                    >
                      holodetect.com
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* experience item */}
            {/* Date section for mobile view */}
            <div className="mb-2 block text-gray-500 dark:text-gray-400 md:hidden">
              <span>October 2020 - January 2021</span>
            </div>
            <div className="mb-8 flex items-start">
              <div className="relative hidden w-1/4 pr-4 text-right md:block">
                <span className="block text-gray-500 dark:text-gray-400">October 2020</span>
                <span className="block text-gray-500 dark:text-gray-400">January 2021</span>
                <div className="absolute right-[-10px] top-1/2 h-2 w-2 bg-primary-500"></div>
              </div>

              <div className="w-full md:w-3/4 md:pl-12">
                <div className="milestone-item relative overflow-hidden">
                  {/* Role and Organization */}
                  <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                    Self-Employed AI Consultant – University of Szeged (SZTE)
                  </h4>

                  {/* Content Info */}
                  <p className="text-primary-500">
                    Department of Computer Algorithms and Artificial Intelligence, Szeged, Hungary
                  </p>

                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Involved in a project aimed at improving impaired speech using deep learning
                    tools. The main focus was on leveraging{' '}
                    <strong>Generative Adversarial Networks (GANs)</strong> and exploring{' '}
                    <strong>transformer-based voice conversion models</strong> to enhance the speech
                    quality of dysarthric patients.
                  </p>
                </div>
              </div>
            </div>

            {/* experience item */}
            <div className="mb-2 block text-gray-500 dark:text-gray-400 md:hidden">
              <span>March 2016 - June 2016</span>
            </div>
            <div className="mb-8 flex items-start">
              <div className="relative hidden w-1/4 pr-4 text-right md:block">
                <span className="block text-gray-500 dark:text-gray-400">March 2016</span>
                <span className="block text-gray-500 dark:text-gray-400">June 2016</span>
                <div className="absolute right-[-10px] top-1/2 h-2 w-2 bg-primary-500"></div>
              </div>

              <div className="w-full md:w-3/4 md:pl-12">
                <div className="milestone-item relative overflow-hidden">
                  {/* Role and Organization */}
                  <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                    Research Intern – Turbine
                  </h4>

                  {/* Content Info */}
                  <p className="text-primary-500">
                    <a href="http://turbine.ai" target="_blank" className="hover:underline">
                      turbine.ai
                    </a>
                    , Budapest, Hungary
                  </p>

                  {/* Content Info */}
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Turbine’s goal is to design effective and personalised cancer combination
                    therapies using artificial intelligence and computer simulations. My task was to
                    explore machine learning (deep learning) applications in the field of
                    computational biology.
                  </p>
                </div>
              </div>
            </div>

            {/* experience item */}
            <div className="mb-2 block text-gray-500 dark:text-gray-400 md:hidden">
              <span>September 2015 - January 2020</span>
            </div>
            <div className="mb-8 flex items-start">
              <div className="relative hidden w-1/4 pr-4 text-right md:block">
                <span className="block text-gray-500 dark:text-gray-400">September 2015</span>
                <span className="block text-gray-500 dark:text-gray-400">January 2020</span>
                <div className="absolute right-[-10px] top-1/2 h-2 w-2 bg-primary-500"></div>
              </div>

              <div className="w-full md:w-3/4 md:pl-12">
                <div className="milestone-item relative overflow-hidden">
                  {/* Role and Organization */}
                  <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                    Student Researcher – Institute of Experimental Medicine
                  </h4>

                  {/* Location */}
                  <p className="text-primary-500">
                    (HUN-REN KOKI) Computational Neuroscience Workgroup, Budapest, Hungary
                  </p>

                  {/* Content Info */}
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    I've started working in this role during my BSc studies, focusing on the
                    statistical inference of realistic neuron model parameters through computer
                    simulations and Bayesian statistical tools. This work formed the basis of my BSc
                    thesis and continued for several years after my graduation.{' '}
                    {/*, ultimately
                    culminating in the publication of our research findings in a peer-reviewed
                    paper. */}
                  </p>
                </div>
              </div>
            </div>

            {/* Add more experiences in the same format, sorted by date */}
          </div>
        </div>

        {/* ------------------------------------- Education Section --------------------------------------------*/}
        <div className="mt-12">
          <h3 className="resume-section text-left md:ml-20">Education</h3>
          <div className="relative mt-8">
            {/* Adjust line and dot position */}
            <div className="absolute left-1/4 hidden h-full w-1 bg-primary-500 md:block"></div>

            {/* Education Items */}
            <div className="mb-2 block text-gray-500 dark:text-gray-400 md:hidden">
              <span>January 2025 - Present</span> {/* Date for mobile view */}
            </div>
            <div className="mb-8 flex items-start">
              <div className="relative hidden w-1/4 pr-4 text-right md:block">
                <span className="block text-gray-500 dark:text-gray-400">January 2025</span>
                <span className="block text-primary-500">Present</span>
                <div className="absolute right-[-10px] top-1/2 h-2 w-2 bg-primary-500"></div>
              </div>
              <div className="w-full md:w-3/4 md:pl-12">
                <div className="milestone-item overflow-hidden">
                  {/* Foreground Content */}
                  <div className="relative z-10">
                    <h4 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                      MSc in Financial Engineering
                    </h4>
                    <p className="mb-2 text-primary-500">
                      World Quant University, New Orleans, USA
                    </p>
                    <div className="text-gray-700 dark:text-gray-300">
                      <p>
                        May 2025:{' '}
                        <a
                          href="https://www.credly.com/badges/8711de3f-a53a-4fcd-bde6-d8b48f7cb536/public_url"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-500 hover:underline"
                        >
                          Foundations of Financial Engineering Certificate
                        </a>{' '}
                        earned
                      </p>
                      <p>
                        <span className="font-semibold">Capstone Project:</span> In Progress...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2 block text-gray-500 dark:text-gray-400 md:hidden">
              <span>2017 - 2021</span>
            </div>
            <div className="mb-8 flex items-start">
              <div className="relative hidden w-1/4 pr-4 text-right md:block">
                <span className="block text-gray-500 dark:text-gray-400">2017 – 2021</span>
                <div className="absolute right-[-10px] top-2 h-2 w-2 bg-primary-500"></div>
              </div>
              <div className="w-full md:w-3/4 md:pl-12">
                <div className="milestone-item overflow-hidden">
                  {/* Foreground Content */}
                  <div className="relative z-10">
                    <h4 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                      MSc in Info-Bionics Engineering
                    </h4>
                    <p className="mb-2 text-primary-500">
                      Pázmány Péter Catholic University, Budapest, Hungary
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">Specialization:</span> Bionic Interfaces and
                      Integrated Structures.
                      <br />
                      <span className="font-semibold">Thesis:</span> Remote camera-based pulse
                      estimation using deep learning tools.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2 block text-gray-500 dark:text-gray-400 md:hidden">
              <span>2013 - 2017</span>
            </div>
            <div className="mb-8 flex items-start">
              <div className="relative hidden w-1/4 pr-4 text-right md:block">
                <span className="block text-gray-500 dark:text-gray-400">2013 – 2017</span>
                <div className="absolute right-[-10px] top-2 h-2 w-2 bg-primary-500"></div>
              </div>
              <div className="w-full md:w-3/4 md:pl-12">
                <div className="milestone-item overflow-hidden">
                  {/* Foreground Content */}
                  <div className="relative z-10">
                    <h4 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                      BSc in Physics
                    </h4>
                    <p className="mb-2 text-primary-500">
                      Eötvös Loránd University, Budapest, Hungary
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold ">Specialization:</span> Theoretical Physics.
                      <br />
                      <span className="font-semibold">Thesis:</span> Estimating the biophysical
                      parameters of neurons using computer simulations and probabilistic models.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add more education items in the same format */}
          </div>
        </div>

        {/* ----------------------------------------- Publications -------------------------------------------- */}
        <div className="mt-12">
          {/* Adjust the title to be centered on the timeline */}
          <h3 className="resume-section relative text-left md:ml-20">Publications</h3>
          <div className="relative mt-8">
            {/* Timeline line */}
            <div className="absolute left-1/4 hidden h-full w-1 bg-primary-500 md:block"></div>

            {/* Publication Items */}
            <div className="mb-2 block text-gray-500 dark:text-gray-400 md:hidden">
              <span>May 2026</span>
            </div>
            <div className="mb-8 flex items-start">
              <div className="relative hidden w-1/4 pr-4 text-right md:block">
                <span className="block text-gray-500 dark:text-gray-400">May 2026</span>
                <div className="absolute right-[-10px] top-2 h-2 w-2 bg-primary-500"></div>
              </div>
              <div className="w-full md:w-3/4 md:pl-12">
                <div className="milestone-item">
                  <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                    Automatic multifocusing in digital holographic microscopy
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Terbe, D.; Orzó, L.; Zarándy, Á.
                  </p>
                  <p className="mb-1 text-primary-500">
                    Optics Express 34.10 (2026): 17598. <strong>DOI:</strong>{' '}
                    <a
                      href="https://doi.org/10.1364/OE.586494"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:underline"
                    >
                      https://doi.org/10.1364/OE.586494
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-2 block text-gray-500 dark:text-gray-400 md:hidden">
              <span>January 2024</span>
            </div>
            <div className="mb-8 flex items-start">
              <div className="relative hidden w-1/4 pr-4 text-right md:block">
                <span className="block text-gray-500 dark:text-gray-400">January 2024</span>
                <div className="absolute right-[-10px] top-2 h-2 w-2 bg-primary-500"></div>
              </div>
              <div className="w-full md:w-3/4 md:pl-12">
                <div className="milestone-item relative overflow-hidden">
                  {/* Background Noise Image */}
                  <Image
                    src="/static/cv/noisy-texture-black.png" // Path to your noise image
                    alt="Noise Background"
                    layout="fill"
                    width={0}
                    height={0}
                    className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-5"
                  />

                  {/* Foreground Content */}
                  <div className="relative z-10">
                    <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                      Hologram Noise Model for Data Augmentation and Deep Learning
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Terbe, D.; Orzó, L.; Bicsák, B.; Zarándy, Á.
                    </p>
                    <p className="mb-1 text-primary-500">
                      Sensors 2024, 24, 948. <strong>DOI:</strong>{' '}
                      <a
                        href="https://doi.org/10.3390/s24030948"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:underline"
                      >
                        https://doi.org/10.3390/s24030948
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2 block text-gray-500 dark:text-gray-400 md:hidden">
              <span>October 2022</span>
            </div>
            <div className="mb-8 flex items-start">
              <div className="relative hidden w-1/4 pr-4 text-right md:block">
                <span className="block text-gray-500 dark:text-gray-400">October 2022</span>
                <div className="absolute right-[-10px] top-2 h-2 w-2 bg-primary-500"></div>
              </div>
              <div className="w-full md:w-3/4 md:pl-12">
                <div className="milestone-item">
                  <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                    Classification of Holograms with 3D-CNN
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Terbe, D.; Orzó, L.; Zarándy, Á.
                  </p>
                  <p className="mb-1 text-primary-500">
                    Sensors 2022, 22, 8366. <strong>DOI:</strong>{' '}
                    <a
                      href="https://doi.org/10.3390/s22218366"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:underline"
                    >
                      https://doi.org/10.3390/s22218366
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-2 block text-gray-500 dark:text-gray-400 md:hidden">
              <span>October 2021</span>
            </div>
            <div className="mb-8 flex items-start">
              <div className="relative hidden w-1/4 pr-4 text-right md:block">
                <span className="block text-gray-500 dark:text-gray-400">October 2021</span>
                <div className="absolute right-[-10px] top-2 h-2 w-2 bg-primary-500"></div>
              </div>
              <div className="w-full md:w-3/4 md:pl-12">
                <div className="milestone-item">
                  <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                    Deep-learning-based bright-field image generation from a single hologram using
                    an unpaired dataset
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Terbe, D.; László, O.; Zarándy, Á.
                  </p>
                  <p className="mb-1 text-primary-500">
                    Optics Letters 46.22 (2021): 5567-5570. <strong>DOI:</strong>{' '}
                    <a
                      href="https://doi.org/10.1364/OL.440900"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:underline"
                    >
                      https://doi.org/10.1364/OL.440900
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-2 block text-gray-500 dark:text-gray-400 md:hidden">
              <span>July 2021</span>
            </div>
            <div className="mb-8 flex items-start">
              <div className="relative hidden w-1/4 pr-4 text-right md:block">
                <span className="block text-gray-500 dark:text-gray-400">July 2021</span>
                <div className="absolute right-[-10px] top-2 h-2 w-2 bg-primary-500"></div>
              </div>
              <div className="w-full md:w-3/4 md:pl-12">
                <div className="milestone-item">
                  <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                    Continuous Camera-Based Premature-Infant Monitoring Algorithms for NICU
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Nagy, Á.; Földesy, P.; Jánoki, I.; Terbe, D.; Siket, M.; Szabó, M.; Varga, J.;
                    Zarándy, Á.
                  </p>
                  <p className="mb-1 text-primary-500">
                    Applied Sciences. 2021; 11(16):7215. <strong>DOI:</strong>{' '}
                    <a
                      href="https://doi.org/10.3390/app11167215"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:underline"
                    >
                      https://doi.org/10.3390/app11167215
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Add more publication items similarly */}
          </div>
        </div>

        {/* -------------------------------------- Conferences Section ------------------------------------------ */}
        <h3 className="resume-section mt-12 text-left md:ml-20">Conferences</h3>
        <div className="relative mt-8">
          <div className="absolute left-1/4 hidden h-full w-1 bg-primary-500 md:block"></div>

          {/* Conference Items */}
          <div className="mb-2 block text-gray-500 dark:text-gray-400 md:hidden">
            <span>December 2022</span>
          </div>
          <div className="mb-8 flex items-start">
            <div className="relative hidden w-1/4 pr-4 text-right md:block">
              <span className="block text-gray-500 dark:text-gray-400">December 2022</span>
              <div className="absolute right-[-10px] top-2 h-2 w-2 bg-primary-500"></div>
            </div>

            <div className="w-full md:w-3/4 md:pl-12">
              <div className="milestone-item relative overflow-hidden">
                {/* Presentation Title */}
                <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                  Reliable estimation of neuronal biophysical parameters from electrophysiological
                  recordings
                </h4>

                {/* Authors */}
                <p className="text-gray-600 dark:text-gray-300">
                  D. Terbe, M. Szoboszlay, Z. Nusser, Sz. Káli
                </p>

                {/* Conference Name */}
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  <span className="text-primary-500">
                    2022 Society for Neuroscience (SfN) Conference, San Diego, CA, USA
                  </span>
                </p>
                <p className="text-primary-500">
                  <strong>Link: </strong>
                  <a
                    href="https://www.dropbox.com/scl/fi/hiyrkns48ke4v36z8t769/SfN_2022_Kali_v2.mp4?rlkey=axt4y9vg67fr7nc35ljw5bvsh&st=thqeahyv&dl=0"
                    target="_blank"
                    className="hover:underline"
                  >
                    https://bit.ly/sfn-presentation
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="mb-2 block text-gray-500 dark:text-gray-400 md:hidden">
            <span>January 2022</span>
          </div>
          <div className="mb-8 flex items-start">
            <div className="relative hidden w-1/4 pr-4 text-right md:block">
              <span className="block text-gray-500 dark:text-gray-400">January 2022</span>
              <div className="absolute right-[-10px] top-2 h-2 w-2 bg-primary-500"></div>
            </div>

            <div className="w-full md:w-3/4 md:pl-12">
              <div className="milestone-item relative overflow-hidden">
                {/* Presentation Title */}
                <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                  The application of voice conversion methods to improve the speech quality of
                  dysarthric patients
                </h4>

                {/* Authors */}
                <p className="text-gray-600 dark:text-gray-300">D. Terbe, L. Tóth, L. Ivaskó</p>

                {/* Conference Name and DOI */}
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  <span className="text-primary-500">
                    XVIII. Hungarian Conference on Computational Linguistics, Szeged, January 27-28,
                    2022
                  </span>{' '}
                  <span className="mt-1 text-primary-500">
                    <strong>Link:</strong>{' '}
                    <a
                      href="https://acta.bibl.u-szeged.hu/75872/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:underline"
                    >
                      https://acta.bibl.u-szeged.hu/75872/
                    </a>
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mb-2 block text-gray-500 dark:text-gray-400 md:hidden">
            <span>October 2020</span>
          </div>
          <div className="mb-8 flex items-start">
            <div className="relative hidden w-1/4 pr-4 text-right md:block">
              <span className="block text-gray-500 dark:text-gray-400">October 2020</span>
              <div className="absolute right-[-10px] top-2 h-2 w-2 bg-primary-500"></div>
            </div>
            <div className="w-full md:w-3/4 md:pl-12">
              <div className="milestone-item relative overflow-hidden">
                {/* Presentation Title */}
                <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                  Multi-Level Optimization for Enabling Life Critical Visual Inspections of Infants
                  in Resource Limited Environment
                </h4>

                {/* Authors */}
                <p className="text-gray-600 dark:text-gray-300">
                  Á. Zarándy, P. Földesy, Á. Nagy, I. Jánoki, D. Terbe, M. Siket, M. Szabó, and J.
                  Varga
                </p>

                {/* Conference Name and DOI */}
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  <span className="text-primary-500">
                    2020 IEEE International Symposium on Circuits and Systems (ISCAS), Seville,
                    Spain, pp. 1-5
                  </span>{' '}
                  <strong className="text-primary-500">DOI:</strong>{' '}
                  <a
                    href="https://doi.org/10.1109/ISCAS45731.2020.9181040"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:underline"
                  >
                    10.1109/ISCAS45731.2020.9181040
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Conference Item */}
          <div className="mb-2 block text-gray-500 dark:text-gray-400 md:hidden">
            <span>January 2019</span>
          </div>
          <div className="mb-8 flex items-start">
            <div className="relative hidden w-1/4 pr-4 text-right md:block">
              <span className="block text-gray-500 dark:text-gray-400">January 2019</span>
              <div className="absolute right-[-10px] top-2 h-2 w-2 bg-primary-500"></div>
            </div>

            <div className="w-full md:w-3/4 md:pl-12">
              <div className="milestone-item relative overflow-hidden">
                {/* Presentation Title */}
                <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                  Remote camera based heart rate estimation
                </h4>

                {/* Authors */}
                <p className="text-gray-600 dark:text-gray-300">D. Terbe, Á. Zarándy</p>

                {/* Conference Name and Link */}
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  <span className="text-primary-500">
                    Hungarian Association for Image Processing and Pattern Recognition, 12th
                    National Conference (KÉPAF 2019), Debrecen, January 28-31, 2019
                  </span>
                </p>
                <p className="mt-1 text-primary-500">
                  <strong>Link:</strong>{' '}
                  <a
                    href="https://eprints.sztaki.hu/9703/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:underline"
                  >
                    https://eprints.sztaki.hu/9703/
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Conference Item */}
          <div className="mb-2 block text-gray-500 dark:text-gray-400 md:hidden">
            <span>August 2018</span>
          </div>
          <div className="mb-8 flex items-start">
            <div className="relative hidden w-1/4 pr-4 text-right md:block">
              <span className="block text-gray-500 dark:text-gray-400">August 2018</span>
              <div className="absolute right-[-10px] top-2 h-2 w-2 bg-primary-500"></div>
            </div>

            <div className="w-full md:w-3/4 md:pl-12">
              <div className="milestone-item relative overflow-hidden">
                {/* Presentation Title */}
                <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                  Remote camera based measurement of human vital signs
                </h4>

                {/* Authors */}
                <p className="text-gray-600 dark:text-gray-300">D. Terbe, Á. Zarándy</p>

                {/* Conference Name and Additional Info */}
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  <span className="text-primary-500">
                    The 16th International Workshop on Cellular Nanoscale Networks and their
                    Applications, Budapest, Hungary, August 28-30, 2018, pp. 1-5
                  </span>
                </p>
                <p className="mt-1 text-primary-500">
                  <strong>Link:</strong>{' '}
                  <a
                    href="https://ieeexplore.ieee.org/document/8470476"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:underline"
                  >
                    https://ieeexplore.ieee.org/document/8470476
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Add more conference items similarly */}
        </div>

        {/* -------------------------------------- Skills Section ------------------------------------------ */}
        <div className="mt-12">
          <h3 className="resume-section ml-8">Skills</h3>

          {/* Bars are compact enough that all three groups sit in one plain row. */}
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SkillGroup title={researchGroup.title} skills={researchGroup.skills} />
            <SkillGroup title={modelingGroup.title} skills={modelingGroup.skills} />
            <SkillGroup title={systemsGroup.title} skills={systemsGroup.skills} />
          </div>
        </div>

        {/* Resume Footer Link */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <svg
              role="img"
              viewBox="-1 0 19 19"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-ink-muted"
              fill="currentColor"
            >
              <path d="M16.5 9.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8zm-2.97.006a5.03 5.03 0 1 0-5.03 5.03 5.03 5.03 0 0 0 5.03-5.03zm-7.383-.4H4.289a4.237 4.237 0 0 1 2.565-3.498q.1-.042.2-.079a7.702 7.702 0 0 0-.907 3.577zm0 .8a7.7 7.7 0 0 0 .908 3.577q-.102-.037-.201-.079a4.225 4.225 0 0 1-2.565-3.498zm.8-.8a9.04 9.04 0 0 1 .163-1.402 6.164 6.164 0 0 1 .445-1.415c.289-.615.66-1.013.945-1.013.285 0 .656.398.945 1.013a6.18 6.18 0 0 1 .445 1.415 9.078 9.078 0 0 1 .163 1.402zm3.106.8a9.073 9.073 0 0 1-.163 1.402 6.187 6.187 0 0 1-.445 1.415c-.289.616-.66 1.013-.945 1.013-.285 0-.656-.397-.945-1.013a6.172 6.172 0 0 1-.445-1.415 9.036 9.036 0 0 1-.163-1.402zm1.438-3.391a4.211 4.211 0 0 1 1.22 2.591h-1.858a7.698 7.698 0 0 0-.908-3.577q.102.037.201.08a4.208 4.208 0 0 1 1.345.906zm-.638 3.391h1.858a4.238 4.238 0 0 1-2.565 3.498q-.1.043-.2.08a7.697 7.697 0 0 0 .907-3.578z" />
            </svg>
            <a
              href="https://terbe.dev/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-primary-500 hover:underline"
            >
              terbe.dev/resume
            </a>
          </div>
        </div>
      </div>

      {/* Modal for Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center border border-rule bg-paper p-8">
            <div className="loader mb-4 h-16 w-16 animate-spin rounded-full border-t-4 border-primary-500"></div>
            <p className="text-lg text-gray-700 dark:text-gray-300">Generating PDF...</p>
          </div>
        </div>
      )}

      {/* Download button */}
      <button
        onClick={generatePDF}
        className="mt-8 border border-primary-500 px-4 py-2 font-mono text-sm text-primary-500 transition-colors hover:bg-primary-500/10 disabled:opacity-50"
        disabled={isLoading} // Disable the button while loading
      >
        {isLoading ? 'Generating PDF...' : 'Download PDF'}
      </button>
    </div>
  )
}

export default ResumePage
