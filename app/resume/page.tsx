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
      {/*<h1 className="mb-6 text-4xl font-bold dark:text-white">My Resume</h1>*/}

      <div ref={resumeRef} className="rounded-md bg-white p-8 shadow-lg dark:bg-gray-800">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Name, Title, and Contact Section */}
          <div className="flex items-start justify-between pb-8 pt-6 md:space-y-5">
            {/* Left: Name and Title */}
            <div>
              <h1 className="font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
                Dániel Terbe
              </h1>
              <p className="text-2xl text-gray-700 dark:text-gray-300">AI Researcher & Developer</p>
            </div>

            {/* Right: Contact Information */}
            <div className="text-right">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                Contact: <br />
                <a
                  href="mailto:terbed@gmail.com"
                  className="text-primary-500 hover:underline dark:text-primary-400"
                >
                  terbed@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0"></div>
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

        {/* Education Section */}
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
              <div className="w-3/4 pl-12">
                <div className="milestone-item">
                  <h4 className="text-lg font-bold">
                    MSc. Info-Bionics Engineering – Pázmány Péter Catholic University
                  </h4>
                  <p>
                    Specialization: Bionic Interfaces and Integrated Structures. <br />
                    Thesis: Remote camera-based pulse estimation using deep learning tools.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 flex items-start">
              <div className="relative w-1/4 pr-4 text-right">
                <span className="block text-gray-500 dark:text-gray-400">2013 – 2017</span>
                <div className="absolute right-[-10px] top-2 h-4 w-4 rounded-full bg-primary-500"></div>
              </div>
              <div className="w-3/4 pl-12">
                <div className="milestone-item">
                  <h4 className="text-lg font-bold">
                    BSc. Physics – Eötvös Loránd University, Budapest
                  </h4>
                  <p>
                    Specialization: Theoretical Physics. <br />
                    Thesis: Statistical inference of biophysical neuron model parameters.
                  </p>
                </div>
              </div>
            </div>

            {/* Add more education items in the same format */}
          </div>
        </div>
        {/* Publications */}
        <div className="mt-12">
          {/* Adjust the title to be centered on the timeline */}
          <h3 className="relative ml-20 text-3xl font-bold text-primary-500 dark:text-primary-400">
            Publications
          </h3>
          <div className="relative mt-8">
            {/* Adjust line and dot position */}
            <div className="absolute left-1/4 h-full w-1 bg-primary-500"></div>

            {/* Publication Items */}
            <div className="mb-8 flex items-start">
              <div className="relative w-1/4 pr-4 text-right">
                <span className="block text-gray-500 dark:text-gray-400">2024</span>
                <div className="absolute right-[-10px] top-2 h-4 w-4 rounded-full bg-primary-500"></div>
              </div>
              <div className="w-3/4 pl-12">
                <div className="milestone-item">
                  <h4 className="text-lg font-bold">
                    Terbe, D.; Orzó, L.; Bicsák, B.; Zarándy, Á.
                  </h4>
                  <p>
                    <strong>Hologram Noise Model for Data Augmentation and Deep Learning.</strong>{' '}
                    Sensors 2024, 24, 948.{' '}
                    <a
                      href="https://doi.org/10.3390/s24030948"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:underline"
                    >
                      Read Here
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 flex items-start">
              <div className="relative w-1/4 pr-4 text-right">
                <span className="block text-gray-500 dark:text-gray-400">2022</span>
                <div className="absolute right-[-10px] top-2 h-4 w-4 rounded-full bg-primary-500"></div>
              </div>
              <div className="w-3/4 pl-12">
                <div className="milestone-item">
                  <h4 className="text-lg font-bold">Terbe, D.; Orzó, L.; Zarándy, Á.</h4>
                  <p>
                    <strong>Classification of Holograms with 3D-CNN.</strong> Sensors 2022, 22,
                    8366.{' '}
                    <a
                      href="https://doi.org/10.3390/s22218366"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:underline"
                    >
                      Read Here
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 flex items-start">
              <div className="relative w-1/4 pr-4 text-right">
                <span className="block text-gray-500 dark:text-gray-400">2021</span>
                <div className="absolute right-[-10px] top-2 h-4 w-4 rounded-full bg-primary-500"></div>
              </div>
              <div className="w-3/4 pl-12">
                <div className="milestone-item">
                  <h4 className="text-lg font-bold">Terbe, D.; László, O.; Zarándy, Á.</h4>
                  <p>
                    <strong>
                      Deep-learning-based bright-field image generation from a single hologram using
                      an unpaired dataset.
                    </strong>{' '}
                    Optics Letters 46.22 (2021): 5567-5570.{' '}
                    <a
                      href="https://doi.org/10.1364/OL.440900"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:underline"
                    >
                      Read Here
                    </a>
                  </p>
                </div>
              </div>
            </div>
            {/* Add more publication items similarly */}
          </div>
        </div>

        {/* Conferences Section */}
        <h3 className="ml-20 mt-12 text-3xl font-bold text-primary-500 dark:text-primary-400">
          Conferences
        </h3>
        <div className="relative mt-8">
          <div className="absolute left-1/4 h-full w-1 bg-primary-500"></div>

          {/* Conference Items */}
          <div className="mb-8 flex items-start">
            <div className="relative w-1/4 pr-4 text-right">
              <span className="block text-gray-500 dark:text-gray-400">2022</span>
              <div className="absolute right-[-10px] top-2 h-4 w-4 rounded-full bg-primary-500"></div>
            </div>
            <div className="w-3/4 pl-12">
              <div className="milestone-item">
                <h4 className="text-lg font-bold">
                  2022 Society for Neuroscience (SfN) Conference
                </h4>
                <p>
                  Presentation: "Reliable estimation of neuronal biophysical parameters from
                  electrophysiological recordings." by Terbe D., Szoboszlay M., Nusser Z., Káli Sz.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 flex items-start">
            <div className="relative w-1/4 pr-4 text-right">
              <span className="block text-gray-500 dark:text-gray-400">2020</span>
              <div className="absolute right-[-10px] top-2 h-4 w-4 rounded-full bg-primary-500"></div>
            </div>
            <div className="w-3/4 pl-12">
              <div className="milestone-item">
                <h4 className="text-lg font-bold">
                  2020 IEEE International Symposium on Circuits and Systems (ISCAS)
                </h4>
                <p>
                  Presentation: "Multi-Level Optimization for Enabling Life Critical Visual
                  Inspections of Infants in Resource Limited Environment." by Zarándy, Á., Földesy,
                  P., Nagy, Á., Jánoki, I., Terbe, D., Siket, M., Szabó, M., and Varga, J.
                </p>
              </div>
            </div>
          </div>

          {/* Add more conference items similarly */}
        </div>

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
