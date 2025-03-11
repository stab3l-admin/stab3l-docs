"use client";

/**
 * Parse chart data from markdown content
 * Supports various chart types including bar, line, pie, doughnut, radar, etc.
 */
export function parseChartData(chartType: string, chartContent: string) {
  console.log('Parsing chart data for type:', chartType);
  console.log('Chart content:', chartContent);
  
  try {
    // Default colors for datasets
    const defaultColors = [
      'rgba(255, 99, 132, 0.5)',   // Red
      'rgba(54, 162, 235, 0.5)',   // Blue
      'rgba(255, 206, 86, 0.5)',   // Yellow
      'rgba(75, 192, 192, 0.5)',   // Green
      'rgba(153, 102, 255, 0.5)',  // Purple
      'rgba(255, 159, 64, 0.5)',   // Orange
      'rgba(199, 199, 199, 0.5)',  // Gray
      'rgba(83, 102, 255, 0.5)',   // Indigo
      'rgba(255, 99, 255, 0.5)',   // Pink
      'rgba(0, 162, 150, 0.5)',    // Teal
    ];

    const borderColors = defaultColors.map(color => color.replace('0.5', '1'));

    // Extract title if present
    const titleMatch = chartContent.match(/title:\s*([^\n]+)/);
    const title = titleMatch ? titleMatch[1].trim() : '';
    console.log('Extracted title:', title);

    // Extract data section
    const dataMatch = chartContent.match(/data:\s*([\s\S]*?)(?:options:|$)/);
    if (!dataMatch) {
      console.error('No data section found in chart content');
      throw new Error('No data section found in chart content');
    }
    
    const dataContent = dataMatch[1];
    console.log('Extracted data content:', dataContent);
    
    // Extract options section if present
    const optionsMatch = chartContent.match(/options:\s*([\s\S]*?)$/);
    const optionsContent = optionsMatch ? optionsMatch[1] : '';
    
    // Parse data based on chart type
    switch (chartType.toLowerCase()) {
      case 'bar':
      case 'line': {
        // Extract labels
        const labelsMatch = dataContent.match(/labels:\s*([\s\S]*?)(?:datasets:|$)/);
        if (!labelsMatch) {
          console.error('No labels found in chart data');
          throw new Error('No labels found in chart data');
        }
        
        // Parse labels - they can be in array format or indented list
        const labelsContent = labelsMatch[1].trim();
        let labels: string[] = [];
        
        if (labelsContent.startsWith('[') && labelsContent.endsWith(']')) {
          // Array format: [label1, label2, ...]
          labels = JSON.parse(labelsContent);
        } else {
          // Indented list format:
          // - label1
          // - label2
          const labelLines = labelsContent.split('\n').map(line => line.trim());
          labels = labelLines
            .filter(line => line.startsWith('-'))
            .map(line => line.substring(1).trim());
        }
        
        console.log('Extracted labels:', labels);
        
        // Extract datasets
        const datasetsMatch = dataContent.match(/datasets:\s*([\s\S]*?)(?:$)/);
        if (!datasetsMatch) {
          console.error('No datasets found in chart data');
          throw new Error('No datasets found in chart data');
        }
        
        const datasetsContent = datasetsMatch[1];
        console.log('Datasets content:', datasetsContent);
        
        // Split datasets by the dash at the beginning of a line followed by "label:"
        const datasetBlocks = datasetsContent.split(/(?:^|\n)\s*-\s*(?=label:)/);
        console.log('Dataset blocks:', datasetBlocks);
        
        const datasets = datasetBlocks
          .filter(block => block.trim())
          .map((block, index) => {
            console.log(`Processing dataset block ${index}:`, block);
            
            // Extract label
            const labelMatch = block.match(/label:\s*([^\n]+)/);
            const label = labelMatch ? labelMatch[1].trim() : `Dataset ${index + 1}`;
            console.log('Extracted label:', label);
            
            // Extract data
            const dataBlockMatch = block.match(/data:\s*(\[[^\]]+\])/);
            let data: number[] = [];
            
            if (dataBlockMatch) {
              // Array format: [1, 2, 3]
              data = JSON.parse(dataBlockMatch[1]);
              console.log('Extracted data (array format):', data);
            } else {
              // Indented list format:
              // data:
              //   - 1
              //   - 2
              const dataIndentedMatch = block.match(/data:\s*([\s\S]*?)(?:backgroundColor:|borderColor:|$)/);
              if (dataIndentedMatch) {
                const dataContent = dataIndentedMatch[1];
                console.log('Data content (indented format):', dataContent);
                
                const dataLines = dataContent.split('\n').map(line => line.trim());
                data = dataLines
                  .filter(line => line.startsWith('-'))
                  .map(line => {
                    const valueStr = line.substring(1).trim();
                    console.log('Parsing value:', valueStr);
                    return parseFloat(valueStr);
                  });
                
                console.log('Extracted data (indented format):', data);
              }
            }
            
            // Extract backgroundColor
            const bgColorMatch = block.match(/backgroundColor:\s*([^\n]+)/);
            const backgroundColor = bgColorMatch 
              ? bgColorMatch[1].trim() 
              : defaultColors[index % defaultColors.length];
            console.log('Extracted backgroundColor:', backgroundColor);
            
            // Extract borderColor
            const borderColorMatch = block.match(/borderColor:\s*([^\n]+)/);
            const borderColor = borderColorMatch 
              ? borderColorMatch[1].trim() 
              : borderColors[index % borderColors.length];
            console.log('Extracted borderColor:', borderColor);
            
            // Extract yAxisID if present (for line charts with dual axes)
            const yAxisIDMatch = block.match(/yAxisID:\s*([^\n]+)/);
            const yAxisID = yAxisIDMatch ? yAxisIDMatch[1].trim() : undefined;
            
            const dataset = {
              label,
              data,
              backgroundColor,
              borderColor,
              borderWidth: 1,
              ...(yAxisID && { yAxisID })
            };
            
            console.log('Created dataset:', dataset);
            return dataset;
          });
        
        // Parse options
        let options = {};
        if (optionsContent) {
          try {
            // Extract scales if present
            const scalesMatch = optionsContent.match(/scales:\s*([\s\S]*?)(?:$)/);
            if (scalesMatch) {
              const scalesContent = scalesMatch[1];
              
              // Extract y axis options
              const yAxisMatch = scalesContent.match(/y:\s*([\s\S]*?)(?:y1:|$)/);
              const y1AxisMatch = scalesContent.match(/y1:\s*([\s\S]*?)(?:$)/);
              
              const scales: any = {};
              
              if (yAxisMatch) {
                scales.y = parseAxisOptions(yAxisMatch[1]);
              }
              
              if (y1AxisMatch) {
                scales.y1 = parseAxisOptions(y1AxisMatch[1]);
              }
              
              options = { scales };
            }
          } catch (e) {
            console.error('Error parsing chart options:', e);
          }
        }
        
        const result = {
          title,
          labels,
          datasets,
          options
        };
        
        console.log('Final chart data:', result);
        return result;
      }
      
      case 'pie':
      case 'doughnut': {
        // Extract labels
        const labelsMatch = dataContent.match(/labels:\s*([\s\S]*?)(?:datasets:|$)/);
        if (!labelsMatch) {
          throw new Error('No labels found in chart data');
        }
        
        // Parse labels - they can be in array format or indented list
        const labelsContent = labelsMatch[1].trim();
        let labels: string[] = [];
        
        if (labelsContent.startsWith('[') && labelsContent.endsWith(']')) {
          // Array format: [label1, label2, ...]
          labels = JSON.parse(labelsContent);
        } else {
          // Indented list format:
          // - label1
          // - label2
          const labelLines = labelsContent.split('\n').map(line => line.trim());
          labels = labelLines
            .filter(line => line.startsWith('-'))
            .map(line => line.substring(1).trim());
        }
        
        // Extract data
        const datasetsMatch = dataContent.match(/datasets:\s*([\s\S]*?)(?:$)/);
        let data: number[] = [];
        let backgroundColor: string[] = [];
        
        if (datasetsMatch) {
          const datasetsContent = datasetsMatch[1];
          
          // Try to find a data array directly in the first dataset
          const dataBlockMatch = datasetsContent.match(/data:\s*(\[[^\]]+\])/);
          
          if (dataBlockMatch) {
            // Array format: [1, 2, 3]
            data = JSON.parse(dataBlockMatch[1]);
          } else {
            // Indented list format:
            // data:
            //   - 1
            //   - 2
            const dataIndentedMatch = datasetsContent.match(/data:\s*([\s\S]*?)(?:backgroundColor:|$)/);
            if (dataIndentedMatch) {
              const dataLines = dataIndentedMatch[1].split('\n').map(line => line.trim());
              data = dataLines
                .filter(line => line.startsWith('-'))
                .map(line => parseFloat(line.substring(1).trim()));
            }
          }
          
          // Try to find backgroundColor array
          const bgColorMatch = datasetsContent.match(/backgroundColor:\s*([\s\S]*?)(?:$)/);
          if (bgColorMatch) {
            const bgColorContent = bgColorMatch[1].trim();
            
            if (bgColorContent.startsWith('[') && bgColorContent.endsWith(']')) {
              // Array format: [color1, color2, ...]
              backgroundColor = JSON.parse(bgColorContent);
            } else {
              // Indented list format:
              // - color1
              // - color2
              const bgColorLines = bgColorContent.split('\n').map(line => line.trim());
              backgroundColor = bgColorLines
                .filter(line => line.startsWith('-'))
                .map(line => line.substring(1).trim());
            }
          }
        }
        
        // If no backgroundColor specified, use defaults
        if (backgroundColor.length === 0) {
          backgroundColor = defaultColors.slice(0, data.length);
        }
        
        return {
          title,
          labels,
          datasets: [{
            data,
            backgroundColor,
            borderColor: borderColors.slice(0, data.length),
            borderWidth: 1
          }]
        };
      }
      
      case 'radar': {
        // Extract labels
        const labelsMatch = dataContent.match(/labels:\s*([\s\S]*?)(?:datasets:|$)/);
        if (!labelsMatch) {
          throw new Error('No labels found in chart data');
        }
        
        // Parse labels - they can be in array format or indented list
        const labelsContent = labelsMatch[1].trim();
        let labels: string[] = [];
        
        if (labelsContent.startsWith('[') && labelsContent.endsWith(']')) {
          // Array format: [label1, label2, ...]
          labels = JSON.parse(labelsContent);
        } else {
          // Indented list format:
          // - label1
          // - label2
          const labelLines = labelsContent.split('\n').map(line => line.trim());
          labels = labelLines
            .filter(line => line.startsWith('-'))
            .map(line => line.substring(1).trim());
        }
        
        // Extract datasets
        const datasetsMatch = dataContent.match(/datasets:\s*([\s\S]*?)(?:$)/);
        if (!datasetsMatch) {
          throw new Error('No datasets found in chart data');
        }
        
        const datasetsContent = datasetsMatch[1];
        const datasetBlocks = datasetsContent.split(/\s*-\s*(?=label:)/);
        
        const datasets = datasetBlocks
          .filter(block => block.trim())
          .map((block, index) => {
            // Extract label
            const labelMatch = block.match(/label:\s*([^\n]+)/);
            const label = labelMatch ? labelMatch[1].trim() : `Dataset ${index + 1}`;
            
            // Extract data
            const dataBlockMatch = block.match(/data:\s*(\[[^\]]+\])/);
            let data: number[] = [];
            
            if (dataBlockMatch) {
              // Array format: [1, 2, 3]
              data = JSON.parse(dataBlockMatch[1]);
            } else {
              // Indented list format:
              // data:
              //   - 1
              //   - 2
              const dataIndentedMatch = block.match(/data:\s*([\s\S]*?)(?:backgroundColor:|borderColor:|$)/);
              if (dataIndentedMatch) {
                const dataLines = dataIndentedMatch[1].split('\n').map(line => line.trim());
                data = dataLines
                  .filter(line => line.startsWith('-'))
                  .map(line => parseFloat(line.substring(1).trim()));
              }
            }
            
            // Extract backgroundColor
            const bgColorMatch = block.match(/backgroundColor:\s*([^\n]+)/);
            const backgroundColor = bgColorMatch 
              ? bgColorMatch[1].trim() 
              : defaultColors[index % defaultColors.length].replace('0.5', '0.2');
            
            // Extract borderColor
            const borderColorMatch = block.match(/borderColor:\s*([^\n]+)/);
            const borderColor = borderColorMatch 
              ? borderColorMatch[1].trim() 
              : borderColors[index % borderColors.length];
            
            return {
              label,
              data,
              backgroundColor,
              borderColor,
              borderWidth: 1,
              pointBackgroundColor: borderColor
            };
          });
        
        return {
          title,
          labels,
          datasets
        };
      }
      
      case 'bubble': {
        // Extract datasets
        const datasetsMatch = dataContent.match(/datasets:\s*([\s\S]*?)(?:$)/);
        if (!datasetsMatch) {
          throw new Error('No datasets found in chart data');
        }
        
        const datasetsContent = datasetsMatch[1];
        const datasetBlocks = datasetsContent.split(/\s*-\s*(?=label:)/);
        
        const datasets = datasetBlocks
          .filter(block => block.trim())
          .map((block, index) => {
            // Extract label
            const labelMatch = block.match(/label:\s*([^\n]+)/);
            const label = labelMatch ? labelMatch[1].trim() : `Dataset ${index + 1}`;
            
            // Extract data
            const dataBlockMatch = block.match(/data:\s*([\s\S]*?)(?:backgroundColor:|$)/);
            let data: Array<{x: number, y: number, r: number}> = [];
            
            if (dataBlockMatch) {
              const dataContent = dataBlockMatch[1];
              const dataItems = dataContent.split('-').filter(item => item.trim());
              
              data = dataItems.map(item => {
                const xMatch = item.match(/x:\s*([0-9.]+)/);
                const yMatch = item.match(/y:\s*([0-9.]+)/);
                const rMatch = item.match(/r:\s*([0-9.]+)/);
                
                return {
                  x: xMatch ? parseFloat(xMatch[1]) : 0,
                  y: yMatch ? parseFloat(yMatch[1]) : 0,
                  r: rMatch ? parseFloat(rMatch[1]) : 5
                };
              });
            }
            
            // Extract backgroundColor
            const bgColorMatch = block.match(/backgroundColor:\s*([^\n]+)/);
            const backgroundColor = bgColorMatch 
              ? bgColorMatch[1].trim() 
              : defaultColors[index % defaultColors.length];
            
            return {
              label,
              data,
              backgroundColor
            };
          });
        
        return {
          title,
          datasets
        };
      }
      
      // Add more chart types as needed
      
      default:
        throw new Error(`Unsupported chart type: ${chartType}`);
    }
  } catch (error) {
    console.error('Error parsing chart data:', error);
    return {
      title: 'Error parsing chart',
      labels: ['Error'],
      datasets: [{
        label: 'Error',
        data: [1],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      }]
    };
  }
}

/**
 * Helper function to parse axis options from YAML-like format
 */
function parseAxisOptions(content: string): any {
  const options: any = {};
  
  // Check for type
  const typeMatch = content.match(/type:\s*([^\n]+)/);
  if (typeMatch) {
    options.type = typeMatch[1].trim();
  }
  
  // Check for display
  const displayMatch = content.match(/display:\s*([^\n]+)/);
  if (displayMatch) {
    options.display = displayMatch[1].trim() === 'true';
  }
  
  // Check for position
  const positionMatch = content.match(/position:\s*([^\n]+)/);
  if (positionMatch) {
    options.position = positionMatch[1].trim();
  }
  
  // Check for title
  const titleMatch = content.match(/title:\s*([\s\S]*?)(?:$)/);
  if (titleMatch) {
    const titleContent = titleMatch[1];
    const displayMatch = titleContent.match(/display:\s*([^\n]+)/);
    const textMatch = titleContent.match(/text:\s*([^\n]+)/);
    
    if (displayMatch || textMatch) {
      options.title = {};
      
      if (displayMatch) {
        options.title.display = displayMatch[1].trim() === 'true';
      }
      
      if (textMatch) {
        options.title.text = textMatch[1].trim();
      }
    }
  }
  
  return options;
} 