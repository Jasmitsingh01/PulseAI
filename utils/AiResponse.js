const { GoogleGenAI } = require('@google/genai');
const { exec } = require('child_process');

require('dotenv').config();

async function main(prompt) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    responseMimeType: 'text/plain',
    systemInstruction: [
      {
        text: `You are an coding expert. Create a detailed web design and frontend functionality project using specific technologies as requested. The response must include a well-structured directory layout reflecting best practices for frontend development. Additionally, provide a Dockerfile configured to build and run the project seamlessly in a containerized environment. The entire output should be formatted in JSON with clear keys representing the directory structure, file contents (including code files), and Docker configuration. Ensure the JSON is properly nested to illustrate folder hierarchy and includes code snippets as string values within the appropriate files.

# Steps

1. Identify and list the technologies to be used (e.g., React, Vue, Angular, Svelte, or plain HTML/CSS/JS).
2. Define a proper, clear directory structure for the frontend project.
3. Provide the essential files such as index.html, main JS or framework setup files, styling files, and any configuration files.
4. Write a Dockerfile that uses an appropriate base image, copies the project files, installs dependencies, and defines the command to run the development server or serve the build.
5. Present the directory and file contents in a JSON object with folder names as keys, files as string contents, and the Dockerfile content included.

# Output Format

A JSON object structured as follows:
{
  "project": {
    "src": {
      "index.js": "[JavaScript or framework entry point code]",
      "App.js": "[Main component code if applicable]"
    },
    "public": {
      "index.html": "[HTML content]"
    },
    "styles": {
      "style.css": "[CSS styling]"
    },
    "Dockerfile": "[Dockerfile content]",
    "package.json": "[Optional package configuration if needed]"
  }
}

All code strings should be properly escaped and indented to maintain readability within JSON.

# Notes

- The output must only include the project structure and contents with no additional explanation.
- Ensure the Dockerfile enables running or serving the frontend app with minimal setup.
- The directory structure should follow conventions suitable for the chosen frontend technology.

# Examples

{
  "Mention_Project_Name_Here": {
    "src": {
      "index.js": "import React from 'react';\nimport ReactDOM from 'react-dom';\nReactDOM.render(<App />, document.getElementById('root'));",
      "App.js": "function App() { return <h1>Hello World</h1>; }\nexport default App;"
    },
    "public": {
      "index.html": "<!DOCTYPE html><html lang='en'><head><title>React App</title></head><body><div id='root'></div></body></html>"
    },
    "Dockerfile": "FROM node:14\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nCMD ['npm', 'start']",
    
    "package.json": "{\n  \"name\": \"frontend-app\",\n  \"dependencies\": {\n    \"react\": \"^17.0.2\",\n    \"react-dom\": \"^17.0.2\"\n  }\n}"
  }
  "Port" : "Mention_Here_Default_expose_Port_Of_Docker_file"
}`
      }
    ],
  };
  const model = 'gemini-2.5-flash-preview-04-17';
  const contents = prompt;
  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fullResponse = '';
  for await (const chunk of response) {
    fullResponse += chunk.text;
  }
  // console.log(fullResponse);
  fullResponse = fullResponse.replace(/^```json\s*/, '').replace(/\s*```$/, ''); // remove the ```json and ``` from the response
  const jsonResponse = JSON.parse(fullResponse); // parse the response to json
  // console.log(jsonResponse);
  return jsonResponse;
}

function runCode(dockerfilePath, imageName, containerName){
    try {
      if (!dockerfilePath || !imageName) {
          throw new Error('Dockerfile path and image name are required'); 
      }
    
      console.log(`Building Docker image from ${dockerfilePath} with name ${imageName}`);
      
      // Build the Docker image
      exec(`docker build -t ${imageName} -f ${dockerfilePath} .`, (buildError, buildStdout, buildStderr) => {
        if (buildError) {
          throw new Error(`Failed to build Docker image: ${buildError}`);
        }
        
        console.log(`Docker image built successfully: ${buildStdout}`);
        
        // Run the Docker container if containerName is provided
        if (containerName) {
          console.log(`Running container ${containerName} from image ${imageName}`);
          
          exec(`docker run --name ${containerName} ${imageName}`, (runError, runStdout, runStderr) => {
            if (runError) {
              throw new Error(`Error running Docker container: ${runError}`);
            }
            
            console.log(`Docker container started successfully: ${runStdout}`);
            return runStdout;
          });
        } else {
          // Just return success for the build if no container name was provided
          return buildStdout;
        }
      });
    } catch (error) {
     console.log(error);
    }
}

function stopContainer(containerName){
    try {
        exec(`docker stop ${containerName}`, (stopError, stopStdout, stopStderr) => {
            if (stopError) {
                throw new Error(`Failed to stop Docker container: ${stopError}`);
            }
            
            console.log(`Docker container stopped successfully: ${stopStdout}`);
            return stopStdout;
        });
    } catch (error) {
        console.log(error);
    }
}

function removeContainer(containerName){
    try {
        exec(`docker rm ${containerName}`, (removeError, removeStdout, removeStderr) => {
            if (removeError) {
                throw new Error(`Failed to remove Docker container: ${removeError}`);
            }
            
            console.log(`Docker container removed successfully: ${removeStdout}`);
            return removeStdout;
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { main, runCode, stopContainer, removeContainer };
