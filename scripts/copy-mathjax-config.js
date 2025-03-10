const fs = require('fs');
const path = require('path');

// Source and destination paths
const sourcePath = path.join(__dirname, '../src/lib/mathjax-config.js');
const destPath = path.join(__dirname, '../public/mathjax-config.js');

// Copy the file
try {
  // Create the directory if it doesn't exist
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copy the file
  fs.copyFileSync(sourcePath, destPath);
  console.log('MathJax config copied successfully to public directory');
} catch (error) {
  console.error('Error copying MathJax config:', error);
  process.exit(1);
} 