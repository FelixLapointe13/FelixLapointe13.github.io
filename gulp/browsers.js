import os from 'os';
import fs from 'fs';

let browsers = [];

if (os.platform() === 'darwin') {
  // macOS : vérifier si Brave est installé
  if (fs.existsSync('/Applications/Brave Browser.app')) {
    browsers = ['Brave Browser'];
  } else {
    browsers = ['google chrome'];
  }
} else {
  // Windows/Linux
  browsers = ['chrome'];
}

export { browsers };
