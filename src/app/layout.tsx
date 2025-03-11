import { IBM_Plex_Mono, Inter } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/math.css";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import { Metadata } from 'next';
import { ChartInitializer } from "@/components/chart-initializer";

const mono = IBM_Plex_Mono({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "STAB3L Documentation",
  description: "Documentation for the STAB3L compute-backed stablecoin protocol",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="mathjax-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.MathJax = {
                tex: {
                  inlineMath: [['$', '$']],
                  displayMath: [['$$', '$$']],
                  processEscapes: false,
                  processEnvironments: true
                },
                options: {
                  skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
                  ignoreHtmlClass: 'math-ignore',
                  processHtmlClass: 'math-process'
                },
                startup: {
                  ready: function() {
                    MathJax.startup.defaultReady();
                    
                    // After MathJax initializes, enhance rendering of hybrid math/currency expressions
                    setTimeout(() => {
                      // Find text nodes with dollar signs not inside math containers
                      const walker = document.createTreeWalker(
                        document.body,
                        NodeFilter.SHOW_TEXT,
                        {
                          acceptNode: function(node) {
                            // Skip text nodes inside math containers or already processed nodes
                            if (node.parentElement && 
                                (node.parentElement.nodeName === 'MJX-CONTAINER' || 
                                 node.parentElement.classList.contains('dollar-sign') ||
                                 node.parentElement.classList.contains('math-ignore'))) {
                              return NodeFilter.FILTER_REJECT;
                            }
                            
                            // Accept if has a dollar sign
                            if (node.nodeValue && node.nodeValue.includes('$') && 
                                // Ensure it's likely a currency reference
                                (/\$\d/.test(node.nodeValue) || // $1, $2, etc.
                                 /\d\$/.test(node.nodeValue) || // 1$, 2$, etc.
                                 /\$[A-Za-z]/.test(node.nodeValue) && !/\$[xyzXYZ]/.test(node.nodeValue))) { // $USD, $BTC but not common math variables
                              return NodeFilter.FILTER_ACCEPT;
                            }
                            
                            return NodeFilter.FILTER_SKIP;
                          }
                        }
                      );

                      const currencyNodes = [];
                      let currentNode;
                      while (currentNode = walker.nextNode()) {
                        currencyNodes.push(currentNode);
                      }

                      // Process the found nodes
                      currencyNodes.forEach(textNode => {
                        const text = textNode.nodeValue;
                        
                        // Process text with regex to find currency patterns
                        // Specifically targets currency patterns but avoids math expressions
                        const newHTML = text.replace(/(\$)(\d+[\d,\.]*|\s*\d+[\d,\.]*)/g, function(match, dollar, rest) {
                          // Skip if it seems to be inside a math expression (check if preceded by =)
                          if (text.indexOf('= ' + match) >= 0 || text.indexOf('=' + match) >= 0) {
                            return match;
                          }
                          return '<span class="dollar-sign math-ignore">$</span>' + rest;
                        });
                        
                        if (newHTML !== text) {
                          const span = document.createElement('span');
                          span.innerHTML = newHTML;
                          span.classList.add('math-ignore');
                          textNode.parentNode.replaceChild(span, textNode);
                        }
                      });
                      
                      // Special handling for math expressions with embedded currency
                      document.querySelectorAll('mjx-container').forEach(container => {
                        const containerHTML = container.innerHTML;
                        
                        // Look for currency patterns in math (e.g., "= $0.06")
                        if (containerHTML.includes('=') && containerHTML.includes('$')) {
                          // Extract the text
                          const text = container.textContent || '';
                          
                          // Check if there are currency patterns
                          if (/= *\$\d/.test(text)) {
                            // Get the original math element
                            const mathElement = container.querySelector('math');
                            if (mathElement) {
                              const mathHTML = mathElement.outerHTML;
                              
                              // Replace dollar signs in "= $X" patterns
                              const newMathHTML = mathHTML.replace(/(= *)(\$)(\d+)/g, 
                                '$1<span class="dollar-sign math-ignore">$2</span>$3');
                              
                              // Only replace if we found a match
                              if (newMathHTML !== mathHTML) {
                                // Reprocess the math with the wrapped dollar sign
                                setTimeout(() => {
                                  container.outerHTML = newMathHTML;
                                  MathJax.typeset([container.parentNode]);
                                }, 100);
                              }
                            }
                          }
                        }
                      });
                    }, 1000);
                    
                    // Add custom styling for display equations
                    const style = document.createElement('style');
                    style.innerHTML = 
                      'mjx-container[display="true"] {' +
                      '  background-color: #f5f5f5;' +
                      '  padding: 1rem;' +
                      '  margin: 1.5rem 0;' +
                      '  border-radius: 0.5rem;' +
                      '  text-align: center;' +
                      '  overflow-x: auto;' +
                      '  overflow-y: hidden;' +
                      '  display: block;' +
                      '}' +
                      '.dark mjx-container[display="true"],' +
                      ':root.dark mjx-container[display="true"] {' +
                      '  background-color: #1a1a1a;' +
                      '}' +
                      '/* Add space around inline equations */' +
                      'mjx-container:not([display="true"]) {' +
                      '  margin: 0 0.2em;' +
                      '}' +
                      '/* Make dollar sign class not be processed by MathJax */' +
                      '.dollar-sign {' +
                      '  display: inline-block;' +
                      '  font-family: inherit;' +
                      '}' +
                      '/* Ensure currency in math expressions looks correct */' +
                      'mjx-container .dollar-sign {' +
                      '  margin-right: -0.1em;' +
                      '  font-style: normal;' +
                      '}';
                    document.head.appendChild(style);
                  }
                },
                chtml: {
                  scale: 1,
                  minScale: 0.5
                }
              };
            `,
          }}
        />
        <Script
          id="mathjax-cdn"
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
          strategy="afterInteractive"
        />
        <ChartInitializer />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        
        <Script id="chart-check" strategy="afterInteractive">
          {`
            console.log('Chart.js loaded check:', typeof Chart !== 'undefined' ? 'Available' : 'Not available');
            console.log('renderChart function check:', typeof renderChart === 'function' ? 'Available' : 'Not available');
            if (typeof Chart === 'undefined') {
              console.error('Chart.js is not available!');
            }
            if (typeof renderChart !== 'function') {
              console.error('renderChart function is not available!');
            }
          `}
        </Script>
      </body>
    </html>
  );
} 