/* eslint-disable max-len */
import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { promisify } from 'util';

const promisifiedExec = promisify(exec);
const logFilePath: string = 'backup_log.txt';

/**
 * Calculates a SHA-256 checksum for a given string.
 *
 * @param {string} str The input string from which to generate the checksum (UTF8 encoding).
 * @returns {Promise<string>} A promise that resolves with the calculated checksum (HEX string).
 */
export const calculateDirectoryChecksum = async (str: string): Promise<string> => crypto.createHash('sha256').update(str, 'utf8').digest('hex');

/**
 * Retrieves the most recent backup hash from a log file.
 *
 * @param {string} logPath Path to the log file containing backup hashes.
 * @returns {Promise<string | null>} A promise that resolves with the last backup hash found,
 *                                   or null if no hash is found or if an error occurs.
 */
export const getLastBackupHash = async (logPath: string): Promise<string | null> => {
  try {
    const content = await fs.readFile(logPath, 'utf-8');
    const lines = content.split('\n').filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i -= 1) {
      const line = lines[i];
      const match = line.match(/HASH:\s*([a-zA-Z0-9]+)/);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  } catch (err) {
    return null;
  }
};

/**
 * Creates an archive from a specified source directory and stores it in a destination directory.
 * Logs the result to a predetermined log file.
 *
 * @param {string} sourceDir The directory to archive.
 * @param {string} destinationDir The directory where the archive is to be stored.
 * @throws {Error} Throws an error if the archive creation fails.
 * @returns {Promise<void>} A promise that resolves when the archive has been successfully created.
 */
export const createArchive = async (sourceDir: string, destinationDir: string): Promise<void> => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-');
  const backupFileName = `backup-${timestamp}.tar.gz`;
  const backupFilePath = path.join(destinationDir, backupFileName);

  try {
    await fs.mkdir(destinationDir, { recursive: true });
    const entries = await fs.readdir(sourceDir);
    const sortedEntries = entries.sort().join(',');
    const hash = await calculateDirectoryChecksum(sortedEntries);

    const command = `tar -czf "${backupFilePath}" -C "${sourceDir}" .`;
    await promisifiedExec(command);

    const logMessage = `${now.toISOString()}: SUCCESS: Backup created at ${backupFilePath}, HASH: ${hash}\n`;
    await fs.appendFile(logFilePath, logMessage);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'tar command failed';
    const logMessage = `${now.toISOString()}: FAILED: ${errorMessage}\n`;
    await fs.appendFile(logFilePath, logMessage);
    throw new Error(`Failed to create backup, error = ${errorMessage}`);
  }
};

/**
 * Executes the backup process by checking the checksum of the current directory against the last backup.
 * If the checksums differ, it proceeds to create a new archive; otherwise, it skips the backup process.
 *
 * @param {string} sourceDir The source directory to check for changes.
 * @param {string} destinationDir The destination directory for storing the backup archive.
 * @throws {Error} Throws an error if the directory creation or any part of the backup process fails.
 * @returns {Promise<void>} A promise that resolves when the backup process has completed,
 *                          either by creating a new backup or skipping the process.
 */
export const runBackup = async (sourceDir: string, destinationDir: string): Promise<void> => {
  try {
    const entries = await fs.readdir(sourceDir);
    const sortedEntries = entries.sort().join(',');
    const currentHash = await calculateDirectoryChecksum(sortedEntries);

    const lastHash = await getLastBackupHash(logFilePath);

    if (lastHash && lastHash === currentHash) {
      process.stdout.write('No changes detected since last backup\n');
      return;
    }

    await fs.mkdir(destinationDir, { recursive: true });
    await createArchive(sourceDir, destinationDir);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${errorMessage}\n`);
  }
};
