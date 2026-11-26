import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomTabs, type HomeTab } from '../components/BottomTabs';
import { Screen, TextLink } from '../components/Screen';
import { colors } from '../theme';
import { CalculateScreen } from './CalculateScreen';
import { GirviLoanScreen } from './GirviLoanScreen';

type HomeScreenProps = {
  topInset: number;
  onSignOut?: () => void;
};

export function HomeScreen({ topInset, onSignOut }: HomeScreenProps) {
  const [tab, setTab] = useState<HomeTab>('home');

  return (
    <View style={styles.screen} testID="screen">
      <View style={styles.content}>
        <View style={[styles.fill, tab === 'home' ? null : styles.hidden]}>
          <CalculateScreen topInset={topInset} />
        </View>
        {tab === 'girvi' ? <GirviLoanScreen topInset={topInset} /> : null}
        {tab === 'settings' ? (
          <BlankTab title="Settings" topInset={topInset}>
            {onSignOut ? <TextLink label="Sign out" onPress={onSignOut} /> : null}
          </BlankTab>
        ) : null}
      </View>
      <BottomTabs onSelect={setTab} selected={tab} />
    </View>
  );
}

function BlankTab({
  title,
  topInset,
  children,
}: {
  title: string;
  topInset: number;
  children?: ReactNode;
}) {
  return (
    <Screen title={title} topInset={topInset}>
      {children}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
});
