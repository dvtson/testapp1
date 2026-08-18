import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { ApplicationContext } from '../../../context/ApplicationContext';
import { colors, spacing, radius, typography } from '../../../constants/theme';
import { Money, CalendarBlank, Target, CaretLeft } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MOCK_INTEREST_RATE } from '../../../constants/loanConfig';
import ProgressStepper from '../../../components/ProgressStepper';
import HotlineButton from '../../../components/HotlineButton';

const LOAN_TERMS = [3, 6, 12, 24, 36];
const LOAN_PURPOSES = ['Tiêu dùng cá nhân', 'Mua nhà', 'Mua xe', 'Kinh doanh', 'Khác'];

export default function LoanApplicationScreen({ navigation }) {
  const { 
    loanAmount, setLoanAmount,
    loanTermMonths, setLoanTermMonths,
    loanPurpose, setLoanPurpose
  } = useContext(ApplicationContext);

  // Tính toán khoản vay (thời gian thực)
  const totalInterest = (loanAmount * MOCK_INTEREST_RATE * (loanTermMonths + 1)) / 2;
  const averageMonthlyInterest = totalInterest / loanTermMonths;
  const monthlyPrincipal = loanAmount / loanTermMonths;
  const estimatedMonthlyPayment = monthlyPrincipal + averageMonthlyInterest;
  const totalPayment = loanAmount + totalInterest;

  const handleNext = () => {
    navigation.navigate('IncomeVerification');
  };

  const renderChip = (label, isSelected, onPress) => (
    <TouchableOpacity 
      key={label}
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} alwaysBounceVertical={true}>
        <LinearGradient
          colors={[colors.darkBgStart, colors.darkBgEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerBackground}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              if (navigation.canGoBack()) navigation.goBack();
            }}
          >
            <CaretLeft size={28} color={colors.surface} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Khoản vay đề nghị</Text>
            <Text style={styles.headerSubtitle}>Tùy chỉnh khoản vay mong muốn</Text>
          </View>
        </LinearGradient>

        <View style={{ marginTop: -80, flex: 1, backgroundColor: colors.appBackground, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 16 }}>
          <ProgressStepper currentStep={3} totalSteps={6} />
          
          <View style={{ paddingHorizontal: spacing.lg }}>
            
            {/* Số tiền vay */}
            <View style={[styles.card, { marginTop: 0 }]}>
          <View style={styles.cardHeader}>
            <Money size={24} color={colors.primaryBlue} weight="fill" />
            <Text style={styles.cardTitle}>Số tiền vay</Text>
          </View>
          
          <Text style={styles.amountText}>
            {loanAmount.toLocaleString('vi-VN')} VND
          </Text>
          
          <Slider
            style={styles.slider}
            minimumValue={1000000}
            maximumValue={100000000}
            step={500000}
            value={loanAmount}
            onValueChange={setLoanAmount}
            minimumTrackTintColor={colors.primaryRed}
            maximumTrackTintColor={colors.borderLight}
            thumbTintColor={colors.surface}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabelText}>1 Triệu</Text>
            <Text style={styles.sliderLabelText}>100 Triệu</Text>
          </View>
        </View>

        {/* Kỳ hạn vay */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <CalendarBlank size={24} color={colors.primaryBlue} weight="fill" />
            <Text style={styles.cardTitle}>Kỳ hạn vay (tháng)</Text>
          </View>
          
          <View style={styles.chipGroup}>
            {LOAN_TERMS.map((term) => renderChip(
              term.toString(), 
              loanTermMonths === term, 
              () => setLoanTermMonths(term)
            ))}
          </View>
        </View>

        {/* Mục đích vay */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Target size={24} color={colors.primaryBlue} weight="fill" />
            <Text style={styles.cardTitle}>Mục đích vay</Text>
          </View>
          
          <View style={styles.chipGroup}>
            {LOAN_PURPOSES.map((purpose) => renderChip(
              purpose, 
              loanPurpose.startsWith(purpose) && (purpose !== 'Khác' || !LOAN_PURPOSES.slice(0, 4).includes(loanPurpose)), 
              () => setLoanPurpose(purpose)
            ))}
          </View>

          {(!LOAN_PURPOSES.slice(0, 4).includes(loanPurpose) && loanPurpose !== '') && (
            <TextInput
              style={styles.input}
              placeholder="Nhập mục đích vay cụ thể..."
              placeholderTextColor={colors.placeholderText}
              value={loanPurpose === 'Khác' ? '' : loanPurpose}
              onChangeText={(text) => setLoanPurpose(text)}
            />
          )}
        </View>

        {/* BỘ TÍNH TOÁN KHOẢN VAY */}
        <View style={styles.calculatorCard}>
          <Text style={styles.calculatorTitle}>Dự toán khoản vay</Text>
          
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Trả góp hàng tháng (ước tính):</Text>
            <Text style={styles.calcValueHighlight}>{Math.round(estimatedMonthlyPayment).toLocaleString('vi-VN')} đ</Text>
          </View>
          
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Tổng lãi phải trả (ước tính):</Text>
            <Text style={styles.calcValue}>{Math.round(totalInterest).toLocaleString('vi-VN')} đ</Text>
          </View>
          
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Tổng số tiền phải trả:</Text>
            <Text style={styles.calcValue}>{Math.round(totalPayment).toLocaleString('vi-VN')} đ</Text>
          </View>

          <Text style={styles.calcNote}>
            * Số liệu chỉ mang tính chất tham khảo, lãi suất thực tế sẽ được thông báo sau khi hồ sơ được duyệt.
          </Text>
        </View>

          </View>
        </View>
      </ScrollView>

      <HotlineButton style={{ position: 'absolute', bottom: 120, right: spacing.lg }} />

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Make room for fixed button
  },
  headerBackground: {
    height: 250,
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: spacing.sm,
    padding: spacing.sm,
    zIndex: 10,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  headerTitle: {
    fontFamily: typography.bold,
    fontSize: 24,
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.lightAccentBlue,
    opacity: 0.9,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontFamily: typography.semiBold,
    fontSize: 16,
    color: colors.headingText,
    marginLeft: spacing.sm,
  },
  amountText: {
    fontFamily: typography.bold,
    fontSize: 28,
    color: colors.primaryBlue,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  sliderLabelText: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: colors.secondaryTextAlt,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    borderColor: colors.primaryBlue,
    backgroundColor: colors.lightAccentBlue,
  },
  chipText: {
    fontFamily: typography.medium,
    fontSize: 14,
    color: colors.secondaryText,
  },
  chipTextSelected: {
    color: colors.primaryBlue,
  },
  input: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.input,
    padding: spacing.md,
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.headingText,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLighter,
  },
  button: {
    width: '100%',
    backgroundColor: colors.primaryBlue,
    paddingVertical: 16,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: typography.semiBold,
    fontSize: 16,
    color: colors.surface,
  },
});
