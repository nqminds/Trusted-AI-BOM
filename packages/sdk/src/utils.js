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

function getAndVerifyClaim(path, claim=true, silent=false) {
  try {
    // Check if the file exists
    if (!fs.existsSync(path)) {
      throw new Error(`Claim file not found at path: ${path}`);
    }

    // Read and parse the JSON file
    const jsonFile = fs.readFileSync(path, 'utf8');
    const jsonVc = JSON.parse(jsonFile);
    if(claim && !silent) {
      // TODO: Verify the claim
      console.log("Resolving issuer guid", jsonVc.issuer)

      console.log("TAIBOM VC valid and verified. ID: ",jsonVc.id,)
    }
    return jsonVc;
  } catch (error) {
    console.error(`Error retrieving claim JSON: ${error.message}`);
    return null;
  }
}

function getIdentityJson(email) {
  const homeDir = require('os').homedir(); // Get user's home directory
  const identityPath = path.join(homeDir, '.taibom', `${email}-identity.json`);
  return getAndVerifyClaim(identityPath, true, true)
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


module.exports = {
  keypairDir, directoryExists, getIdentityJson, runBashCommand, ensureFilesExist, getAndVerifyClaim, getHash
}