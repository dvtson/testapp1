import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { colors, spacing, radius, typography } from '../constants/theme';
import { Clock, CheckCircle, XCircle } from 'phosphor-react-native';
import { ApplicationContext } from '../context/ApplicationContext';

export default function ApplicationHistoryScreen({ navigation }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setApplicationId, setStatus } = useContext(ApplicationContext);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      if (!auth.currentUser) return;
      const uid = auth.currentUser.uid;
      const q = query(
        collection(db, 'applications'),
        where('userId', '==', uid)
      );
      
      const querySnapshot = await getDocs(q);
      const apps = [];
      querySnapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() });
      });

      // Sắp xếp client-side để tránh lỗi thiếu Index trên Firebase
      apps.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setApplications(apps);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'APPROVED': return { text: 'Đã phê duyệt', color: colors.success, icon: <CheckCircle size={18} color={colors.success} weight="fill" /> };
      case 'REJECTED': return { text: 'Bị từ chối', color: colors.primaryRed, icon: <XCircle size={18} color={colors.primaryRed} weight="fill" /> };
      default: return { text: 'Đang xử lý', color: colors.warning, icon: <Clock size={18} color={colors.warning} weight="fill" /> };
    }
  };

  const handlePress = (app) => {
    setApplicationId(app.id);
    setStatus(app.status);
    navigation.navigate('Status');
  };

  const renderItem = ({ item }) => {
    const statusData = getStatusDisplay(item.status);
    // Format timestamp
    const dateStr = item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : 'N/A';

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => handlePress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.appId}>Mã HS: {item.id.slice(0, 8).toUpperCase()}</Text>
          <Text style={styles.date}>{dateStr}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.amount}>
            {item.loanAmount ? `${item.loanAmount.toLocaleString('vi-VN')} VND` : 'Không rõ'}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: `${statusData.color}20` }]}>
            {statusData.icon}
            <Text style={[styles.statusText, { color: statusData.color }]}>
              {statusData.text}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primaryBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {applications.length > 0 ? (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.centered}>
          <Clock size={48} color={colors.borderLight} />
          <Text style={styles.emptyText}>Chưa có hồ sơ nào</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  listContainer: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.card,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLighter,
    paddingBottom: spacing.sm,
    marginBottom: spacing.sm,
  },
  appId: {
    fontFamily: typography.semiBold,
    fontSize: 14,
    color: colors.primaryBlue,
  },
  date: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.secondaryText,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontFamily: typography.bold,
    fontSize: 16,
    color: colors.headingText,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  statusText: {
    fontFamily: typography.medium,
    fontSize: 12,
    marginLeft: 4,
  },
  emptyText: {
    fontFamily: typography.medium,
    color: colors.secondaryText,
    marginTop: spacing.md,
  }
});
