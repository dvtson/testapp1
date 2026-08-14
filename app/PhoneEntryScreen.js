import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ApplicationContext } from '../context/ApplicationContext';
import { validatePhone } from '../utils/validatePhone';
import { colors, spacing, radius, typography } from '../constants/theme';
import { DeviceMobile, ArrowRight, CaretLeft } from 'phosphor-react-native';
import ProgressStepper from '../components/ProgressStepper';
import HotlineButton from '../components/HotlineButton';

export default function PhoneEntryScreen({ navigation }) {
  const [inputPhone, setInputPhone] = useState('');
  const { setPhoneNumber, setOtpCode } = useContext(ApplicationContext);

  const isValid = validatePhone(inputPhone);

  const handleNext = () => {
    if (!isValid) return;
    
    // Lưu SĐT vào context
    setPhoneNumber(inputPhone);
    
    // Sinh OTP ảo
    const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(fakeOtp);

    // Hiển thị thông báo chứa mã OTP
    Alert.alert(
      "[BẢN DEMO] Mã xác thực",
      `Mã xác thực của bạn là: ${fakeOtp}\n(Không có SMS thật được gửi)`,
      [{ text: "Đồng ý", onPress: () => navigation.navigate('Otp') }]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={[colors.darkBgStart, colors.darkBgEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerBackground}
          >
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  navigation.replace('Onboarding');
                }
              }}
            >
              <CaretLeft size={28} color={colors.surface} />
            </TouchableOpacity>

            <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Đăng ký khoản vay</Text>
          <Text style={styles.headerSubtitle}>Cùng VRB thực hiện ước mơ của bạn</Text>
        </View>
      </LinearGradient>

      <ProgressStepper currentStep={1} totalSteps={6} />

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.iconWrapper}>
            <DeviceMobile size={32} color={colors.primaryBlue} weight="fill" />
          </View>
          
          <Text style={styles.cardTitle}>Nhập số điện thoại</Text>
          <Text style={styles.cardDesc}>Chúng tôi sẽ gửi mã xác thực (OTP) để xác minh danh tính của bạn.</Text>

          <View style={[styles.inputWrapper, isValid && inputPhone ? styles.inputValid : null]}>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: 0912345678"
              placeholderTextColor={colors.placeholderText}
              keyboardType="phone-pad"
              value={inputPhone}
              onChangeText={setInputPhone}
              maxLength={12}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, !isValid ? styles.buttonDisabled : null]}
            onPress={handleNext}
            disabled={!isValid}
          >
            <Text style={styles.buttonText}>Tiếp tục</Text>
            <ArrowRight size={20} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </View>
      
      <HotlineButton />
      
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
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
  cardContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    marginTop: -80, // Đè lên phần gradient
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.lightAccentBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontFamily: typography.semiBold,
    fontSize: 20,
    color: colors.headingText,
    marginBottom: spacing.sm,
  },
  cardDesc: {
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  inputWrapper: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.input,
    backgroundColor: colors.surface,
    marginBottom: spacing.xl,
  },
  inputValid: {
    borderColor: colors.primaryBlue,
    borderWidth: 2,
  },
  input: {
    fontFamily: typography.medium,
    fontSize: 16,
    color: colors.headingText,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  button: {
    width: '100%',
    backgroundColor: colors.primaryRed,
    paddingVertical: 16,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.placeholderText,
  },
  buttonText: {
    fontFamily: typography.semiBold,
    fontSize: 16,
    color: colors.surface,
  },
});
