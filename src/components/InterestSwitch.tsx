import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

type Option = {
  id: string;
  label: string;
};

type InterestSwitchProps = {
  options: Option[];
  selected: string;
  onSelect: (id: string) => void;
};

export function InterestSwitch({ options, selected, onSelect }: InterestSwitchProps) {
  return (
    <View style={styles.track}>
      {options.map(option => {
        const active = option.id === selected;
        return (
          <Pressable
            accessibilityRole="button"
            key={option.id}
            onPress={() => onSelect(option.id)}
            style={[styles.choice, active ? styles.choiceOn : null]}>
            <Text style={active ? styles.choiceTextOn : styles.choiceText}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: '#FFFCF8',
    borderColor: colors.gold,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 4,
  },
  choice: {
    alignItems: 'center',
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    minHeight: 36,
  },
  choiceOn: {
    backgroundColor: colors.primary,
  },
  choiceText: {
    color: colors.text,
    fontFamily: 'Georgia',
    fontSize: 14,
    fontWeight: '700',
  },
  choiceTextOn: {
    color: colors.onPrimary,
    fontFamily: 'Georgia',
    fontSize: 14,
    fontWeight: '700',
  },
});
