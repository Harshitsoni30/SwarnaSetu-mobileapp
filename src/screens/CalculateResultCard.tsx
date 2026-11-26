import { Image, StyleSheet, Text, View } from 'react-native';

import bangles from '../assets/floral-bangles.webp';
import { imageSource } from '../components/imageSource';
import { formatTenure, type Tenure } from '../interest/calculate';

const money = new Intl.NumberFormat('en-IN', {
  currency: 'INR',
  maximumFractionDigits: 0,
  style: 'currency',
});

type CalculateResultProps = {
  amount: number;
  rate: number;
  tenure: Tenure;
};

export function CalculateResultCard({ amount, rate, tenure }: CalculateResultProps) {
  return (
    <View style={styles.card}>
      <View style={styles.copy}>
        <Text style={styles.label}>Loan Amount</Text>
        <Text style={styles.value}>{money.format(amount)}</Text>
        <View style={styles.line} />
        <Text style={styles.label}>Interest Rate (per month)</Text>
        <Text style={styles.value}>{rate.toFixed(2)}%</Text>
        <View style={styles.line} />
        <Text style={styles.label}>Loan Tenure</Text>
        <Text style={styles.tenure}>{formatTenure(tenure)}</Text>
      </View>
      <Image accessibilityLabel="Gold bangles" resizeMode="contain" source={imageSource(bangles)} style={styles.bangles} />
    </View>
  );
}

export function rupees(amount: number): string {
  return money.format(amount);
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#033726',
    borderRadius: 18,
    flexDirection: 'row',
    paddingBottom: 18,
    paddingLeft: 18,
    paddingRight: 8,
    paddingTop: 18,
  },
  copy: {
    flex: 1,
  },
  label: {
    color: '#FFFFFF',
    fontFamily: 'Georgia',
    fontSize: 15,
  },
  value: {
    color: '#FFFFFF',
    fontFamily: 'Georgia',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 4,
  },
  tenure: {
    color: '#FFFFFF',
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  line: {
    backgroundColor: 'rgba(255,255,255,0.45)',
    height: 1,
    marginBottom: 12,
    marginRight: 8,
    marginTop: 12,
  },
  bangles: {
    backgroundColor: 'transparent',
    height: 168,
    width: 148,
  },
});
