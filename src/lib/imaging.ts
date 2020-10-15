import sharp from 'sharp';
import { parseSizeFactory } from 'avatars-utils';
import { Face } from './FaceFactory';

const minSize = 40;
const maxSize = 400;

export const parseSize = parseSizeFactory(minSize, maxSize);

export const combine = (face: Face): sharp.Sharp =>
  sharp(face.eyes)
    .composite([{ input: face.mouth }, { input: face.nose }])
    .flatten({ background: face.color });

export const resize = (rawSize: string): sharp.Sharp => {
  const size = parseSize(rawSize);
  return sharp().resize(size.width, size.height);
};
