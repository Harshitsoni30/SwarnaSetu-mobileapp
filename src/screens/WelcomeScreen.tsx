import { ImageBackground, StyleSheet, View } from 'react-native';

import photo from '../assets/gold-bangles.jpg';
import { BrandLogo } from '../components/BrandLogo';
import { imageSource } from '../components/imageSource';
import { PrimaryButton } from '../components/Screen';
import { WelcomeButton } from '../components/WelcomeButton';

type WelcomeScreenProps = {
  topInset: number;
  onLogin: () => void;
  onRegister: () => void;
};

export function WelcomeScreen({ topInset, onLogin, onRegister }: WelcomeScreenProps) {
  return (
    <ImageBackground
      accessibilityLabel="Gold bangles"
      resizeMode="cover"
      source={imageSource(photo)}
      style={[styles.photo, { paddingTop: topInset + 20 }]}
      testID="welcome">
      <View style={styles.logoCard}>
        <BrandLogo width={200} />
      </View>
      <View style={styles.actions}>
        <WelcomeButton label="Login" onPress={onLogin} />
        <PrimaryButton label="Register" onPress={onRegister} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  photo: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  logoCard: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actions: {
    backgroundColor: 'rgba(14, 35, 68, 0.42)',
    borderRadius: 24,
    gap: 12,
    padding: 16,
  },
});
