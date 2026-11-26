import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { parseDate } from '../interest/calculate';
import { colors } from '../theme';
import { maskDate } from './dateMask';

const ROW = 36;
const YEAR_START = 1970;
const YEAR_END = 2100;

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

type DateParts = {
  day: number;
  month: number;
  year: number;
};

export function DateField({ label, value, onChange }: DateFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          accessibilityLabel={label}
          keyboardType="number-pad"
          onChangeText={text => onChange(maskDate(text, value))}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#9A8B74"
          style={styles.input}
          value={value}
        />
        <Pressable accessibilityLabel={`Open ${label} picker`} accessibilityRole="button" onPress={() => setOpen(true)}>
          <CalendarIcon />
        </Pressable>
      </View>
      <Modal animationType="fade" onRequestClose={() => setOpen(false)} transparent visible={open}>
        <Pressable accessibilityLabel="Close date picker" onPress={() => setOpen(false)} style={styles.backdrop}>
          <Pressable onPress={() => undefined} style={styles.sheet}>
            <DateWheels
              onClose={() => setOpen(false)}
              onConfirm={next => {
                onChange(next);
                setOpen(false);
              }}
              value={value}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function DateWheels({
  value,
  onConfirm,
  onClose,
}: {
  value: string;
  onConfirm: (next: string) => void;
  onClose: () => void;
}) {
  const initial = dateParts(value);
  const [day, setDay] = useState(initial.day);
  const [month, setMonth] = useState(initial.month);
  const [year, setYear] = useState(initial.year);
  const days = Array.from({ length: daysInMonth(month, year) }, (_, index) => index + 1);
  const chosenDay = Math.min(day, days.length);

  return (
    <View>
      <View style={styles.wheels}>
        <View pointerEvents="none" style={styles.band} />
        <Wheel items={days} label="Day" onIndex={index => setDay(index + 1)} selected={chosenDay - 1} />
        <Wheel
          items={Array.from({ length: 12 }, (_, index) => index + 1)}
          label="Month"
          onIndex={index => setMonth(index + 1)}
          selected={month - 1}
        />
        <Wheel
          items={Array.from({ length: YEAR_END - YEAR_START + 1 }, (_, index) => YEAR_START + index)}
          label="Year"
          onIndex={index => setYear(YEAR_START + index)}
          selected={year - YEAR_START}
        />
      </View>
      <Pressable
        accessibilityLabel="Done"
        accessibilityRole="button"
        onPress={() => onConfirm(formatParts(chosenDay, month, year))}
        style={styles.done}>
        <Text style={styles.doneText}>Done</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={onClose}>
        <Text style={styles.cancel}>Cancel</Text>
      </Pressable>
    </View>
  );
}

function Wheel({
  items,
  label,
  selected,
  onIndex,
}: {
  items: number[];
  label: string;
  selected: number;
  onIndex: (index: number) => void;
}) {
  const list = useRef<ScrollView>(null);
  const skipAlign = useRef(false);
  const aligned = useRef(false);
  const offsetY = useRef(selected * ROW);
  const current = useRef(selected);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    current.current = selected;
  }, [selected]);

  useEffect(() => {
    if (skipAlign.current) {
      skipAlign.current = false;
      return;
    }
    list.current?.scrollTo({ y: current.current * ROW, animated: false });
  }, [selected, items.length]);

  useEffect(() => {
    const id = setTimeout(() => {
      aligned.current = true;
    }, 60);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  function selectAt(offset: number) {
    const next = Math.min(items.length - 1, Math.max(0, Math.round(offset / ROW)));
    if (next === current.current) {
      return;
    }
    skipAlign.current = true;
    current.current = next;
    onIndex(next);
  }

  function follow(offset: number) {
    if (!aligned.current) {
      return;
    }
    offsetY.current = offset;
    selectAt(offset);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      const snapped = Math.min(items.length - 1, Math.max(0, Math.round(offsetY.current / ROW)));
      const target = snapped * ROW;
      if (Math.abs(offsetY.current - target) > 1) {
        offsetY.current = target;
        list.current?.scrollTo({ y: target, animated: false });
      }
      selectAt(target);
    }, 80);
  }

  return (
    <View style={styles.column}>
      <Text style={styles.columnLabel}>{label}</Text>
      <ScrollView
        contentContainerStyle={styles.wheelPad}
        onScroll={event => follow(event.nativeEvent.contentOffset.y)}
        ref={list}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToInterval={ROW}
        style={styles.wheel}>
        {items.map((item, index) => (
          <Pressable
            accessibilityLabel={`${label} ${item}`}
            key={item}
            onPress={() => {
              aligned.current = true;
              offsetY.current = index * ROW;
              selectAt(index * ROW);
              list.current?.scrollTo({ y: index * ROW, animated: true });
            }}
            style={styles.cell}>
            <Text style={index === selected ? styles.selected : styles.idle}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function CalendarIcon() {
  return (
    <View style={styles.icon}>
      <View style={styles.iconHeader} />
      <View style={styles.iconGrid}>
        <View style={styles.iconDot} />
        <View style={styles.iconDot} />
        <View style={styles.iconDot} />
        <View style={styles.iconDot} />
      </View>
    </View>
  );
}

function dateParts(value: string): DateParts {
  const parsed = parseDate(value);
  const date = parsed === null ? new Date() : new Date(parsed);
  if (parsed === null) {
    return { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() };
  }
  return { day: date.getUTCDate(), month: date.getUTCMonth() + 1, year: date.getUTCFullYear() };
}

function daysInMonth(month: number, year: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function formatParts(day: number, month: number, year: number): string {
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
}

const styles = StyleSheet.create({
  field: { marginBottom: 14 },
  label: { color: colors.text, fontFamily: 'Georgia', fontSize: 14, fontWeight: '700', marginBottom: 6 },
  row: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: colors.gold,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 46,
    paddingHorizontal: 12,
  },
  input: { color: colors.text, flex: 1, fontFamily: 'Georgia', fontSize: 16, paddingVertical: 12 },
  icon: { borderColor: colors.primary, borderRadius: 3, borderWidth: 1.5, height: 18, width: 18 },
  iconHeader: { backgroundColor: colors.primary, height: 4 },
  iconGrid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', paddingTop: 2 },
  iconDot: { backgroundColor: colors.primary, borderRadius: 1, height: 3, marginTop: 2, width: 3 },
  backdrop: { alignItems: 'center', backgroundColor: 'rgba(22,54,44,0.45)', flex: 1, justifyContent: 'center' },
  sheet: { backgroundColor: '#FFFFFF', borderRadius: 18, paddingBottom: 12, paddingTop: 8, width: 320 },
  wheels: { flexDirection: 'row', height: ROW * 5 + 28, justifyContent: 'space-evenly' },
  band: {
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: 1,
    borderTopColor: '#E6E6E6',
    borderTopWidth: 1,
    height: ROW,
    left: 16,
    position: 'absolute',
    right: 16,
    top: 28 + ROW * 2,
  },
  column: { flex: 1 },
  columnLabel: { color: '#8A8478', fontSize: 12, height: 28, textAlign: 'center' },
  wheel: { height: ROW * 5 },
  wheelPad: { paddingVertical: ROW * 2 },
  cell: { alignItems: 'center', height: ROW, justifyContent: 'center' },
  selected: { color: '#1A1A1A', fontSize: 22, fontWeight: '700' },
  idle: { color: '#C8C8C8', fontSize: 18 },
  done: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 12,
  },
  doneText: { color: colors.onPrimary, fontFamily: 'Georgia', fontSize: 16, fontWeight: '700' },
  cancel: { color: '#8A8478', fontSize: 14, paddingVertical: 10, textAlign: 'center' },
});
