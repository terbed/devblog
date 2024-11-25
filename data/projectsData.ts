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
]

export default projectsData
