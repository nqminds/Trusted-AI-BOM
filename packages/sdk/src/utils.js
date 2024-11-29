const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

// Get the user's home directory
const homeDir = os.homedir();
const keypairDir = path.join(homeDir, '.taibom');

function directoryExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory() || fs.existsSync(dirPath) && fs.statSync(dirPath).isFile();
}

function getAndVerifyClaim(path, claim=true) {
  try {
    // Check if the file exists
    if (!fs.existsSync(path)) {
      throw new Error(`Claim file not found at path: ${path}`);
    }

    // Read and parse the JSON file
    const jsonFile = fs.readFileSync(path, 'utf8');
    if(claim) {
      // TODO: Verify the claim
      console.log("Resolving issuer guid")

      console.log("VC verified")
    }
    return JSON.parse(jsonFile);
  } catch (error) {
    console.error(`Error retrieving claim JSON: ${error.message}`);
    return null;
  }
}

function getIdentityJson(email) {
  const homeDir = require('os').homedir(); // Get user's home directory
  const identityPath = path.join(homeDir, '.taibom', `${email}-identity.json`);
  return getAndVerifyClaim(identityPath)
}

function runBashCommand(bashCommand, callback) {
  exec(bashCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Command failed: ${error.message}`);
      return callback ? callback(error) : process.exit(1);
    }
    if (stderr) {
      console.error(`Command error: ${stderr}`);
      return callback ? callback(new Error(stderr)) : process.exit(1);
    }
    if (callback) callback(null, stdout.trim());
  });
}

function ensureFilesExist(files) {
  for (const file of files) {
    if (!fs.existsSync(file)) {
      throw new Error(`Required file not found: ${file}`);
    }
  }
}

function getHash(dataDir) {
  // Strip "file://" prefix if it exists
  if (dataDir.startsWith('file://')) {
    dataDir = dataDir.replace('file://', '');
  }

  // Enclose the path in quotes to handle spaces
  return `find "${dataDir}" -type f -exec sha256sum {} + | sort | sha256sum | awk '{print $1}'`;
}


function processVulnerabilityReport(inputFilePath, outputDirectory) {
  const fileContent = fs.readFileSync(inputFilePath, 'utf8');
  const lines = fileContent.split('\n').filter(line => line.trim());

  lines.shift();
  lines.forEach((line, index) => {
      const parts = line.split(/\s{2,}/);

      if (parts.length < 5) {
          console.warn(`Could not parse line ${index + 1}: ${line}`);
          return;
      }

      const name = parts[0];
      const installed = parts[1] !== '-' ? parts[1] : null;
      let fixedIn = null;

      if (parts[2].match(/^(\d+(\.\d+)*)(,\s*\d+(\.\d+)*)*$/) || parts[2].match(/^\(.*\)$/)) {
          fixedIn = parts[2].split(',').map(v => v.trim());
      }

      const type = fixedIn ? parts[3] : parts[2];
      const vulnerability = fixedIn ? parts[4] : parts[3];
      const rawSeverity = fixedIn ? parts[5] : parts[4];
      const validSeverities = ['Medium', 'High', 'Critical', 'Low'];
      const severity = validSeverities.includes(rawSeverity) ? rawSeverity : 'Unknown';
      const sanitizedFileName = name.replace(/[^a-zA-Z0-9-_]/g, '_');

      const jsonData = {
          [name]: {
              installed: installed,
              'fixed-in': fixedIn,
              type: type,
              vulnerability: vulnerability,
              severity: severity,
          },
      };

      const outputFilePath = `${outputDirectory}/${sanitizedFileName}_${index + 1}.json`;
      fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 4), 'utf8');
  });

  console.log(`Processed ${lines.length} vulnerabilities and saved JSON files in ${outputDirectory}`);
}

module.exports = {
  keypairDir, 
  directoryExists, 
  getIdentityJson, 
  runBashCommand, 
  ensureFilesExist, 
  getAndVerifyClaim, 
  getHash,
  processVulnerabilityReport
}