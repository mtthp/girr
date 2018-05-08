const fs = require('fs');
const path = require('path');

/**
 * Create directory recursively
 *
 * @params dir The absolute path to create
 * @return void
 */
module.exports.mkdirSyncRecursive = function(dir) {
  const initDir = path.isAbsolute(dir) ? path.sep : '';
  dir.split(path.sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(parentDir, childDir);
    if (!fs.existsSync(curDir)) {
      fs.mkdirSync(curDir);
    }

    return curDir;
  }, initDir);
}
