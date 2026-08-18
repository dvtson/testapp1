import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { AuthContext } from '../../../context/AuthContext';
import { db } from '../../../config/firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { colors, spacing, radius, typography } from '../../../constants/theme';
import { Plus, SignOut, Trash } from 'phosphor-react-native';

export default function FinanceHomeScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Loại bỏ orderBy để tránh lỗi bắt buộc tạo Index trên Firebase
    const q = query(
      collection(db, 'financeNotes'),
      where('ownerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let tempInc = 0;
      let tempExp = 0;
      const trans = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        trans.push({ id: doc.id, ...data });
        if (data.type === 'income') tempInc += data.amount;
        else if (data.type === 'expense') tempExp += data.amount;
      });

      // Tự sort mảng theo thời gian giảm dần bằng Javascript
      trans.sort((a, b) => {
        const tA = a.createdAt ? a.createdAt.toMillis() : Date.now();
        const tB = b.createdAt ? b.createdAt.toMillis() : Date.now();
        return tB - tA;
      });

      setTransactions(trans);
      setTotalIncome(tempInc);
      setTotalExpense(tempExp);
    });

    return unsubscribe;
  }, [user]);

  const handleDeleteTransaction = (id) => {
    Alert.alert(
      "Xóa giao dịch",
      "Bạn có chắc chắn muốn xóa giao dịch này không?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'financeNotes', id));
            } catch (error) {
              Alert.alert("Lỗi", "Không thể xóa giao dịch. Vui lòng thử lại.");
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transLeft}>
        <Text style={styles.transNote}>{item.note}</Text>
        <Text style={styles.transDate}>
          {item.createdAt ? item.createdAt.toDate().toLocaleDateString('vi-VN') : 'Mới'}
        </Text>
      </View>
      <Text style={[styles.transAmount, { color: item.type === 'income' ? colors.primaryBlue : colors.primaryRed }]}>
        {item.type === 'income' ? '+' : '-'}{item.amount.toLocaleString('vi-VN')} đ
      </Text>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteTransaction(item.id)}
      >
        <Trash size={20} color={colors.primaryRed} weight="regular" />
      </TouchableOpacity>
    </View>
  );

  const listHeader = (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sổ thu chi</Text>
        <TouchableOpacity onPress={logout}>
          <SignOut size={24} color={colors.primaryRed} />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Tổng Thu</Text>
          <Text style={[styles.summaryValue, { color: colors.primaryBlue }]}>
            +{totalIncome.toLocaleString('vi-VN')}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Tổng Chi</Text>
          <Text style={[styles.summaryValue, { color: colors.primaryRed }]}>
            -{totalExpense.toLocaleString('vi-VN')}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có giao dịch nào.</Text>}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Plus size={24} color={colors.surface} weight="bold" />
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontFamily: typography.bold,
    fontSize: 22,
    color: colors.headingText,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    margin: spacing.lg,
    borderRadius: radius.card,
    padding: spacing.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryBox: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
  },
  summaryLabel: {
    fontFamily: typography.medium,
    color: colors.secondaryText,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontFamily: typography.bold,
    fontSize: 18,
  },
  sectionTitle: {
    fontFamily: typography.semiBold,
    fontSize: 16,
    color: colors.headingText,
    marginLeft: spacing.lg,
    marginBottom: spacing.sm,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.button,
    marginBottom: spacing.sm,
  },
  transLeft: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  transNote: {
    fontFamily: typography.medium,
    fontSize: 15,
    color: colors.headingText,
    marginBottom: 4,
  },
  transDate: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.secondaryText,
  },
  transAmount: {
    fontFamily: typography.semiBold,
    fontSize: 16,
    marginRight: spacing.sm,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  emptyText: {
    fontFamily: typography.regular,
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  }
});
