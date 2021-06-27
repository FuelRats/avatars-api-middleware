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
  id: string;
}

export interface GenerateParams {
  seed?: string | string[];
  size?: string | string[];
  format?: string | string[];
}

export type DefineParams = {
  [K in keyof Face]?: string | string[];
};


export const faceParts: (keyof DefineParams)[] = ['eyes', 'nose', 'mouth'];

export class FaceFactory {
  public defaultFormat = 'webp';
  public defaultSize = '512'; // Intentionally string.

  private colorHash: Hash<string>;
  private eyesHash: Hash<string>;
  private noseHash: Hash<string>;
  private mouthHash: Hash<string>;
  private seedVal?: string;

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

  public generate(params: GenerateParams): Face {
    this.seedVal = undefined;

    const seed = resolveQueryParam(params.seed) ?? this.seed;

    const face = {
      color: this.colorHash.get(seed),
      eyes: this.eyesHash.get(seed),
      nose: this.noseHash.get(seed),
      mouth: this.mouthHash.get(seed),
      size: resolveQueryParam(params.size) ?? this.defaultSize,
      format: resolveQueryParam(params.format) ?? this.defaultFormat,
    } as Face;

    face.id = Object.values(face).join('.');

    return face;
  }

  public define(params: DefineParams): Face {
    this.seedVal = undefined;

    const face = {
      color: this.getColor(resolveQueryParam(params.color)),
      size: resolveQueryParam(params.size) ?? this.defaultSize,
      format: resolveQueryParam(params.format) ?? this.defaultFormat,
    } as Face;

    faceParts.forEach(type => {
      face[type] = this.getFacePart(
        type,
        resolveQueryParam(params[type]) ?? '*',
      );
    });

    face.id = Object.values(face).join('.');

    return face;
  }

  private getColor(color: string) {
    if (!color || color === '*') {
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
        return this[`${type}Hash`].get(this.seed);

      default:
        return paths.find(path => Boolean(path.match(name))) ?? paths[0];
    }
  }

  private get seed () {
    this.seedVal ??= (new UUID(4)).toString();
    return this.seedVal;
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
