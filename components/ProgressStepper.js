import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../constants/theme';

export default function ProgressStepper({ currentStep, totalSteps = 6 }) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.stepText}>
        Bước {currentStep}/{totalSteps}
      </Text>
      <View style={styles.barBackground}>
        <View 
          style={[
            styles.barFill, 
            { width: `${progressPercentage}%` }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.appBackground,
  },
  stepText: {
    fontFamily: typography.semiBold,
    fontSize: 14,
    color: colors.primaryBlue,
    marginBottom: spacing.xs,
  },
  barBackground: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: radius.full,
    width: '100%',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primaryBlue,
    borderRadius: radius.full,
  },
});
