import { Logger } from '@nestjs/common';
import { Response } from 'express';
import Ffmpeg from 'fluent-ffmpeg';

const profiles = {
  mp3: {
    audioCodec: 'libmp3lame',             // Set the audio codec to MP3 (libmp3lame)
    audioChannels: 2,                     // Set stereo audio
    audioFrequency: 44100,                // Set audio sample rate to 44.1kHz (standard)
    audioBitrate: 192,                    // Set audio bit rate to 192 kbps
    audioQuality: 0,                      // Set audio quality (0 for best, 9 for worst)
  },
};

export function streamAudioFile(
  inputFile: string,
  res: Response,
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
      .audioChannels(profile.audioChannels)       
      .audioFrequency(profile.audioFrequency)     
      .audioBitrate(profile.audioBitrate)         
      .audioQuality(profile.audioQuality)         
      .toFormat(options.format)
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
      .pipe(res, { end: true });
  });
}
