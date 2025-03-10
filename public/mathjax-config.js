// MathJax configuration
window.MathJax = {
  tex: {
    inlineMath: [['\\(', '\\)']],
    displayMath: [['\\[', '\\]']],
    processEscapes: true,
    processEnvironments: true,
    processRefs: true,
    macros: {
      sim: "\\sim",
      pm: "\\pm",
      approx: "\\approx",
      text: ["\\text{#1}", 1],
      cdot: "\\cdot",
      frac: ["\\frac{#1}{#2}", 2],
      Delta: "\\Delta",
      delta: "\\delta",
      epsilon: "\\epsilon",
      sigma: "\\sigma",
      mu: "\\mu"
    }
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    ignoreHtmlClass: 'tex2jax_ignore',
    processHtmlClass: 'tex2jax_process'
  },
  startup: {
    ready: () => {
      console.log('MathJax is loaded and ready!');
      MathJax.startup.defaultReady();
    }
  }
}; 