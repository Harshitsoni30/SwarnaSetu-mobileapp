import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

export type HomeTab = 'home' | 'girvi' | 'settings';

type BottomTabsProps = {
  selected: HomeTab;
  onSelect: (tab: HomeTab) => void;
};

const TABS: { id: HomeTab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'girvi', label: 'Girvi' },
  { id: 'settings', label: 'Settings' },
];

export function BottomTabs({ selected, onSelect }: BottomTabsProps) {
  return (
    <View style={styles.bar}>
      {TABS.map(tab => {
        const active = tab.id === selected;
        const color = active ? colors.primary : '#8A8478';
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            key={tab.id}
            onPress={() => onSelect(tab.id)}
            style={styles.item}>
            <TabIcon color={color} name={tab.id} />
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function TabIcon({ name, color }: { name: HomeTab; color: string }) {
  if (name === 'home') {
    return <HomeIcon color={color} />;
  }
  if (name === 'girvi') {
    return <GirviIcon color={color} />;
  }
  return <SettingsIcon color={color} />;
}

function HomeIcon({ color }: { color: string }) {
  return (
    <View style={styles.icon}>
      <View style={[styles.roof, { borderColor: color }]} />
      <View style={[styles.house, { borderColor: color }]} />
    </View>
  );
}

function GirviIcon({ color }: { color: string }) {
  return (
    <View style={[styles.calc, { borderColor: color }]}>
      <View style={[styles.calcBar, { backgroundColor: color }]} />
    </View>
  );
}

function SettingsIcon({ color }: { color: string }) {
  return (
    <View style={styles.icon}>
      {[0, 45, 90, 135].map(angle => (
        <View
          key={angle}
          style={[styles.tooth, { backgroundColor: color, transform: [{ rotate: `${angle}deg` }] }]}
        />
      ))}
      <View style={styles.gearHole}>
        <View style={[styles.gearRing, { borderColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E4E0D8',
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingBottom: 10,
    paddingTop: 8,
  },
  item: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  icon: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  roof: {
    borderLeftWidth: 2,
    borderTopWidth: 2,
    height: 12,
    marginTop: 8,
    transform: [{ rotate: '45deg' }],
    width: 12,
  },
  house: {
    borderWidth: 2,
    height: 9,
    marginTop: -5,
    width: 14,
  },
  calc: {
    borderRadius: 4,
    borderWidth: 2,
    height: 20,
    justifyContent: 'flex-end',
    padding: 3,
    width: 18,
  },
  calcBar: {
    height: 2,
    marginBottom: 2,
  },
  tooth: {
    height: 22,
    position: 'absolute',
    width: 2,
  },
  gearHole: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    height: 14,
    justifyContent: 'center',
    width: 14,
  },
  gearRing: {
    borderRadius: 4,
    borderWidth: 2,
    height: 8,
    width: 8,
  },
});
