import { Logger } from '@nestjs/common';
import Ffmpeg from 'fluent-ffmpeg';

const profiles = {
  wav: {
    format: 'wav',
    // Use PCM codec for WAV
    audioCodec: 'pcm_s16le',
  },
};

export function transformAudioAndSaveToFile(
  inputFile: string,
  outputFile: string,
  options: AudioTransformOptions
) {
  const profile = profiles[options.format];
  if (!profile) {
    throw new Error(`Format is not supported: ${options.format}`);
  }
  return new Promise<void>((resolve, reject) => {
    Ffmpeg()
      .input(inputFile)
      .audioCodec(profile.audioCodec) 
      .toFormat(profile.format)
      .on('end', () => {
        resolve();
      })
      .on('error', (err, stdout, stderr) => {
        Logger.log(`
          inputFile: ${inputFile}'
          stdout: ${stdout}
          stderr: ${stderr}
        `);
        reject(err);
      })
      .save(outputFile);
  });
}
