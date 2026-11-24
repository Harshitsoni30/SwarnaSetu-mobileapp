import { Text, StyleSheet } from 'react-native';

import { Screen, TextLink } from '../components/Screen';
import { colors } from '../theme';

type HomeScreenProps = {
  topInset: number;
  onSignOut?: () => void;
};

export function HomeScreen({ topInset, onSignOut }: HomeScreenProps) {
  return (
    <Screen title="SwarnaSetu" topInset={topInset}>
      <Text style={styles.title}>SwarnaSetu</Text>
      {onSignOut ? <TextLink label="Sign out" onPress={onSignOut} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '600',
  },
});
