import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { ApplicationContext } from '../context/ApplicationContext';
import { submitApplication } from '../services/submitApplication';
import { colors, spacing, radius, typography } from '../constants/theme';
import { User, Phone, Money, Wallet, CheckCircle } from 'phosphor-react-native';

export default function ReviewAndSubmitScreen({ navigation }) {
  const context = useContext(ApplicationContext);
  const { 
    qrData, faceImage, 
    phoneNumber, loanAmount, loanTermMonths, loanPurpose,
    monthlyIncome, salaryAccountType, incomeProofFile, assetsDescription,
    setApplicationId, setStatus, resetPersonalData 
  } = context;

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!qrData || !faceImage) {
      Alert.alert("Lỗi", "Dữ liệu không đầy đủ. Vui lòng thử lại.");
      return;
    }

    setLoading(true);
    try {
      // 1. Gửi dữ liệu
      const appId = await submitApplication(context);
      
      // 2. Cập nhật state
      setApplicationId(appId);
      setStatus("PENDING");

      // 3. Xóa SẠCH toàn bộ dữ liệu RAM
      resetPersonalData();
      
      // Chú ý: Việc tự động đổi trạng thái sang APPROVED sau 3s đã được đặt trong submitApplication.js.
      // 4. Chuyển hướng
      navigation.navigate('Status');
    } catch (error) {
      if (error.message === 'NETWORK_ERROR') {
        Alert.alert("Lỗi kết nối", "Không có kết nối mạng, vui lòng kiểm tra lại 4G/Wifi và thử lại.");
      } else {
        Alert.alert("Lỗi hệ thống", "Không thể gửi hồ sơ, vui lòng thử lại sau.");
      }
      setLoading(false);
    }
  };

  const renderInfoRow = (label, value) => (
    <View style={styles.infoRow} key={label}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Khối 1: Định danh */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <User size={24} color={colors.primaryBlue} weight="fill" />
            <Text style={styles.cardTitle}>Thông tin định danh</Text>
          </View>
          {qrData ? (
            <View>
              {renderInfoRow("Họ và tên", qrData.fullName)}
              {renderInfoRow("Số CCCD", qrData.citizenId)}
              {renderInfoRow("Ngày sinh", qrData.dob)}
              {renderInfoRow("Giới tính", qrData.gender)}
              {renderInfoRow("Địa chỉ", qrData.address)}
            </View>
          ) : (
            <Text style={styles.emptyText}>Chưa có thông tin QR</Text>
          )}
          {faceImage && (
            <View style={styles.faceImageContainer}>
              <Text style={styles.label}>Ảnh khuôn mặt</Text>
              <Image source={{ uri: `data:image/jpeg;base64,${faceImage}` }} style={styles.faceImage} />
            </View>
          )}
        </View>

        {/* Khối 2: Liên lạc */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Phone size={24} color={colors.primaryBlue} weight="fill" />
            <Text style={styles.cardTitle}>Thông tin liên lạc</Text>
          </View>
          {renderInfoRow("Số điện thoại", phoneNumber || 'Chưa nhập')}
        </View>

        {/* Khối 3: Khoản vay */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Money size={24} color={colors.primaryBlue} weight="fill" />
            <Text style={styles.cardTitle}>Khoản vay đề nghị</Text>
          </View>
          {renderInfoRow("Số tiền vay", loanAmount ? `${loanAmount.toLocaleString('vi-VN')} VND` : '0')}
          {renderInfoRow("Kỳ hạn", `${loanTermMonths} tháng`)}
          {renderInfoRow("Mục đích", loanPurpose)}
        </View>

        {/* Khối 4: Thu nhập */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Wallet size={24} color={colors.primaryBlue} weight="fill" />
            <Text style={styles.cardTitle}>Thu nhập & Tài sản</Text>
          </View>
          {renderInfoRow("Thu nhập tháng", monthlyIncome ? `${parseInt(monthlyIncome).toLocaleString('vi-VN')} VND` : 'Chưa nhập')}
          {renderInfoRow("Nhận lương qua", salaryAccountType === 'VRB' ? 'Tài khoản VRB' : 'Ngân hàng khác')}
          {renderInfoRow("Bảng lương đính kèm", incomeProofFile ? incomeProofFile.name : 'Không có')}
          {assetsDescription ? renderInfoRow("Tài sản khác", assetsDescription) : null}
        </View>
        
        <View style={styles.disclaimerBox}>
          <CheckCircle size={20} color={colors.primaryBlue} />
          <Text style={styles.disclaimerText}>
            Tôi cam kết các thông tin cung cấp là hoàn toàn chính xác và đồng ý với điều khoản của VRB.
          </Text>
        </View>

      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <Text style={styles.buttonText}>Gửi hồ sơ</Text>
          )}
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
    padding: spacing.lg,
    paddingBottom: 120, // Cho bottom button
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
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLighter,
    paddingBottom: spacing.sm,
  },
  cardTitle: {
    fontFamily: typography.semiBold,
    fontSize: 16,
    color: colors.primaryBlue,
    marginLeft: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  label: {
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.secondaryText,
    flex: 1,
  },
  value: {
    fontFamily: typography.medium,
    fontSize: 14,
    color: colors.headingText,
    flex: 2,
    textAlign: 'right',
  },
  emptyText: {
    fontFamily: typography.regular,
    color: colors.primaryRed,
    fontStyle: 'italic',
  },
  faceImageContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  faceImage: {
    width: 100,
    height: 100,
    borderRadius: radius.input,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  disclaimerBox: {
    flexDirection: 'row',
    backgroundColor: colors.lightAccentBlue,
    padding: spacing.md,
    borderRadius: radius.card,
    marginTop: spacing.sm,
  },
  disclaimerText: {
    flex: 1,
    fontFamily: typography.medium,
    fontSize: 12,
    color: colors.primaryBlue,
    marginLeft: spacing.sm,
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
    alignItems: 'center', // Căn giữa nút
  },
  button: {
    width: '100%',
    maxWidth: 400, // Đừng để quá to trên màn hình lớn
    backgroundColor: colors.primaryRed,
    paddingVertical: 16,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
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
