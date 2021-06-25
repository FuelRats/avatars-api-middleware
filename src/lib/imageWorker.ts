import sharp, { FormatEnum } from 'sharp';
import { parseSizeFactory } from 'avatars-utils';
import { Face } from './FaceFactory';
import workerpool from 'workerpool';

const minSize = 32;
const maxSize = 512;

const parseSize = parseSizeFactory(minSize, maxSize);

const renderToBuffer = (face: Face): Promise<Buffer> =>
  sharp(face.eyes)
    .composite([{ input: face.mouth }, { input: face.nose }])
    .flatten({ background: face.color })
    .resize(parseSize(face.size))
    .toFormat(face.format as keyof FormatEnum, { quality: 80 })
    .toBuffer();


workerpool.worker({
  renderToBuffer,
});
