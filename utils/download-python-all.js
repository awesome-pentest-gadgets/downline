// From https://raw.githubusercontent.com/stefnotch/quantum-sheet/master/utils/download-pyodide.js

import * as path from 'path'
import { fetchAndUnpack } from './src/fetch-and-unpack.js'
import { pythonFiles } from './src/python-files.js';

(async () => {
  const outputDirectory = path.join(path.resolve(), '../src-tauri/python-binaries')

  for (const pythonFile of pythonFiles) {
    console.log(`Downloading ${pythonFile.url}`)
    await fetchAndUnpack(pythonFile.url, outputDirectory, path.basename(pythonFile.url))
  }
})()
