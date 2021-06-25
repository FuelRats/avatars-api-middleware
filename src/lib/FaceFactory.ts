import { Hash, hashFactory, sumAndDiff } from 'avatars-utils';
import UUID from 'pure-uuid';
import { eyeImages, noseImages, mouthImages, imageFilePaths } from './imageFiles';
import { resolveQueryParam } from './routeTools';

export interface Face {
  color: string;
  eyes: string;
  nose: string;
  mouth: string;
  size: string;
  format: string;
}
export type FaceConstructor = {
  [K in keyof Face]?: string | string[];
};

export const faceParts: (keyof FaceConstructor)[] = ['eyes', 'nose', 'mouth'];

export class FaceFactory {
  private colorHash: Hash<string>;
  private eyesHash: Hash<string>;
  private noseHash: Hash<string>;
  private mouthHash: Hash<string>;
  private seed?: string;

  constructor(
    colors: string[],
    eyes: string[],
    noses: string[],
    mouths: string[],
  ) {
    this.colorHash = new Hash(colors);
    this.eyesHash = new Hash(eyes);
    this.noseHash = new Hash(noses);
    this.mouthHash = new Hash(mouths, hashFactory(sumAndDiff));
  }

  public generate(seed: string, size: string, format: string): Face {
    return {
      color: this.colorHash.get(seed),
      eyes: this.eyesHash.get(seed),
      nose: this.noseHash.get(seed),
      mouth: this.mouthHash.get(seed),
      size,
      format,
    };
  }

  public define(query: FaceConstructor): Face {
    this.seed = null;

    const face = {
      color: this.getColor(resolveQueryParam(query.color)),
      size: resolveQueryParam(query.size, '512'),
      format: resolveQueryParam(query.format, 'webp'),
    } as Face;

    faceParts.forEach(type => {
      face[type] = this.getFacePart(
        type,
        resolveQueryParam(query[type], '*'),
      );
    });

    return face;
  }

  private getColor(color: string) {
    if (!color || color === '*') {
      this.seed ??= (new UUID(4)).toString();
      return this.colorHash.get(this.seed);
    }

    return color.startsWith('#') ? color : `#${color}`;
  }

  private getFacePart(type: keyof Face, name: string) {
    const paths = imageFilePaths(type);

    switch (name) {
      case 'x':
        return '';

      case '*':
        this.seed ??= (new UUID(4)).toString();
        return this[`${type}Hash`].get(this.seed);

      default:
        return paths.find(path => Boolean(path.match(name))) ?? paths[0];
    }
  }
}

const defaultColors = [
  '#81bef1',
  '#ad8bf2',
  '#bff288',
  '#de7878',
  '#a5aac5',
  '#6ff2c5',
  '#f0da5e',
  '#eb5972',
  '#f6be5d',
];

export default new FaceFactory(
  defaultColors,
  eyeImages,
  noseImages,
  mouthImages,
);
