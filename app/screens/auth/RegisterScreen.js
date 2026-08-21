import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../../../context/AuthContext';
import { colors, spacing, radius, typography } from '../../../constants/theme';
import { LockKey, EnvelopeSimple } from 'phosphor-react-native';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu nhập lại không khớp");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setIsLoading(true);
    try {
      await register(email.trim(), password);
      // Đăng ký thành công, AuthGateway trong App.js sẽ tự động chuyển hướng
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Đăng ký thất bại", "Email này đã được sử dụng.");
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert("Đăng ký thất bại", "Địa chỉ email không hợp lệ.");
      } else {
        Alert.alert("Đăng ký thất bại", "Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.appBackground }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Đăng Ký</Text>
            <Text style={styles.subtitle}>Tạo tài khoản mới</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <EnvelopeSimple size={20} color={colors.secondaryText} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <LockKey size={20} color={colors.secondaryText} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu (từ 6 ký tự)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <LockKey size={20} color={colors.secondaryText} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                <Text style={styles.buttonText}>Tạo tài khoản</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLink}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.appBackground,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontFamily: typography.bold,
    fontSize: 28,
    color: colors.primaryBlue,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: typography.regular,
    fontSize: 16,
    color: colors.secondaryText,
  },
  form: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.card,
    elevation: 2,
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.input,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: typography.regular,
    fontSize: 16,
    color: colors.headingText,
  },
  button: {
    backgroundColor: colors.primaryBlue,
    height: 50,
    borderRadius: radius.button,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonText: {
    fontFamily: typography.semiBold,
    color: colors.surface,
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  loginText: {
    fontFamily: typography.regular,
    color: colors.secondaryText,
    fontSize: 14,
  },
  loginLink: {
    fontFamily: typography.semiBold,
    color: colors.primaryBlue,
    fontSize: 14,
  },
});
