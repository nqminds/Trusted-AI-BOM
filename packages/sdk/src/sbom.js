import { spawn } from 'child_process';

export async function generateVulnerabilityReport(directoryPath) {
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

    console.log('SBOM generation completed.');
    console.log('Running Grype to generate vulnerability report...');

    const grypeArgs = [
      'run',
      '--rm',
      '-i', // Read from stdin
      'anchore/grype',
      '-', // Use "-" to indicate reading input from stdin
      '-o',
      'table',
    ];

    // Run Grype with SBOM input
    const vulnerabilityReport = await runDockerCommand('docker', grypeArgs, sbomOutput);

    return {sbom: sbomOutput,vulnerabilityReport};
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
  });
}
