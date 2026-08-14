import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { ApplicationContext } from '../context/ApplicationContext';
import { colors, spacing, radius, typography } from '../constants/theme';
import { Wallet, Bank, FileText, UploadSimple, Briefcase } from 'phosphor-react-native';
import ProgressStepper from '../components/ProgressStepper';
import HotlineButton from '../components/HotlineButton';

export default function IncomeVerificationScreen({ navigation }) {
  const { 
    monthlyIncome, setMonthlyIncome,
    salaryAccountType, setSalaryAccountType,
    incomeProofFile, setIncomeProofFile,
    assetsDescription, setAssetsDescription
  } = useContext(ApplicationContext);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setIncomeProofFile(result.assets[0]);
      }
    } catch (err) {
      console.log('Error picking document', err);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return parseInt(numericValue, 10).toLocaleString('vi-VN');
  };

  const handleIncomeChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setMonthlyIncome(numericValue);
  };

  const handleNext = () => {
    if (!monthlyIncome) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập mức thu nhập hàng tháng.");
      return;
    }

    if (!incomeProofFile) {
      Alert.alert(
        "Chưa có bảng lương",
        "Bạn chưa upload bảng lương. Khoản vay có thể bị hạn chế phê duyệt. Bạn vẫn muốn tiếp tục?",
        [
          { text: "Bổ sung ngay", style: "cancel" },
          { text: "Vẫn tiếp tục", onPress: () => navigation.navigate('FaceCapture') }
        ]
      );
    } else {
      navigation.navigate('FaceCapture');
    }
  };

  const renderChip = (label, value, isSelected, onPress) => (
    <TouchableOpacity 
      key={value}
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ProgressStepper currentStep={4} totalSteps={6} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* Thu nhập */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Wallet size={24} color={colors.primaryBlue} weight="fill" />
            <Text style={styles.cardTitle}>Thu nhập hàng tháng</Text>
          </View>
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="VD: 15,000,000"
              placeholderTextColor={colors.placeholderText}
              keyboardType="number-pad"
              value={formatCurrency(monthlyIncome)}
              onChangeText={handleIncomeChange}
            />
            <Text style={styles.currencyText}>VND</Text>
          </View>
        </View>

        {/* Hình thức nhận lương */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Bank size={24} color={colors.primaryBlue} weight="fill" />
            <Text style={styles.cardTitle}>Hình thức nhận lương</Text>
          </View>
          
          <View style={styles.chipGroup}>
            {renderChip('Tài khoản VRB', 'VRB', salaryAccountType === 'VRB', () => setSalaryAccountType('VRB'))}
            {renderChip('Ngân hàng khác', 'OTHER', salaryAccountType === 'OTHER', () => setSalaryAccountType('OTHER'))}
          </View>
        </View>

        {/* Upload chứng từ */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FileText size={24} color={colors.primaryBlue} weight="fill" />
            <Text style={styles.cardTitle}>Bảng lương / Sao kê</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.uploadBox, incomeProofFile && styles.uploadBoxHasFile]} 
            onPress={handlePickDocument}
          >
            {incomeProofFile ? (
              <>
                <FileText size={32} color={colors.primaryBlue} weight="duotone" />
                <Text style={styles.fileNameText} numberOfLines={1}>
                  {incomeProofFile.name}
                </Text>
                <Text style={styles.reselectText}>Chạm để chọn file khác</Text>
              </>
            ) : (
              <>
                <UploadSimple size={32} color={colors.placeholderText} />
                <Text style={styles.uploadText}>Tải lên ảnh hoặc file PDF</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Tài sản khác */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Briefcase size={24} color={colors.primaryBlue} weight="fill" />
            <Text style={styles.cardTitle}>Tài sản khác (Không bắt buộc)</Text>
          </View>
          
          <TextInput
            style={styles.textArea}
            placeholder="Mô tả sổ tiết kiệm, bất động sản, ô tô..."
            placeholderTextColor={colors.placeholderText}
            multiline
            numberOfLines={4}
            value={assetsDescription}
            onChangeText={setAssetsDescription}
            textAlignVertical="top"
          />
        </View>

      </ScrollView>

      <HotlineButton />

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100, // Make room for fixed button
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    fontFamily: typography.semiBold,
    fontSize: 18,
    color: colors.headingText,
    paddingVertical: spacing.md,
  },
  currencyText: {
    fontFamily: typography.medium,
    fontSize: 14,
    color: colors.secondaryText,
    marginLeft: spacing.sm,
  },
  chipGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: colors.primaryBlue,
    backgroundColor: colors.lightAccentBlue,
  },
  chipText: {
    fontFamily: typography.medium,
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  chipTextSelected: {
    color: colors.primaryBlue,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
    borderRadius: radius.input,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.appBackground,
  },
  uploadBoxHasFile: {
    borderStyle: 'solid',
    borderColor: colors.primaryBlue,
    backgroundColor: colors.lightAccentBlue,
  },
  uploadText: {
    fontFamily: typography.medium,
    fontSize: 14,
    color: colors.secondaryTextAlt,
    marginTop: spacing.sm,
  },
  fileNameText: {
    fontFamily: typography.semiBold,
    fontSize: 14,
    color: colors.headingText,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  reselectText: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.primaryBlue,
    marginTop: spacing.xs,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.input,
    padding: spacing.md,
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.headingText,
    minHeight: 100,
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
