const fs = require('fs');
const path = require('path');

const os = require('os');

// Get the user's home directory
const homeDir = os.homedir();
const keypairDir = path.join(homeDir, '.taibom');


module.exports = {
  keypairDir
}