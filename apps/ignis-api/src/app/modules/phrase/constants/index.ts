
/**
 * Accepted file sizes that will be accepted duirng upload
 */
export const ACCEPTED_FILE_TYPES = [
    'mp3',
];

export const ACCEPTED_MIME_TYPES = [
    'audio/mpeg',
    'audio/mp3',
];

export const MIME_TYPES_MAP = {
    'mp3': 'audio/mp3',
};

const SIZE_1MB = 1024 * 1024;
export const MAX_FILE_SIZE = 100 * SIZE_1MB;

export const AUDIO_FORMATS = {
    WAV: 'wav'
};