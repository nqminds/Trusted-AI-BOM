import { spawn } from "child_process";

/**
 * Generates a vulnerability report by running Syft and Grype in Docker containers.
 * @param {string} directoryPath - The directory path to analyze.
 * @returns {Promise<{sbom: object, vulnerabilityReport: string}>}
 */
export async function generateVulnerabilityReport(directoryPath) {
  console.log("Running Syft to generate SBOM...");

  const dockSyftArgs = [
    "run",
    "--rm",
    "-v",
    `${directoryPath}:/project`,
    "anchore/syft",
    "/project",
    "-o",
    "cyclonedx-json",
  ];

  try {
    // Run Syft and get SBOM output in memory
    const sbomOutput = await runDockerCommand("docker", dockSyftArgs);
    console.log("SBOM generation completed.");

    console.log("Running Grype to generate vulnerability report...");

    const grypeArgs = [
      "run",
      "--rm",
      "-i", // Use stdin for input
      "anchore/grype",
      "-o",
      "table",
    ];

    // Run Grype with SBOM passed via stdin
    const vulnerabilityReport = await runDockerCommand(
      "docker",
      grypeArgs,
      sbomOutput
    );

    return { sbom: JSON.parse(sbomOutput), vulnerabilityReport };
  } catch (error) {
    throw new Error(`Error generating report: ${error}`);
  }
}

/**
 * Helper function to run Docker commands asynchronously with optional input
 * @param {string} command - The Docker command to run.
 * @param {Array<string>} args - Arguments for the Docker command.
 * @param {string|null} input - Optional input to pass to the command.
 * @returns {Promise<string>} The command output.
 */
function runDockerCommand(command, args, input = null) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args);
    let output = "";
    let errorOutput = "";

    if (input) {
      process.stdin.write(input);
      process.stdin.end();
    }

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    process.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Command failed with code ${code}: ${errorOutput}`));
      }
    });

    process.on("error", (err) => {
      console.error("Error with Docker process:", err);
      reject(err);
    });
  });
}

/**
 * Processes a vulnerability report and formats it into an object.
 * @param {string} fileContent - The raw content of the vulnerability report.
 * @param {string} outputDirectory - The output directory.
 * @returns {Array<object>} Parsed vulnerability data.
 */
export function processVulnerabilityReport(fileContent, outputDirectory) {
  const lines = fileContent.split("\n").filter((line) => line.trim());

  lines.shift();
  const vulnerabilities = lines.map((line, index) => {
    const parts = line.split(/\s{2,}/);

    if (parts.length < 5) {
      console.warn(`Could not parse line ${index + 1}: ${line}`);
      return;
    }

    const name = parts[0];
    const installed = parts[1] !== "-" ? parts[1] : null;
    let fixedIn = null;

    if (
      parts[2].match(/^(\d+(\.\d+)*)(,\s*\d+(\.\d+)*)*$/) ||
      parts[2].match(/^\(.*\)$/)
    ) {
      fixedIn = parts[2].split(",").map((v) => v.trim());
    }

    const type = fixedIn ? parts[3] : parts[2];
    const vulnerability = fixedIn ? parts[4] : parts[3];
    const rawSeverity = fixedIn ? parts[5] : parts[4];
    const validSeverities = ["Medium", "High", "Critical", "Low", "Negligible"];
    const severity = validSeverities.includes(rawSeverity)
      ? rawSeverity
      : "Unknown";

    return {
      [name]: {
        installed: installed,
        "fixed-in": fixedIn,
        type: type,
        vulnerability: vulnerability,
        severity: severity,
      },
    };
  });
  return vulnerabilities;
}
