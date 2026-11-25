import { Image } from 'react-native';

import logo from '../assets/swarnasetu-logo.webp';
import { imageSource } from './imageSource';

type BrandLogoProps = {
  width?: number;
};

export function BrandLogo({ width = 280 }: BrandLogoProps) {
  return (
    <Image
      accessibilityLabel="SwarnaSetu"
      resizeMode="contain"
      source={imageSource(logo)}
      style={{ width, height: Math.round(width * 0.86) }}
    />
  );
}
