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
      <h1 className="mb-6 text-4xl font-bold dark:text-white">My Resume</h1>

      {/* Resume content to be converted into PDF */}
      <div ref={resumeRef} className="rounded-md bg-white p-8 shadow-lg dark:bg-gray-800">
        <h2 className="text-2xl font-bold dark:text-white">Dániel Terbe</h2>
        <p className="text-gray-700 dark:text-gray-300">AI Researcher & Developer</p>
        <div className="mt-6">
          <h3 className="text-3xl font-bold text-primary-500 dark:text-primary-400">Experience</h3>
          <ul className="ml-6 list-disc text-gray-700 dark:text-gray-300">
            <li className="mb-6">
              <strong>AI Consultant & Developer</strong> – Self-Employment
              <br />
              <ul className="ml-6 list-disc">
                <li>
                  <strong>TongueScanner</strong>: A pioneering AI-based tongue analysis tool for
                  Traditional Chinese Medicine (TCM). This project enhances the diagnostic processes
                  for TCM practitioners by analyzing various aspects of the tongue's appearance.
                  <br />
                  <span className="text-gray-500">August 2022 – January 2022</span>
                </li>
                <li className="mt-4">
                  <strong>Contract with a FinTech Startup</strong>: Applied machine learning and
                  deep learning techniques to the financial industry, focusing on the cryptocurrency
                  sector for financial analysis and predictions.
                  <br />
                  <span className="text-gray-500">June 2022 – September 2022</span>
                </li>
                <li className="mt-4">
                  <strong>Contract with the University of Szeged (SZTE), Hungary</strong>: Focused
                  on improving impaired speech using deep learning tools. Worked on Generative
                  Adversarial Networks (GANs) and transformer-based voice conversion models for
                  dysarthric speakers.
                  <br />
                  <span className="text-gray-500">October 2020 – January 2021</span>
                </li>
              </ul>
            </li>

            <li className="mb-6">
              <strong>Developer & Researcher</strong> – Institute for Computer Science and Control
              (SZTAKI), Budapest, Hungary
              <br />
              <span className="text-gray-500">August 2017 – Present</span>
              <ul className="ml-6 list-disc">
                <li>
                  <strong>Remote Photoplethysmography (rPPG)</strong>: Developed a system to detect
                  subtle skin color changes related to the cardiac cycle using average cameras. This
                  led to an iPhone app, "Remote Pulse," available in the Apple App Store.
                </li>
                <li className="mt-4">
                  <strong>Digital Holographic Microscopy (DHM)</strong>: Since 2020, worked on DHM
                  projects involving deep neural networks for hologram image processing and
                  real-world applications, such as automatic water sample analysis at waterworks.
                </li>
              </ul>
            </li>

            <li className="mb-6">
              <strong>Research Intern</strong> – Turbine Ltd.
              <br />
              <span className="text-gray-500">March 2016 – June 2016</span>
              <ul className="ml-6 list-disc">
                <li>
                  Explored machine learning (deep learning) applications in computational biology to
                  design effective cancer combination therapies using artificial intelligence.
                </li>
              </ul>
            </li>

            <li className="mb-6">
              <strong>Student Researcher</strong> – Institute of Experimental Medicine (KOKI),
              Computational Neuroscience Workgroup, Budapest, Hungary
              <br />
              <span className="text-gray-500">September 2015 – March 2022</span>
              <ul className="ml-6 list-disc">
                <li>
                  Focused on statistical inference of realistic neuron model parameters using
                  Bayesian statistics and computer simulations. Presented this work at the National
                  Conference.
                </li>
                <li className="mt-4">
                  Presented at the Society for Neuroscience (SfN) 2022 conference: "Reliable
                  estimation of neuronal biophysical parameters from electrophysiological
                  recordings."
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="mt-6">
          <h3 className="text-3xl font-bold text-primary-500 dark:text-primary-400">Education</h3>
          <ul className="ml-6 list-disc text-gray-700 dark:text-gray-300">
            <li className="mb-6">
              <strong>BSc. Physics</strong> – Eötvös Loránd University, Budapest
              <br />
              <span className="text-gray-500">2013 - 2017</span>
              <br />
              <span className="italic text-gray-600 dark:text-gray-400">
                Specialization: Theoretical Physics
              </span>
              <br />
              <span className="text-gray-600 dark:text-gray-400">
                Thesis work: Statistical inference of biophysical neuron model parameters. Parameter
                Parameter Inference
              </span>
            </li>
            <li>
              <strong>MSc. Info-Bionics Engineering</strong> – Pázmány Péter Catholic University,
              Budapest
              <br />
              <span className="text-gray-500">2017 - 2020</span>
              <br />
              <span className="italic text-gray-600 dark:text-gray-400">
                Specialization: Bionic Interfaces and Integrated Structures
              </span>
              <br />
              <span className="text-gray-600 dark:text-gray-400">
                Thesis work: Remote camera-based pulse estimation using deep learning tools.
                DeepRPPG
              </span>
            </li>
          </ul>
        </div>
        <div className="mt-6">
          <h3 className="text-4xl font-bold text-primary-500 dark:text-primary-400">
            Publications
          </h3>
          <ul className="ml-6 list-disc text-gray-700 dark:text-gray-300">
            <li className="mb-4">
              Terbe, D.; Orzó, L.; Bicsák, B.; Zarándy, Á.
              <strong> Hologram Noise Model for Data Augmentation and Deep Learning.</strong>{' '}
              Sensors 2024, 24, 948.{' '}
              <a
                href="https://doi.org/10.3390/s24030948"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:underline"
              >
                Read Here
              </a>
            </li>
            <li className="mb-4">
              Terbe, D.; Orzó, L.; Zarándy, Á.
              <strong> Classification of Holograms with 3D-CNN.</strong> Sensors 2022, 22, 8366.{' '}
              <a
                href="https://doi.org/10.3390/s22218366"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:underline"
              >
                Read Here
              </a>
            </li>
            <li className="mb-4">
              Terbe, D; László, O.; Zarándy, Á.
              <strong>
                {' '}
                Deep-learning-based bright-field image generation from a single hologram using an
                unpaired dataset.{' '}
              </strong>
              Optics Letters 46.22 (2021): 5567-5570.{' '}
              <a
                href="https://doi.org/10.1364/OL.440900"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:underline"
              >
                Read Here
              </a>
            </li>
            <li>
              Nagy, Á., Földesy, P., Jánoki, I., Terbe, D., Siket, M., Szabó, M., … & Zarándy, Á.
              <strong>
                {' '}
                Continuous camera-based premature-infant monitoring algorithms for NICU.{' '}
              </strong>
              Applied Sciences, 11(16), 7215.{' '}
              <a
                href="https://doi.org/10.3390/app11167215"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:underline"
              >
                Read Here
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-3xl font-bold text-primary-500 dark:text-primary-400">Conferences</h3>
          <ul className="ml-6 list-disc text-gray-700 dark:text-gray-300">
            <li className="mb-4">
              <strong>2022 Society for Neuroscience (SfN) Conference</strong>
              <br /> Presentation: "Reliable estimation of neuronal biophysical parameters from
              electrophysiological recordings." by Terbe D., Szoboszlay M., Nusser Z., Káli Sz.
            </li>
            <li className="mb-4">
              <strong>XVIII. Magyar Számítógépes Nyelvészeti Konferencia</strong>
              <br /> Presentation: "Hangkorverzió alkalmazása dysarthriás betegek beszédminőségének
              javítására" by Terbe, D., Tóth, L. & Ivaskó, L.
            </li>
            <li className="mb-4">
              <strong>2020 IEEE International Symposium on Circuits and Systems (ISCAS)</strong>
              <br /> Presentation: "Multi-Level Optimization for Enabling Life Critical Visual
              Inspections of Infants in Resource Limited Environment." by Zarándy, Á., Földesy, P.,
              Nagy, Á., Jánoki, I., Terbe, D., Siket, M., Szabó, M., and Varga, J.
            </li>
            <li className="mb-4">
              <strong>KÉPAF 2019 (Debrecen, Hungary)</strong>
              <br /> Presentation: "Remote camera based heart rate estimation." by Terbe, Dániel,
              and Ákos Zarándy.
            </li>
            <li>
              <strong>CNNA 2018 (Budapest, Hungary)</strong>
              <br /> Presentation: "Remote camera based measurement of human vital signs." by Terbe,
              Dániel, and Ákos Zarándy.
            </li>
          </ul>
        </div>
        {/* Add more sections as needed */}
      </div>

      {/* Download button moved below the CV */}
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
