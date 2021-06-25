import sharp, { FormatEnum } from 'sharp';
import { parseSizeFactory } from 'avatars-utils';
import { Face } from './FaceFactory';
import workerpool from 'workerpool';

const minSize = 32;
const maxSize = 512;

const parseSize = parseSizeFactory(minSize, maxSize);

const resize = (rawSize: string): sharp.Sharp => {
  const size = parseSize(rawSize);
  return sharp().resize(size.width, size.height);
};

const renderToBuffer = (face: Face, format: string): Promise<Buffer> =>
  sharp(face.eyes)
    .composite([{ input: face.mouth }, { input: face.nose }])
    .flatten({ background: face.color })
    .pipe(resize(face.size))
    .toFormat(format as keyof FormatEnum, { quality: 90 })
    .toBuffer();


workerpool.worker({
  renderToBuffer,
});
