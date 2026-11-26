import { useState } from 'react';
import { Image, ScrollView, Share, StyleSheet, View } from 'react-native';

import emblem from '../assets/swarnasetu-emblem.png';
import { imageSource } from '../components/imageSource';
import {
  calculateGirvi,
  type GirviError,
  type GirviResult,
  type Metal,
  type RateUnit,
  type WeightUnit,
} from '../girvi/calculate';
import { colors } from '../theme';
import { GirviForm } from './GirviForm';
import { GirviResultView } from './GirviResultView';

const ERRORS: Record<GirviError, string> = {
  invalid_weight: 'Enter a jewellery weight above zero.',
  invalid_rate: 'Enter a market rate above zero.',
  invalid_purity: 'Enter purity from 0 to 100.',
  invalid_loan: 'Enter a loan percentage from 0 to 100.',
};

type GirviLoanScreenProps = {
  topInset: number;
};

export function GirviLoanScreen({ topInset }: GirviLoanScreenProps) {
  const [metal, setMetal] = useState<Metal>('gold');
  const [weightText, setWeightText] = useState('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('gram');
  const [purityText, setPurityText] = useState('');
  const [rateText, setRateText] = useState('');
  const [rateUnit, setRateUnit] = useState<RateUnit>('per10');
  const [loanText, setLoanText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [result, setResult] = useState<GirviResult | null>(null);

  function selectMetal(next: Metal) {
    setMetal(next);
    setWeightUnit('gram');
    setRateUnit(next === 'silver' ? 'perKg' : 'per10');
  }

  function calculate() {
    const outcome = calculateGirvi({
      metal,
      weight: Number(weightText),
      weightUnit,
      purity: Number(purityText),
      rate: Number(rateText),
      rateUnit,
      loanPercent: Number(loanText),
    });
    if (!outcome.ok) {
      setResult(null);
      setErrorMessage(ERRORS[outcome.error]);
      return;
    }
    setErrorMessage(null);
    setShareMessage(null);
    setResult(outcome.result);
  }

  function share() {
    if (result === null) {
      return;
    }
    Share.share({ message: result.shareText })
      .then(() => setShareMessage(null))
      .catch(() => setShareMessage('Unable to open the share sheet.'));
  }

  const loanNumber = Number(loanText);
  const sliderValue = Number.isFinite(loanNumber) ? Math.min(100, Math.max(0, loanNumber)) : 0;

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]} testID="girvi-header">
        <View style={styles.headerSpacer} />
        <Image accessibilityLabel="SwarnaSetu" resizeMode="contain" source={imageSource(emblem)} style={styles.logo} />
        <View accessibilityLabel="Alerts" style={styles.bell} />
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        {result === null ? (
          <GirviForm
            errorMessage={errorMessage}
            loanText={loanText}
            metal={metal}
            onCalculate={calculate}
            onLoan={setLoanText}
            onMetal={selectMetal}
            onPurity={setPurityText}
            onRate={setRateText}
            onRateUnit={setRateUnit}
            onWeight={setWeightText}
            onWeightUnit={setWeightUnit}
            purityText={purityText}
            rateText={rateText}
            rateUnit={rateUnit}
            sliderValue={sliderValue}
            weightText={weightText}
            weightUnit={weightUnit}
          />
        ) : (
          <GirviResultView
            onRecalculate={() => setResult(null)}
            onShare={share}
            result={result}
            shareMessage={shareMessage}
          />
        )}
      </ScrollView>
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
  headerSpacer: { width: 28 },
  logo: { height: 72, width: 210 },
  bell: { borderColor: colors.onPrimary, borderRadius: 10, borderWidth: 1.5, height: 18, width: 16 },
  body: { paddingBottom: 32, paddingHorizontal: 18, paddingTop: 22 },
});
