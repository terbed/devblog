interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Bayesian Inference for Biophysical Neuron Models',
    description: `Estimating the biophysical parameters of neurons using computer simulations and probabilistic models.`,
    imgSrc: '/static/projects/neuron.png',
    href: '/blog/projects/neuron-parameter-inference',
  },
  {
    title: 'Remote Photoplethysmography (rPPG)',
    description: `A conventional camera can measure the subtle color variation in the skin associated with the cardiac cycle. 
In this project, I've implemented and developed several traditional and deep learning algorithms to extract the heart rate from video recordings.
Moreover, I've developed a real-time application that demonstrates remote pulse estimation, available at the Apple app store.`,
    imgSrc: '/static/projects/rppg.png',
    href: '/blog/projects/remote-pulse-estimation',
  },
  {
    title: 'Impaired Speech Correction',
    description: `In this proof-of-concept project, I've researched and developed speech-to-speech deep-learning models to correct impaired speech of dysarthric speakers. 
    We've presented our results in the XVIII. Hungarian Conference on Computational Linguistics.`,
    imgSrc: '/static/projects/speech2.png',
    // href: '/blog/projects/impaired-speech-correction',
  },
  {
    title: 'Digital Holographic Microscopy',
    description: `Digital holography is a technique that allows the numerical reconstruction of the 3D volume from a camera image capturing the interference pattern of coherent light scattered from the sample – called the hologram.
In this project, I've developed deep-learning models for object detection, segmentation, classification, focusing, phase reconstruction, and more. We have founded a startup company called HoloDetect to commercialize the technology.
Besides project development, we have published several peer-reviewed papers in top-tier journals, contributing to the field of digital holography.`,
    imgSrc: '/static/projects/holodetect2.png',
    //href: '/blog/projects/holodetect',
  },
]

export default projectsData
