'use client'

import React, { useRef } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

const ResumePage = () => {
  // Create a reference for the resume content
  const resumeRef = useRef(null)

  // Function to generate the PDF
  const generatePDF = async () => {
    const element = resumeRef.current
    if (!element) {
      console.error('Resume content is not available for PDF generation.')
      return
    }
    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')

    // Add image of the resume content to the PDF
    const imgWidth = 210 // A4 page width in mm
    const pageHeight = 297 // A4 page height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    // Add multiple pages if necessary
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Save the PDF
    pdf.save('DanielTerbeCV.pdf')
  }

  return (
    <div className="container mx-auto py-10">
      <div ref={resumeRef} className="rounded-md bg-white p-8 shadow-lg dark:bg-gray-800">
        {/* Header Section */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Name, Title, and Contact Section */}
          <div className="flex flex-col items-center space-y-4 pb-8 pt-6 md:flex-row md:justify-between md:space-y-0">
            {/* Left: Name and Title */}
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                Dániel Terbe
              </h1>
              <p className="mt-2 text-2xl text-gray-700 dark:text-gray-300">
                AI Researcher & Developer
              </p>
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
                  className="text-black dark:text-white"
                  viewBox="0 0 1920 1920"
                >
                  <path d="M1920 428.266v1189.54l-464.16-580.146-88.203 70.585 468.679 585.904H83.684l468.679-585.904-88.202-70.585L0 1617.805V428.265l959.944 832.441L1920 428.266ZM1919.932 226v52.627l-959.943 832.44L.045 278.628V226h1919.887Z" />
                </svg>
                <a
                  href="mailto:terbed@gmail.com"
                  className="textbf text-primary-500 hover:underline dark:text-primary-400"
                >
                  terbed@gmail.com
                </a>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center space-x-2">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-black dark:text-white"
                  fill="currentColor"
                >
                  <title>LinkedIn</title>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <a
                  href="https://www.linkedin.com/in/terbed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="textbf text-primary-500 hover:underline dark:text-primary-400"
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
                  className="h-6 w-6 text-black dark:text-white"
                  fill="currentColor"
                >
                  <title>GitHub</title>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <a
                  href="https://github.com/terbed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="textbf text-primary-500 hover:underline dark:text-primary-400"
                >
                  github.com/terbed
                </a>
              </div>
            </div>
          </div>

          {/* Single Separator Line */}
          <hr className="my-4 border-gray-300 dark:border-gray-700" />
        </div>

        {/* ------------------------ Experience Section ----------------------------------------- */}
        <div className="mt-10">
          <h3 className="ml-20 text-3xl font-bold text-primary-500 dark:text-primary-400">
            Experience
          </h3>
          <div className="relative mt-8">
            {/* Adjust line and dot position */}
            <div className="absolute left-1/4 h-full w-1 bg-primary-500"></div>

            {/* Experience Items */}
            <div className="mb-8 flex items-start">
              <div className="relative w-1/4 pr-4 text-right">
                <span className="block text-gray-500 dark:text-gray-400">August 2022</span>
                <span className="block text-gray-500 dark:text-gray-400">January 2022</span>
                <div className="absolute right-[-10px] top-1/2 h-4 w-4 rounded-full bg-primary-500"></div>
              </div>
              <div className="w-3/4 pl-12">
                <div className="transform rounded-md bg-gray-50 p-6 shadow-md transition-transform duration-300 hover:scale-105 dark:bg-gray-700">
                  <h4 className="text-lg font-bold">👅 Tongue Scanner Project</h4>
                  <p className="italic">Role: Self-Employed AI Consultant & Developer</p>
                  <p>
                    A pioneering AI-based tongue analysis tool for Traditional Chinese Medicine
                    (TCM). Enhanced diagnostic processes for TCM practitioners.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 flex items-start">
              <div className="relative w-1/4 pr-4 text-right">
                <span className="block text-gray-500 dark:text-gray-400">June 2022</span>
                <span className="block text-gray-500 dark:text-gray-400">September 2022</span>
                <div className="absolute right-[-10px] top-1/2 h-4 w-4 rounded-full bg-primary-500"></div>
              </div>
              <div className="w-3/4 pl-12">
                <div className="transform rounded-md bg-gray-50 p-6 shadow-md transition-transform duration-300 hover:scale-105 dark:bg-gray-700">
                  <h4 className="text-lg font-bold">📈 FinTech Startup</h4>
                  <p className="italic">Role: Self-Employed Data Scientist</p>
                  <p>
                    Applied ML and deep learning techniques to financial analysis in the
                    cryptocurrency sector.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 flex items-start">
              <div className="relative w-1/4 pr-4 text-right">
                <span className="block text-gray-500 dark:text-gray-400">June 2022</span>
                <span className="block text-gray-500 dark:text-gray-400">September 2022</span>
                <div className="absolute right-[-10px] top-1/2 h-4 w-4 rounded-full bg-primary-500"></div>
              </div>
              <div className="w-3/4 pl-12">
                <div className="transform rounded-md bg-gray-50 p-6 shadow-md transition-transform duration-300 hover:scale-105 dark:bg-gray-700">
                  <h4 className="text-lg font-bold">📈 FinTech Startup</h4>
                  <p className="italic">Role: Self-Employed Data Scientist</p>
                  <p>
                    Applied ML and deep learning techniques to financial analysis in the
                    cryptocurrency sector.
                  </p>
                </div>
              </div>
            </div>

            {/* Add more experiences in the same format, sorted by date */}
          </div>
        </div>

        {/* ------------------------------------- Education Section --------------------------------------------*/}
        <div className="mt-12">
          <h3 className="ml-20 text-3xl font-bold text-primary-500 dark:text-primary-400">
            Education
          </h3>
          <div className="relative mt-8">
            {/* Adjust line and dot position */}
            <div className="absolute left-1/4 h-full w-1 bg-primary-500"></div>

            {/* Education Items */}
            <div className="mb-8 flex items-start">
              <div className="relative w-1/4 pr-4 text-right">
                <span className="block text-gray-500 dark:text-gray-400">2017 – 2020</span>
                <div className="absolute right-[-10px] top-2 h-4 w-4 rounded-full bg-primary-500"></div>
              </div>
              <div className="relative w-3/4 pl-12">
                <div className="milestone-item overflow-hidden">
                  {/* Background Logo */}
                  <img
                    src="/static/cv/ppk.svg"
                    alt="Pázmány Péter Catholic University Logo"
                    className="absolute -top-10 right-0 h-auto w-32 object-contain opacity-10"
                  />

                  {/* Foreground Content */}
                  <div className="relative z-10">
                    <h4 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                      MSc in Info-Bionics Engineering
                    </h4>
                    <p className="mb-2 text-primary-500 dark:text-primary-400">
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

            <div className="mb-8 flex items-start">
              <div className="relative w-1/4 pr-4 text-right">
                <span className="block text-gray-500 dark:text-gray-400">2013 – 2017</span>
                <div className="absolute right-[-10px] top-2 h-4 w-4 rounded-full bg-primary-500"></div>
              </div>
              <div className="relative w-3/4 pl-12">
                <div className="milestone-item overflow-hidden">
                  {/* Background Logo */}
                  <img
                    src="/static/cv/elte.svg"
                    alt="Eötvös Loránd University Logo"
                    className="absolute -right-14 -top-2 h-52 w-auto object-contain opacity-10 dark:opacity-5"
                  />

                  {/* Foreground Content */}
                  <div className="relative z-10">
                    <h4 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                      BSc in Physics
                    </h4>
                    <p className="mb-2 text-primary-500 dark:text-primary-400">
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
          <h3 className="relative ml-20 text-3xl font-bold text-primary-500 dark:text-primary-400">
            Publications
          </h3>
          <div className="relative mt-8">
            {/* Timeline line */}
            <div className="absolute left-1/4 h-full w-1 bg-primary-500"></div>

            {/* Publication Items */}
            <div className="mb-8 flex items-start">
              <div className="relative w-1/4 pr-4 text-right">
                <span className="block text-gray-500 dark:text-gray-400">January 2024</span>
                <div className="absolute right-[-10px] top-2 h-4 w-4 rounded-full bg-primary-500"></div>
              </div>
              <div className="w-3/4 pl-12">
                <div className="milestone-item relative overflow-hidden">
                  {/* Background Noise Image */}
                  <img
                    src="/static/cv/noisy-texture-black.png" // Path to your noise image
                    alt="Noise Background"
                    className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-10"
                  />

                  {/* Foreground Content */}
                  <div className="relative z-10">
                    <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                      Hologram Noise Model for Data Augmentation and Deep Learning
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Terbe, D.; Orzó, L.; Bicsák, B.; Zarándy, Á.
                    </p>
                    <p className="mb-1 text-primary-500 dark:text-primary-400">
                      Sensors 2024, 24, 948. <strong>DOI:</strong>{' '}
                      <a
                        href="https://doi.org/10.3390/s24030948"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:underline dark:text-primary-400"
                      >
                        https://doi.org/10.3390/s24030948
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8 flex items-start">
              <div className="relative w-1/4 pr-4 text-right">
                <span className="block text-gray-500 dark:text-gray-400">October 2022</span>
                <div className="absolute right-[-10px] top-2 h-4 w-4 rounded-full bg-primary-500"></div>
              </div>
              <div className="w-3/4 pl-12">
                <div className="milestone-item">
                  <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                    Classification of Holograms with 3D-CNN
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Terbe, D.; Orzó, L.; Zarándy, Á.
                  </p>
                  <p className="mb-1 text-primary-500 dark:text-primary-400">
                    Sensors 2022, 22, 8366. <strong>DOI:</strong>{' '}
                    <a
                      href="https://doi.org/10.3390/s22218366"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:underline dark:text-primary-400"
                    >
                      https://doi.org/10.3390/s22218366
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 flex items-start">
              <div className="relative w-1/4 pr-4 text-right">
                <span className="block text-gray-500 dark:text-gray-400">October 2021</span>
                <div className="absolute right-[-10px] top-2 h-4 w-4 rounded-full bg-primary-500"></div>
              </div>
              <div className="w-3/4 pl-12">
                <div className="milestone-item">
                  <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                    Deep-learning-based bright-field image generation from a single hologram using
                    an unpaired dataset
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Terbe, D.; László, O.; Zarándy, Á.
                  </p>
                  <p className="mb-1 text-primary-500 dark:text-primary-400">
                    Optics Letters 46.22 (2021): 5567-5570. <strong>DOI:</strong>{' '}
                    <a
                      href="https://doi.org/10.1364/OL.440900"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:underline dark:text-primary-400"
                    >
                      https://doi.org/10.1364/OL.440900
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 flex items-start">
              <div className="relative w-1/4 pr-4 text-right">
                <span className="block text-gray-500 dark:text-gray-400">July 2021</span>
                <div className="absolute right-[-10px] top-2 h-4 w-4 rounded-full bg-primary-500"></div>
              </div>
              <div className="w-3/4 pl-12">
                <div className="milestone-item">
                  <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                    Continuous Camera-Based Premature-Infant Monitoring Algorithms for NICU
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Nagy, Á.; Földesy, P.; Jánoki, I.; Terbe, D.; Siket, M.; Szabó, M.; Varga, J.;
                    Zarándy, Á.
                  </p>
                  <p className="mb-1 text-primary-500 dark:text-primary-400">
                    Applied Sciences. 2021; 11(16):7215. <strong>DOI:</strong>{' '}
                    <a
                      href="https://doi.org/10.3390/app11167215"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:underline dark:text-primary-400"
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
        <h3 className="ml-20 mt-12 text-3xl font-bold text-primary-500 dark:text-primary-400">
          Conferences
        </h3>
        <div className="relative mt-8">
          <div className="absolute left-1/4 h-full w-1 bg-primary-500"></div>

          {/* Conference Items */}
          <div className="mb-8 flex items-start">
            <div className="relative w-1/4 pr-4 text-right">
              <span className="block text-gray-500 dark:text-gray-400">December 2022</span>
              <div className="absolute right-[-10px] top-2 h-4 w-4 rounded-full bg-primary-500"></div>
            </div>

            <div className="w-3/4 pl-12">
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
                  <span className="italic text-primary-500 dark:text-primary-400">
                    2022 Society for Neuroscience (SfN) Conference, San Diego, CA, USA
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 flex items-start">
            <div className="relative w-1/4 pr-4 text-right">
              <span className="block text-gray-500 dark:text-gray-400">January 2022</span>
              <div className="absolute right-[-10px] top-2 h-4 w-4 rounded-full bg-primary-500"></div>
            </div>

            <div className="w-3/4 pl-12">
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
                  <span className="italic text-primary-500 dark:text-primary-400">
                    XVIII. Hungarian Conference on Computational Linguistics, Szeged, January 27-28,
                    2022
                  </span>{' '}
                  <span className="mt-1 text-primary-500 dark:text-primary-400">
                    <strong>Link:</strong>{' '}
                    <a
                      href="https://acta.bibl.u-szeged.hu/75872/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:underline dark:text-primary-400"
                    >
                      https://acta.bibl.u-szeged.hu/75872/
                    </a>
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 flex items-start">
            <div className="relative w-1/4 pr-4 text-right">
              <span className="block text-gray-500 dark:text-gray-400">October 2020</span>
              <div className="absolute right-[-10px] top-2 h-4 w-4 rounded-full bg-primary-500"></div>
            </div>
            <div className="w-3/4 pl-12">
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
                  <span className="italic text-primary-500 dark:text-primary-400">
                    2020 IEEE International Symposium on Circuits and Systems (ISCAS), Seville,
                    Spain, pp. 1-5
                  </span>{' '}
                  <strong className="text-primary-500 dark:text-primary-400">DOI:</strong>{' '}
                  <a
                    href="https://doi.org/10.1109/ISCAS45731.2020.9181040"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:underline dark:text-primary-400"
                  >
                    10.1109/ISCAS45731.2020.9181040
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Conference Item */}
          <div className="mb-8 flex items-start">
            <div className="relative w-1/4 pr-4 text-right">
              <span className="block text-gray-500 dark:text-gray-400">January 2019</span>
              <div className="absolute right-[-10px] top-2 h-4 w-4 rounded-full bg-primary-500"></div>
            </div>

            <div className="w-3/4 pl-12">
              <div className="milestone-item relative overflow-hidden">
                {/* Presentation Title */}
                <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                  Remote camera based heart rate estimation
                </h4>

                {/* Authors */}
                <p className="text-gray-600 dark:text-gray-300">D. Terbe, Á. Zarándy</p>

                {/* Conference Name and Link */}
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  <span className="italic text-primary-500 dark:text-primary-400">
                    Hungarian Association for Image Processing and Pattern Recognition, 12th
                    National Conference (KÉPAF 2019), Debrecen, January 28-31, 2019
                  </span>
                </p>
                <p className="mt-1 text-primary-500 dark:text-primary-400">
                  <strong>Link:</strong>{' '}
                  <a
                    href="https://eprints.sztaki.hu/9703/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:underline dark:text-primary-400"
                  >
                    https://eprints.sztaki.hu/9703/
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Conference Item */}
          <div className="mb-8 flex items-start">
            <div className="relative w-1/4 pr-4 text-right">
              <span className="block text-gray-500 dark:text-gray-400">August 2018</span>
              <div className="absolute right-[-10px] top-2 h-4 w-4 rounded-full bg-primary-500"></div>
            </div>

            <div className="w-3/4 pl-12">
              <div className="milestone-item relative overflow-hidden">
                {/* Presentation Title */}
                <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                  Remote camera based measurement of human vital signs
                </h4>

                {/* Authors */}
                <p className="text-gray-600 dark:text-gray-300">D. Terbe, Á. Zarándy</p>

                {/* Conference Name and Additional Info */}
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  <span className="italic text-primary-500 dark:text-primary-400">
                    The 16th International Workshop on Cellular Nanoscale Networks and their
                    Applications, Budapest, Hungary, August 28-30, 2018, pp. 1-5
                  </span>
                </p>
                <p className="mt-1 text-primary-500 dark:text-primary-400">
                  <strong>Link:</strong>{' '}
                  <a
                    href="https://ieeexplore.ieee.org/document/8470476"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:underline dark:text-primary-400"
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
          <h3 className="ml-20 text-3xl font-bold text-primary-500 dark:text-primary-400">
            Skills
          </h3>

          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {/* Skill 1 */}
            <div className="flex transform flex-col items-center transition-transform duration-300 ease-in-out hover:scale-110">
              <svg className="h-24 w-24">
                <circle cx="50%" cy="50%" r="40" stroke="gray" strokeWidth="5" fill="none"></circle>
                <circle
                  cx="50%"
                  cy="50%"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray="251"
                  strokeDashoffset="20"
                  fill="none"
                  className="text-primary-500"
                ></circle>
              </svg>
              <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Python</p>
              <p className="font-bold text-primary-500">90%</p>
            </div>

            {/* Skill 2 */}
            <div className="flex transform flex-col items-center transition-transform duration-300 ease-in-out hover:scale-110">
              <svg className="h-24 w-24">
                <circle cx="50%" cy="50%" r="40" stroke="gray" strokeWidth="5" fill="none"></circle>
                <circle
                  cx="50%"
                  cy="50%"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray="251"
                  strokeDashoffset="80"
                  fill="none"
                  className="text-primary-500"
                ></circle>
              </svg>
              <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">C++</p>
              <p className="font-bold text-primary-500">60%</p>
            </div>

            {/* Skill 3 */}
            <div className="flex transform flex-col items-center transition-transform duration-300 ease-in-out hover:scale-110">
              <svg className="h-24 w-24">
                <circle cx="50%" cy="50%" r="40" stroke="gray" strokeWidth="5" fill="none"></circle>
                <circle
                  cx="50%"
                  cy="50%"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray="251"
                  strokeDashoffset="20"
                  fill="none"
                  className="text-primary-500"
                ></circle>
              </svg>
              <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                Deep Learning
              </p>
              <p className="font-bold text-primary-500">90%</p>
            </div>

            {/* Skill 7 */}
            <div className="flex transform flex-col items-center transition-transform duration-300 ease-in-out hover:scale-110">
              <svg className="h-24 w-24">
                <circle cx="50%" cy="50%" r="40" stroke="gray" strokeWidth="5" fill="none"></circle>
                <circle
                  cx="50%"
                  cy="50%"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray="251"
                  strokeDashoffset="20"
                  fill="none"
                  className="text-primary-500"
                ></circle>
              </svg>
              <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">PyTorch</p>
              <p className="font-bold text-primary-500">90%</p>
            </div>

            {/* Skill 4 */}
            <div className="flex transform flex-col items-center transition-transform duration-300 ease-in-out hover:scale-110">
              <svg className="h-24 w-24">
                <circle cx="50%" cy="50%" r="40" stroke="gray" strokeWidth="5" fill="none"></circle>
                <circle
                  cx="50%"
                  cy="50%"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray="251"
                  strokeDashoffset="230"
                  fill="none"
                  className="text-primary-500"
                ></circle>
              </svg>
              <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                Frontend
              </p>
              <p className="font-bold text-primary-500">5%</p>
            </div>

            {/* Skill 5 */}
            <div className="flex transform flex-col items-center transition-transform duration-300 ease-in-out hover:scale-110">
              <svg className="h-24 w-24">
                <circle cx="50%" cy="50%" r="40" stroke="gray" strokeWidth="5" fill="none"></circle>
                <circle
                  cx="50%"
                  cy="50%"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray="251"
                  strokeDashoffset="50"
                  fill="none"
                  className="text-primary-500"
                ></circle>
              </svg>
              <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">MLOps</p>
              <p className="font-bold text-primary-500">70%</p>
            </div>

            {/* Skill 6 */}
            <div className="flex transform flex-col items-center transition-transform duration-300 ease-in-out hover:scale-110">
              <svg className="h-24 w-24">
                <circle cx="50%" cy="50%" r="40" stroke="gray" strokeWidth="5" fill="none"></circle>
                <circle
                  cx="50%"
                  cy="50%"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray="251"
                  strokeDashoffset="100"
                  fill="none"
                  className="text-primary-500"
                ></circle>
              </svg>
              <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                Financial ML
              </p>
              <p className="font-bold text-primary-500">65%</p>
            </div>

            {/* More skills */}
          </div>
        </div>
      </div>
      {/* Download button */}
      <button
        onClick={generatePDF}
        className="mt-8 transform rounded-md bg-primary-500 px-4 py-2 font-semibold text-white shadow-md transition-transform hover:scale-105 hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        Download PDF
      </button>
    </div>
  )
}

export default ResumePage
