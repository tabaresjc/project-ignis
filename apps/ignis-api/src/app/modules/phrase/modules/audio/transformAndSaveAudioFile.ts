import Ffmpeg from 'fluent-ffmpeg';

const outputOptionsByFormat = {
  // this is how we specify the conversion for m4a files
  // see https://trac.ffmpeg.org/wiki/Encode/AAC
  m4a: '-c:a aac',
  // this is the default value used by fluent-ffmpeg
  wav: '-c:a pcm_s16le',
}

export function transformAudioAndSaveToFile(
  inputFile: string,
  outputFile: string,
  options: AudioTransformOptions
) {
  return new Promise<void>((resolve, reject) => {
    Ffmpeg()
      .input(inputFile)
      .outputOptions(outputOptionsByFormat[options.format] || null)
      .on('end', () => {
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      })
      .save(outputFile);
  });
}
