import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { CheckSquare, Square, ShieldCheck } from 'phosphor-react-native';
import { colors, spacing, radius, typography } from '../../../constants/theme';
import { ApplicationContext } from '../../../context/ApplicationContext';

export default function ConsentScreen({ navigation }) {
  const [agreed, setAgreed] = useState(false);
  const { setConsentGivenAt } = useContext(ApplicationContext);

  const handleContinue = () => {
    if (agreed) {
      setConsentGivenAt(new Date().toISOString()); // Lưu timestamp định dạng chuỗi
      navigation.replace('Home'); // Home là màn hình PhoneEntryScreen
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ShieldCheck size={32} color={colors.primaryBlue} weight="fill" />
        <Text style={styles.headerTitle}>Bảo mật & Quyền riêng tư</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          Chào mừng bạn đến với ứng dụng RLOS Beta. Để tiếp tục quá trình tạo hồ sơ vay vốn, chúng tôi cần thu thập một số thông tin cá nhân và định danh (CCCD, hình ảnh khuôn mặt).
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.boldText}>Cam kết bảo mật (RAM-only): </Text>
          Toàn bộ dữ liệu nhạy cảm của bạn chỉ được lưu trữ tạm thời trong bộ nhớ RAM trong suốt phiên làm việc. Dữ liệu sẽ bị xóa hoàn toàn khỏi thiết bị ngay sau khi bạn gửi hồ sơ thành công hoặc thoát ứng dụng.
        </Text>
        <Text style={styles.paragraph}>
          Mọi dữ liệu sau khi được gửi đi sẽ được mã hóa và lưu trữ an toàn trên hệ thống máy chủ, tuân thủ nghiêm ngặt các quy định về bảo vệ dữ liệu cá nhân theo pháp luật hiện hành.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={() => setAgreed(!agreed)}
          activeOpacity={0.7}
        >
          {agreed ? (
            <CheckSquare size={24} color={colors.primaryRed} weight="fill" />
          ) : (
            <Square size={24} color={colors.borderLight} />
          )}
          <Text style={styles.checkboxText}>
            Tôi đã đọc, hiểu và đồng ý với Điều khoản sử dụng & Chính sách bảo mật dữ liệu cá nhân.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, !agreed && styles.buttonDisabled]} 
          onPress={handleContinue}
          disabled={!agreed}
        >
          <Text style={styles.buttonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLighter,
  },
  headerTitle: {
    fontFamily: typography.bold,
    fontSize: 18,
    color: colors.primaryBlue,
    marginLeft: spacing.sm,
  },
  content: {
    padding: spacing.lg,
  },
  paragraph: {
    fontFamily: typography.regular,
    fontSize: 15,
    color: colors.headingText,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  boldText: {
    fontFamily: typography.bold,
    color: colors.primaryBlue,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLighter,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  checkboxText: {
    flex: 1,
    fontFamily: typography.medium,
    fontSize: 14,
    color: colors.secondaryText,
    marginLeft: spacing.sm,
    lineHeight: 20,
  },
  button: {
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
    color: colors.surface,
    fontSize: 16,
  }
});
