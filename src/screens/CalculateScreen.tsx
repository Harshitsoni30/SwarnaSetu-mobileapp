import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import emblem from '../assets/swarnasetu-emblem.png';
import { DateField } from '../components/DateField';
import { InterestSwitch } from '../components/InterestSwitch';
import { imageSource } from '../components/imageSource';
import {
  calculateInterest,
  type CompoundInterval,
  type InterestMode,
  type InterestResult,
} from '../interest/calculate';
import { colors } from '../theme';
import { CalculateResultCard, rupees } from './CalculateResultCard';

const ERRORS = {
  invalid_amount: 'Enter a loan amount above zero.',
  invalid_rate: 'Enter an interest rate of zero or more.',
  invalid_date: 'Enter both dates as DD/MM/YYYY.',
  reversed_date: 'Choose a to date on or after the from date.',
} as const;

type CalculateScreenProps = {
  topInset: number;
  onBack?: () => void;
};

export function CalculateScreen({ topInset, onBack }: CalculateScreenProps) {
  const [amountText, setAmountText] = useState('');
  const [rateText, setRateText] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [mode, setMode] = useState<InterestMode>('simple');
  const [interval, setInterval] = useState<CompoundInterval>('yearly');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<InterestResult | null>(null);

  function calculate() {
    if (!amountText.trim() || !rateText.trim() || !fromDate.trim() || !toDate.trim()) {
      setResult(null);
      setErrorMessage('Enter the loan amount, interest rate, and both dates.');
      return;
    }
    const outcome = calculateInterest({
      amount: Number(amountText),
      monthlyRate: Number(rateText),
      fromDate,
      toDate,
      mode,
      interval,
    });
    if (!outcome.ok) {
      setResult(null);
      setErrorMessage(ERRORS[outcome.error]);
      return;
    }
    setErrorMessage(null);
    setResult(outcome.result);
  }

  return (
    <View style={styles.screen}>
      <Header onBack={onBack} topInset={topInset} />
      <ScrollView contentContainerStyle={styles.body}>
        {result === null ? (
          <Form
            amountText={amountText}
            errorMessage={errorMessage}
            fromDate={fromDate}
            interval={interval}
            mode={mode}
            onCalculate={calculate}
            rateText={rateText}
            setAmountText={setAmountText}
            setFromDate={setFromDate}
            setInterval={setInterval}
            setMode={setMode}
            setRateText={setRateText}
            setToDate={setToDate}
            toDate={toDate}
          />
        ) : (
          <Result
            amount={Number(amountText)}
            onRecalculate={() => setResult(null)}
            rate={Number(rateText)}
            result={result}
          />
        )}
      </ScrollView>
    </View>
  );
}

function Header({ topInset, onBack }: { topInset: number; onBack?: () => void }) {
  return (
    <View style={[styles.header, { paddingTop: topInset + 12 }]} testID="header">
      {onBack ? (
        <Pressable accessibilityLabel="Back" accessibilityRole="button" onPress={onBack}>
          <Text style={styles.headerIcon}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.headerSpacer} />
      )}
      <Image accessibilityLabel="SwarnaSetu" resizeMode="contain" source={imageSource(emblem)} style={styles.logo} />
      <View accessibilityLabel="Alerts" style={styles.bell} />
    </View>
  );
}

type FormProps = {
  amountText: string;
  rateText: string;
  fromDate: string;
  toDate: string;
  mode: InterestMode;
  interval: CompoundInterval;
  errorMessage: string | null;
  setAmountText: (value: string) => void;
  setRateText: (value: string) => void;
  setFromDate: (value: string) => void;
  setToDate: (value: string) => void;
  setMode: (value: InterestMode) => void;
  setInterval: (value: CompoundInterval) => void;
  onCalculate: () => void;
};

function Form(props: FormProps) {
  return (
    <View>
      <Text style={styles.title}>Interest Calculator</Text>
      <Text style={styles.subtitle}>Calculate your gold loan interest and total repayment easily.</Text>
      <Field label="Loan Amount" onChangeText={props.setAmountText} suffix="₹" value={props.amountText} />
      <Field label="Interest Rate (per month)" onChangeText={props.setRateText} suffix="%" value={props.rateText} />
      <Text style={styles.fieldLabel}>Interest type</Text>
      <InterestSwitch
        onSelect={id => props.setMode(id as InterestMode)}
        options={[
          { id: 'simple', label: 'Simple' },
          { id: 'compound', label: 'Compound' },
        ]}
        selected={props.mode}
      />
      {props.mode === 'compound' ? (
        <View style={styles.interval}>
          <InterestSwitch
            onSelect={id => props.setInterval(id as CompoundInterval)}
            options={[
              { id: 'yearly', label: 'Yearly' },
              { id: 'quarterly', label: 'Quarterly' },
              { id: 'half', label: '6 months' },
            ]}
            selected={props.interval}
          />
        </View>
      ) : null}
      <DateField label="From date" onChange={props.setFromDate} value={props.fromDate} />
      <DateField label="To date" onChange={props.setToDate} value={props.toDate} />
      {props.errorMessage ? <Text style={styles.error}>{props.errorMessage}</Text> : null}
      <Pressable accessibilityRole="button" onPress={props.onCalculate} style={styles.button}>
        <Text style={styles.buttonText}>Calculate Interest →</Text>
      </Pressable>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  suffix,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  suffix?: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          accessibilityLabel={label}
          onChangeText={onChangeText}
          placeholder={label}
          placeholderTextColor="#9A8B74"
          style={styles.input}
          value={value}
        />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

function Result({
  amount,
  rate,
  result,
  onRecalculate,
}: {
  amount: number;
  rate: number;
  result: InterestResult;
  onRecalculate: () => void;
}) {
  return (
    <View>
      <Text style={styles.title}>Interest Calculation Result</Text>
      <Text style={styles.subtitle}>Here is the breakup of your gold loan.</Text>
      <CalculateResultCard amount={amount} rate={rate} tenure={result.tenure} />
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Calculation Summary</Text>
        <Summary label="Interest Amount" value={rupees(result.interest)} />
        <Summary label="Total Payable Amount" value={rupees(result.total)} />
      </View>
      <Pressable accessibilityRole="button" onPress={onRecalculate} style={styles.button}>
        <Text style={styles.buttonText}>Recalculate</Text>
      </Pressable>
    </View>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  header: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderBottomColor: colors.gold,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 18,
    paddingHorizontal: 14,
  },
  headerIcon: { color: colors.onPrimary, fontSize: 28, width: 28 },
  headerSpacer: { width: 28 },
  logo: { height: 72, width: 210 },
  bell: { borderColor: colors.onPrimary, borderRadius: 10, borderWidth: 1.5, height: 18, width: 16 },
  body: { paddingBottom: 32, paddingHorizontal: 18, paddingTop: 22 },
  title: { color: colors.text, fontFamily: 'Georgia', fontSize: 26, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: '#5C675F', fontSize: 14, marginBottom: 18, marginTop: 8, textAlign: 'center' },
  field: { marginBottom: 14 },
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
  suffix: { color: '#5C675F' },
  interval: { marginTop: 12 },
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
  summary: {
    backgroundColor: colors.background,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  summaryTitle: { color: colors.text, fontFamily: 'Georgia', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  summaryRow: {
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  summaryLabel: { color: colors.text, fontSize: 14 },
  summaryValue: { color: colors.text, fontSize: 14, fontWeight: '700' },
});
