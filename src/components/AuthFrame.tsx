import { useState, type ReactNode } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import eyeIcon from '../assets/icons/eye.svg';
import hero from '../assets/login-hero.jpg';
import { imageSource } from './imageSource';
import { colors } from '../theme';

type AuthFrameProps = {
  topInset: number;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthFrame({ topInset, title, subtitle, children }: AuthFrameProps) {
  return (
    <View style={[styles.screen, { paddingTop: topInset }]} testID="screen">
      <Image accessibilityLabel="SwarnaSetu" resizeMode="cover" source={imageSource(hero)} style={styles.hero} />
      <View style={styles.sheet}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {children}
      </View>
    </View>
  );
}

type AuthFieldProps = {
  icon: string | number;
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'words';
  trailing?: ReactNode;
};

export function AuthField({
  icon,
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  autoCapitalize = 'none',
  trailing,
}: AuthFieldProps) {
  const [hidden, setHidden] = useState(true);
  const reveal = secureTextEntry && trailing == null;

  return (
    <View style={styles.field}>
      <Image source={imageSource(icon)} style={styles.icon} />
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={autoCapitalize}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#9A8B74"
        secureTextEntry={secureTextEntry && hidden}
        style={styles.input}
        value={value}
      />
      {reveal ? (
        <Pressable
          accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          onPress={() => setHidden(current => !current)}>
          <Image source={imageSource(eyeIcon)} style={styles.icon} />
        </Pressable>
      ) : (
        trailing
      )}
    </View>
  );
}

export function AuthLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.linkWrap}>
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  hero: {
    aspectRatio: 682 / 448,
    width: '100%',
  },
  sheet: {
    backgroundColor: colors.background,
    paddingBottom: 28,
    paddingHorizontal: 22,
    paddingTop: 8,
  },
  title: {
    color: colors.text,
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#5C675F',
    fontSize: 14,
    marginBottom: 18,
    marginTop: 8,
    textAlign: 'center',
  },
  field: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#FFFcf8',
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 14,
  },
  icon: {
    height: 20,
    width: 20,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    outlineStyle: 'none',
    outlineWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  linkWrap: {
    marginTop: 18,
  },
  link: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
