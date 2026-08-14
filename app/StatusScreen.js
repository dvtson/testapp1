import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ApplicationContext } from '../context/ApplicationContext';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, typography } from '../constants/theme';
import { CheckCircle, XCircle, Clock, House, ListDashes } from 'phosphor-react-native';

export default function StatusScreen({ navigation }) {
  const { applicationId, status, setStatus, resetSession } = useContext(ApplicationContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!applicationId) {
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, "applications", applicationId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStatus(data.status);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [applicationId]);

  const handleGoHome = () => {
    resetSession();
    // Quay về luồng đầu tiên
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primaryBlue} />
          <Text style={styles.statusText}>Đang tải thông tin...</Text>
        </View>
      );
    }

    if (!applicationId) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Không tìm thấy mã hồ sơ.</Text>
          <TouchableOpacity style={styles.button} onPress={handleGoHome}>
            <Text style={styles.buttonText}>Về trang chủ</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (status === 'APPROVED') {
      return (
        <View style={styles.centerContainer}>
          <CheckCircle size={80} color={colors.primaryBlue} weight="fill" />
          <Text style={[styles.statusText, { color: colors.primaryBlue }]}>Đã phê duyệt</Text>
          <Text style={styles.subText}>Chúc mừng! Khoản vay của bạn đã được duyệt thành công.</Text>
        </View>
      );
    }

    if (status === 'REJECTED') {
      return (
        <View style={styles.centerContainer}>
          <XCircle size={80} color={colors.primaryRed} weight="fill" />
          <Text style={[styles.statusText, { color: colors.primaryRed }]}>Bị từ chối</Text>
          <Text style={styles.subText}>Rất tiếc, hồ sơ của bạn chưa đủ điều kiện tại thời điểm này.</Text>
        </View>
      );
    }

    // PENDING
    return (
      <View style={styles.centerContainer}>
        <Clock size={80} color={colors.secondaryText} weight="duotone" />
        <Text style={styles.statusText}>Đang xử lý</Text>
        <Text style={styles.subText}>Hồ sơ đang được hệ thống đánh giá. Vui lòng không đóng ứng dụng.</Text>
        <ActivityIndicator size="large" color={colors.primaryBlue} style={{ marginTop: spacing.xl }} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.darkBgStart, colors.darkBgEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBackground}
      />
      
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          {renderContent()}
          
          {(status === 'APPROVED' || status === 'REJECTED' || !applicationId) && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.homeButton} 
                onPress={() => {
                  resetSession();
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Onboarding' }],
                  });
                }}
              >
                <House size={20} color={colors.primaryBlue} weight="fill" />
                <Text style={styles.homeButtonText}>Về trang chủ</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.historyButton} 
                onPress={() => {
                  navigation.navigate('ApplicationHistory');
                }}
              >
                <ListDashes size={20} color={colors.secondaryText} />
                <Text style={styles.historyButtonText}>Xem lịch sử hồ sơ</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
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
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    marginTop: -100, // Đè lên phần gradient
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    elevation: 4,
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  statusText: {
    fontFamily: typography.bold,
    fontSize: 24,
    color: colors.headingText,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subText: {
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.md,
  },
  errorText: {
    fontFamily: typography.medium,
    fontSize: 16,
    color: colors.primaryRed,
    marginBottom: spacing.xl,
  },
  actionsContainer: {
    width: '100%',
    marginTop: spacing.xl,
  },
  button: {
    width: '100%',
    backgroundColor: colors.primaryBlue,
    paddingVertical: 16,
    borderRadius: radius.button,
    alignItems: 'center',
    marginTop: spacing.xl * 1.5,
  },
  buttonText: {
    fontFamily: typography.semiBold,
    fontSize: 16,
    color: colors.surface,
  },
  homeButton: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.surface,
    paddingVertical: 16,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primaryBlue,
  },
  homeButtonText: {
    fontFamily: typography.semiBold,
    color: colors.primaryBlue,
    fontSize: 16,
    marginLeft: spacing.sm,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  historyButtonText: {
    fontFamily: typography.medium,
    color: colors.secondaryText,
    fontSize: 14,
    marginLeft: spacing.sm,
    textDecorationLine: 'underline',
  }
});
