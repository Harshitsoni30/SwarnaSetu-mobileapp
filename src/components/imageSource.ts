import type { ImageSourcePropType } from 'react-native';

export function imageSource(asset: string | number): ImageSourcePropType {
  if (typeof asset === 'string') {
    return { uri: asset };
  }
  return asset;
}
