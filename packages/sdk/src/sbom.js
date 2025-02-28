const { spawn } = require('child_process');
const path = require("path");
const os = require("os");
const fs = require("fs");

async function generateVulnerabilityReport(directoryPath) {
  const tempDir = os.tmpdir();
  const codeName = path.basename(directoryPath);
  const sbomFilePath = path.join(tempDir, `sbom_${codeName}.json`);  // Save SBOM to file

  console.log('Running Syft to generate SBOM...');

  const dockSyftArgs = [
    'run',
    '--rm',
    '-v',
    `${directoryPath}:/project`,
    'anchore/syft',
    '/project',
    '-o',
    'cyclonedx-json',
  ];

  try {
    // Run Syft and get SBOM output
    const sbomOutput = await runDockerCommand('docker', dockSyftArgs);

    // Save the SBOM to a file
    fs.writeFileSync(sbomFilePath, sbomOutput);
    console.log('SBOM generation completed.');

    console.log('Running Grype to generate vulnerability report...');
    
    // Grype command: pass the file path of the SBOM
    const grypeArgs = [
      'run',
      '--rm',
      '-v',
      `${path.dirname(sbomFilePath)}:/vulnerability-reports`, // Mount the directory containing the SBOM file
      'anchore/grype',
      `/vulnerability-reports/${path.basename(sbomFilePath)}`, // Reference the SBOM file by its name inside the container
      '-o',
      'table',
    ];

    // Run Grype with the SBOM file
    const vulnerabilityReport = await runDockerCommand('docker', grypeArgs);

    return { sbom: JSON.parse(sbomOutput), vulnerabilityReport };
  } catch (error) {
    throw new Error(`Error generating report: ${error}`);
  }
}

// Helper function to run Docker commands asynchronously
function runDockerCommand(command, args, input = null) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args);
    let output = '';
    let errorOutput = '';

    if (input) {
      process.stdin.write(input);
      process.stdin.end();
    }

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Command failed with code ${code}: ${errorOutput}`));
      }
    });

    process.on('error', (err) => {
      console.error('Error with Docker process:', err);
      reject(err);
    });
  });
}

module.exports = { generateVulnerabilityReport };
