const fs = require('fs');
const path = require('path');

function checkType(item) {
  if (Array.isArray(item)) {
    return "Array";
  } else if (typeof item === 'object' && item !== null) {
    return "Object";
  } else {
    return typeof item; // Returns other types like 'string', 'number', 'boolean', etc.
  }
}

async function createFilesFromJSON(data, outputDir = './storage') {
  var ProjectPath;
  
  for (const filename in data) {
    if (data.hasOwnProperty(filename) && filename !== "Port") {
      const content = data[filename];
      ProjectPath = outputDir + '/' + filename;
      
      if (checkType(content) === 'Object') {
        // console.log('Filename contains an object:', content);
        const newDir = outputDir + '/' + filename;
        if (!fs.existsSync(newDir)) {
          fs.mkdirSync(newDir, { recursive: true });
          // console.log('Directory created:', newDir);
        }
        
        createFilesFromJSON(content, newDir);
      } else if (typeof content === 'string' || typeof content === 'number' || typeof content === 'boolean') {
        const filePath = path.join(outputDir, filename);
        try {
          fs.writeFileSync(filePath, String(content)); // Convert non-string values to strings
        } catch (error) {
          console.error(`Error creating file "${filename}":`, error);
        }
      }
    }
  }
  
  return ProjectPath;
}

module.exports = createFilesFromJSON;