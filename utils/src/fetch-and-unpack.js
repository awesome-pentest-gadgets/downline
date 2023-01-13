// From https://raw.githubusercontent.com/stefnotch/quantum-sheet/master/utils/download-pyodide.js

import { createArchiveByFileExtension } from '@shockpkg/archive-files'
import * as fse from 'fs-extra'
import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'
import { pipeline } from 'stream'


const streamPipeline = util.promisify(pipeline)
const fsRename = util.promisify(fs.rename)

/**
 * 
 * @param {string} url
 * @param {string} outputFolder
 * @param {string} outputName 
 */
export async function fetchAndUnpack(url, outputFolder, outputName, unpackSmart = false) {
  const downloadResponse = await fetch(url, {
    headers: { Accept: 'application/octet-stream' },
  })
  if (!downloadResponse.ok) {
    throw new Error(`unexpected download ${downloadResponse.statusText}\nHeaders:\n${downloadResponse.headers}`)
  }
  if (downloadResponse.body === null) {
    throw new Error(`unexpected download body ${downloadResponse.statusText}\nHeaders:\n${downloadResponse.headers}`)
  }

  const outputPath = path.join(outputFolder, outputName)
  const archivesFolder = path.join(outputFolder, "archive")
  await fse.ensureDir(archivesFolder)
  const archivePath = path.join(archivesFolder, outputName)

  // Ugh disgusting
  /** @type {any} */
  const body = downloadResponse.body
  await streamPipeline(body, fs.createWriteStream(archivePath))

  console.log(`Extracting ${archivePath}`)

  const archive = createArchiveByFileExtension(archivePath)
  if (archive === null) {
    throw new Error(`missing archive for ${archivePath}`)
  }
  /** @type {string[]} */
  const archivePaths = [];
  await archive.read(async (entry) => {
    const entryPath = entry.path;
    archivePaths.push(entryPath)
    await entry.extract(path.join(outputPath, entryPath))
  })
  await fse.remove(archivePath)


  if (unpackSmart && archivePaths.length > 0) {
    // A hack to unpack the archive to the root folder
    const archivePathSeparator = "/";
    const rootFolder = (archivePaths[0].split(archivePathSeparator)[0] || "")

    const allPathsSameFolder = archivePaths.every((entryPath) => {
      const splitted = entryPath.split(archivePathSeparator);
      return splitted.length > 0 && splitted[0] === rootFolder
    });

    if (allPathsSameFolder) {
      // Doesn't work for whatever cursed reason
      await fsRename(path.join(outputPath, rootFolder), path.join(outputPath))
    }

  }

  console.log(`Done unpacking to ${outputPath}`)
}