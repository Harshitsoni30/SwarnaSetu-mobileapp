import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import bag from '../assets/girvi-money-bag.png';
import { imageSource } from '../components/imageSource';
import { formatRupees, type GirviResult } from '../girvi/calculate';
import { colors } from '../theme';

const DISCLAIMER =
  'Estimated value based on entered market rate and purity. Final loan amount may vary based on shop valuation.';

type GirviResultViewProps = {
  result: GirviResult;
  onRecalculate: () => void;
  onShare: () => void;
  shareMessage: string | null;
};

export function GirviResultView({ result, onRecalculate, onShare, shareMessage }: GirviResultViewProps) {
  return (
    <View>
      <Text style={styles.title}>Loan Calculation Result</Text>
      <Text style={styles.subtitle}>Here is the loan amount for the given jewellery.</Text>
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroLabel}>Loan Amount to Give</Text>
          <Text style={styles.heroValue}>{formatRupees(result.loanAmount)}</Text>
        </View>
        <Image accessibilityLabel="Money bag" resizeMode="contain" source={imageSource(bag)} style={styles.bag} />
      </View>
      <View style={styles.details}>
        <Text style={styles.detailsTitle}>Calculation Details</Text>
        <Row label="Jewellery Type" value={result.metalLabel} />
        <Row label="Weight" value={result.weightLabel} />
        <Row label="Purity" value={result.purityLabel} />
        <Row label="Market Rate" value={result.rateLabel} />
        <View style={styles.row}>
          <View style={styles.valueCopy}>
            <Text style={styles.label}>Actual Jewellery Value</Text>
            <Text style={styles.note}>Weight × purity × rate</Text>
          </View>
          <Text style={styles.value}>{formatRupees(result.actualValue)}</Text>
        </View>
        <Row label="Loan Percentage" value={result.loanPercentLabel} />
        <View style={styles.finalRow}>
          <Text style={styles.finalLabel}>Final Loan Amount</Text>
          <Text style={styles.finalValue}>{formatRupees(result.loanAmount)}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={onRecalculate} style={styles.ghost}>
          <Text style={styles.ghostText}>Recalculate</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onShare} style={styles.share}>
          <Text style={styles.shareText}>Share</Text>
        </Pressable>
      </View>
      {shareMessage ? <Text style={styles.shareMessage}>{shareMessage}</Text> : null}
      <Text style={styles.disclaimer}>{DISCLAIMER}</Text>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontFamily: 'Georgia',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#5C675F',
    fontSize: 14,
    marginBottom: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  hero: {
    alignItems: 'center',
    backgroundColor: '#033726',
    borderRadius: 18,
    flexDirection: 'row',
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 8,
    paddingTop: 16,
  },
  heroCopy: { flex: 1 },
  heroLabel: { color: '#FFFFFF', fontFamily: 'Georgia', fontSize: 15 },
  heroValue: { color: '#FFFFFF', fontFamily: 'Georgia', fontSize: 32, fontWeight: '700', marginTop: 4 },
  bag: { height: 104, width: 150 },
  details: {
    backgroundColor: '#FFFCF8',
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  detailsTitle: { color: colors.text, fontFamily: 'Georgia', fontSize: 16, fontWeight: '700', paddingVertical: 6 },
  row: {
    alignItems: 'center',
    borderTopColor: colors.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  valueCopy: { flex: 1, paddingRight: 8 },
  label: { color: colors.text, flex: 1, fontSize: 14 },
  note: { color: '#5C675F', fontSize: 12, marginTop: 2 },
  value: { color: colors.text, flexShrink: 1, fontSize: 14, fontWeight: '700', textAlign: 'right' },
  finalRow: {
    alignItems: 'center',
    backgroundColor: '#F3E4BE',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  finalLabel: { color: colors.text, fontFamily: 'Georgia', fontSize: 15, fontWeight: '700' },
  finalValue: { color: colors.text, fontFamily: 'Georgia', fontSize: 16, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 16 },
  ghost: {
    alignItems: 'center',
    backgroundColor: '#FFFCF8',
    borderColor: colors.gold,
    borderRadius: 30,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 14,
  },
  ghostText: { color: colors.primary, fontFamily: 'Georgia', fontSize: 16, fontWeight: '700' },
  share: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.gold,
    borderRadius: 30,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 14,
  },
  shareText: { color: colors.onPrimary, fontFamily: 'Georgia', fontSize: 16, fontWeight: '700' },
  shareMessage: { color: '#9B1C1C', fontSize: 14, marginTop: 10, textAlign: 'center' },
  disclaimer: { color: '#5C675F', fontSize: 12, lineHeight: 18, marginTop: 12, textAlign: 'center' },
});
