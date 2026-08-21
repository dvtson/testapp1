import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { AuthContext } from '../../../context/AuthContext';
import { colors, spacing, radius, typography } from '../../../constants/theme';
import { LockKey, EnvelopeSimple } from 'phosphor-react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ Email và Mật khẩu");
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      // Đăng nhập thành công, AuthGateway trong App.js sẽ tự động điều hướng
    } catch (error) {
      console.log(error); // Bỏ console.error để tránh hiện log đỏ
      Alert.alert("Đăng nhập thất bại", "Email hoặc mật khẩu không đúng.");
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
        <Text style={styles.title}>Finance Note</Text>
        <Text style={styles.subtitle}>Quản lý chi tiêu thông minh</Text>
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
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <Text style={styles.buttonText}>Đăng nhập</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Đăng ký ngay</Text>
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  registerText: {
    fontFamily: typography.regular,
    color: colors.secondaryText,
    fontSize: 14,
  },
  registerLink: {
    fontFamily: typography.semiBold,
    color: colors.primaryBlue,
    fontSize: 14,
  },
});
