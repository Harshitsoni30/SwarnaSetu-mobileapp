import { useState, type ReactNode } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import scales from '../assets/girvi-scales.png';
import { imageSource } from '../components/imageSource';
import { InterestSwitch } from '../components/InterestSwitch';
import type { Metal, RateUnit, WeightUnit } from '../girvi/calculate';
import { colors } from '../theme';

const WEIGHT_UNITS: { id: WeightUnit; label: string }[] = [
  { id: 'gram', label: 'Gram' },
  { id: 'kg', label: 'Kg' },
];

const RATE_UNITS: { id: RateUnit; label: string }[] = [
  { id: 'per10', label: 'Per 10 Gram' },
  { id: 'perGram', label: 'Per Gram' },
  { id: 'perKg', label: 'Per Kg' },
];

type GirviFormProps = {
  metal: Metal;
  weightText: string;
  weightUnit: WeightUnit;
  purityText: string;
  rateText: string;
  rateUnit: RateUnit;
  loanText: string;
  sliderValue: number;
  errorMessage: string | null;
  onMetal: (metal: Metal) => void;
  onWeight: (value: string) => void;
  onWeightUnit: (unit: WeightUnit) => void;
  onPurity: (value: string) => void;
  onRate: (value: string) => void;
  onRateUnit: (unit: RateUnit) => void;
  onLoan: (value: string) => void;
  onCalculate: () => void;
};

export function GirviForm(props: GirviFormProps) {
  return (
    <View>
      <View style={styles.titleRow}>
        <Image
          accessibilityLabel="Gold and silver scales"
          resizeMode="contain"
          source={imageSource(scales)}
          style={styles.scales}
        />
        <View style={styles.titleCopy}>
          <Text style={styles.title}>Girvi Loan Calculator</Text>
          <Text style={styles.subtitle}>Calculate loan amount against gold or silver jewellery.</Text>
        </View>
      </View>
      <InterestSwitch
        onSelect={id => props.onMetal(id as Metal)}
        options={[
          { id: 'gold', label: 'Gold' },
          { id: 'silver', label: 'Silver' },
        ]}
        selected={props.metal}
      />
      <Field label="Weight" onChangeText={props.onWeight} value={props.weightText}>
        <UnitSelect
          label="Weight unit"
          onSelect={id => props.onWeightUnit(id as WeightUnit)}
          options={WEIGHT_UNITS}
          selected={props.weightUnit}
        />
      </Field>
      <Field label="Purity" onChangeText={props.onPurity} suffix="%" value={props.purityText} />
      <Field label="Market Rate (Bhav)" onChangeText={props.onRate} prefix="₹" value={props.rateText}>
        <UnitSelect
          label="Rate unit"
          onSelect={id => props.onRateUnit(id as RateUnit)}
          options={RATE_UNITS}
          selected={props.rateUnit}
        />
      </Field>
      <Field label="Loan Percentage" onChangeText={props.onLoan} suffix="%" value={props.loanText} />
      <LoanSlider onChange={props.onLoan} value={props.sliderValue} />
      {props.errorMessage ? <Text style={styles.error}>{props.errorMessage}</Text> : null}
      <Pressable accessibilityRole="button" onPress={props.onCalculate} style={styles.button}>
        <Text style={styles.buttonText}>Calculate Loan Amount</Text>
      </Pressable>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  prefix,
  suffix,
  children,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  prefix?: string;
  suffix?: string;
  children?: ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputRow}>
        {prefix ? <Text style={styles.affix}>{prefix}</Text> : null}
        <TextInput
          accessibilityLabel={label}
          keyboardType="decimal-pad"
          onChangeText={onChangeText}
          placeholder={label}
          placeholderTextColor="#9A8B74"
          style={styles.input}
          value={value}
        />
        {suffix ? <Text style={styles.affix}>{suffix}</Text> : null}
        {children}
      </View>
    </View>
  );
}

function UnitSelect({
  label,
  selected,
  options,
  onSelect,
}: {
  label: string;
  selected: string;
  options: { id: string; label: string }[];
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find(option => option.id === selected);
  if (current === undefined) {
    return null;
  }
  return (
    <View style={styles.unitWrap}>
      <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={() => setOpen(value => !value)} style={styles.unit}>
        <Text style={styles.unitText}>{current.label}</Text>
      </Pressable>
      {open ? (
        <View style={styles.menu}>
          {options.map(option => (
            <Pressable
              accessibilityRole="button"
              key={option.id}
              onPress={() => {
                onSelect(option.id);
                setOpen(false);
              }}
              style={styles.menuItem}>
              <Text style={styles.unitText}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function LoanSlider({ value, onChange }: { value: number; onChange: (next: string) => void }) {
  const [width, setWidth] = useState(1);
  return (
    <Pressable
      accessibilityLabel="Loan percentage slider"
      accessibilityRole="adjustable"
      onLayout={event => setWidth(Math.max(1, event.nativeEvent.layout.width))}
      onPress={event => {
        const next = Math.round((event.nativeEvent.locationX / width) * 100);
        onChange(String(Math.min(100, Math.max(0, next))));
      }}
      style={styles.slider}>
      <View style={[styles.sliderFill, { width: `${value}%` }]} />
      <View style={[styles.thumb, { left: `${value}%` }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  titleRow: { alignItems: 'center', flexDirection: 'row', gap: 10, marginBottom: 16 },
  scales: { height: 72, width: 108 },
  titleCopy: { flex: 1 },
  title: { color: colors.text, fontFamily: 'Georgia', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#5C675F', fontSize: 14, marginTop: 6 },
  field: { marginTop: 14 },
  fieldLabel: { color: colors.text, fontFamily: 'Georgia', fontSize: 14, fontWeight: '700', marginBottom: 6 },
  inputRow: {
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
  affix: { color: '#5C675F', marginRight: 6 },
  unitWrap: { position: 'relative' },
  unit: { borderColor: colors.line, borderRadius: 8, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 6 },
  unitText: { color: colors.text, fontSize: 12 },
  menu: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.gold,
    borderRadius: 8,
    borderWidth: 1,
    position: 'absolute',
    right: 0,
    top: 36,
    zIndex: 2,
  },
  menuItem: { paddingHorizontal: 10, paddingVertical: 8 },
  slider: { backgroundColor: colors.line, borderRadius: 999, height: 6, marginTop: 12 },
  sliderFill: { backgroundColor: colors.primary, borderRadius: 999, height: 6 },
  thumb: {
    backgroundColor: colors.onPrimary,
    borderColor: colors.primary,
    borderRadius: 8,
    borderWidth: 2,
    height: 16,
    marginLeft: -8,
    marginTop: -11,
    position: 'absolute',
    width: 16,
  },
  error: { color: '#9B1C1C', fontSize: 14, marginTop: 12, textAlign: 'center' },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.gold,
    borderRadius: 30,
    borderWidth: 1,
    marginTop: 18,
    paddingVertical: 14,
  },
  buttonText: { color: colors.onPrimary, fontFamily: 'Georgia', fontSize: 16, fontWeight: '700' },
});
