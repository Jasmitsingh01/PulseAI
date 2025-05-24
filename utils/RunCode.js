const { exec } = require('child_process');
const path = require('path');

/**
 * Builds and runs a Docker image from the Dockerfile at the provided path.
 *
 * @param {string} dockerfilePath - The path to the Dockerfile.
 * @param {string} imageName - The name to tag the built image. Defaults to "my_docker_image".
 * @param {string} buildContextPath - Path to the build context.
 * Defaults to the directory containing the Dockerfile.
 * If the Dockerfile uses a relative path (e.g., COPY ./app /app), this path is crucial.
 * It's the base path from which files are referenced in the Dockerfile.
 * If not provided, it defaults to the directory of the Dockerfile.
 * @returns {Promise<{ success: boolean, message: string, containerId?: string }>}
 * A Promise that resolves to an object:
 * - success (boolean): True on success, False on failure.
 * - message (string):  On success: "Image built and container running successfully."
 * On failure: An error message from the Docker command.
 * - containerId (string, optional): The ID of the started container (only on success).
 */
async function runDockerfile(dockerfilePath, imageName = 'my_docker_image', buildContextPath,Port) {
    // Determine the build context if not provided.
    if (!buildContextPath) {
        buildContextPath = path.dirname(dockerfilePath);
    }

    try {
        // Build the image.
const buildCommand = `docker build -t ${imageName} "${dockerfilePath}"`;
        console.log(`Building image with command: ${buildCommand}`);
        const buildOutput = await new Promise((resolve, reject) => {
            exec(buildCommand, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`Docker build failed: ${error.message}\n${stderr}`));
                } else {
                    resolve(stdout);
                }
            });
        });

        // Print the build output.
        console.log(buildOutput ,' Build output');

        // Run the container.
        const runCommand = `docker run -d -p ${Port}:${Port} ${imageName}`;
        console.log(`Running container with command: ${runCommand}`);
        const containerId = await new Promise((resolve, reject) => {
            exec(runCommand, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`Docker run failed: ${error.message}\n${stderr}`));
                } else {
                    resolve(stdout.trim()); // Get the container ID from stdout
                }
            });
        });

        console.log(`Container ID: ${containerId}`);
        return { success: true, message: 'Image built and container running successfully.', containerId };

    } catch (error) {
        return { success: false, message: error.message };
    }
}


module.exports = runDockerfile;
