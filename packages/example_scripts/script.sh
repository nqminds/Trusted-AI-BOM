node taibom.js $(tar c $1 | sha256sum | awk '{print $1}')
# Usage: ./script.sh weights_dir
