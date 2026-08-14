import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ApplicationContext } from '../context/ApplicationContext';
import { colors, spacing, radius, typography } from '../constants/theme';
import { LockKey, ArrowRight, Password, CaretLeft } from 'phosphor-react-native';
import ProgressStepper from '../components/ProgressStepper';
import HotlineButton from '../components/HotlineButton';

export default function OtpScreen({ navigation }) {
  const [inputOtp, setInputOtp] = useState('');
  const { phoneNumber } = useContext(ApplicationContext);

  const handleNext = () => {
    // Bản demo: Luôn cho qua kể cả nhập sai hay trống
    navigation.navigate('LoanApplication');
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
              navigation.replace('Home');
            }
          }}
        >
          <CaretLeft size={28} color={colors.surface} />
        </TouchableOpacity>
      </LinearGradient>

      <ProgressStepper currentStep={2} totalSteps={6} />

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.iconWrapper}>
            <Password size={32} color={colors.primaryBlue} weight="fill" />
          </View>
          
          <Text style={styles.cardTitle}>Xác thực OTP</Text>
          <Text style={styles.cardDesc}>
            Vui lòng nhập mã xác thực gồm 6 chữ số vừa được gửi đến số {phoneNumber || 'của bạn'}
          </Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nhập mã OTP (VD: 123456)"
              placeholderTextColor={colors.placeholderText}
              keyboardType="number-pad"
              value={inputOtp}
              onChangeText={setInputOtp}
              maxLength={6}
              textAlign="center"
            />
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>Tiếp tục</Text>
          </TouchableOpacity>

            <TouchableOpacity style={styles.resendButton}>
              <Text style={styles.resendText}>Gửi lại mã</Text>
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
  input: {
    fontFamily: typography.bold,
    fontSize: 24,
    letterSpacing: 4,
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
    marginBottom: spacing.md,
  },
  buttonText: {
    fontFamily: typography.semiBold,
    fontSize: 16,
    color: colors.surface,
  },
  resendButton: {
    padding: spacing.sm,
  },
  resendText: {
    fontFamily: typography.medium,
    fontSize: 14,
    color: colors.primaryBlue,
  },
});
