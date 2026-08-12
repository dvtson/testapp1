import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { Transaction, TransactionType, getTransactions, saveTransaction, deleteTransaction } from '../utils/storage';
import { TransactionItem } from '../components/TransactionItem';
import { AddTransactionModal } from '../components/AddTransactionModal';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await getTransactions();
    // Sort by date descending (newest first)
    data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setTransactions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTransaction = async (amount: number, description: string, type: TransactionType) => {
    const newTransaction: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      amount,
      description,
      type,
      date: new Date().toISOString(),
    };
    await saveTransaction(newTransaction);
    setModalVisible(false);
    loadData();
  };

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransaction(id);
    loadData();
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Chào bạn 👋</Text>
          <Text style={styles.subtitle}>Tổng quan tài chính của bạn</Text>
        </View>

        <View style={styles.dashboard}>
          <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
          <Text style={styles.balanceAmount}>{balance.toLocaleString('vi-VN')} đ</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <View style={styles.statIconContainerIncome}>
                <Text style={styles.statIcon}>↓</Text>
              </View>
              <View>
                <Text style={styles.statLabel}>Thu nhập</Text>
                <Text style={styles.statIncome}>{totalIncome.toLocaleString('vi-VN')} đ</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <View style={styles.statIconContainerExpense}>
                <Text style={styles.statIcon}>↑</Text>
              </View>
              <View>
                <Text style={styles.statLabel}>Chi tiêu</Text>
                <Text style={styles.statExpense}>{totalExpense.toLocaleString('vi-VN')} đ</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Giao dịch gần đây</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#208AEF" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TransactionItem transaction={item} onDelete={handleDeleteTransaction} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
                <Text style={styles.emptySubText}>Hãy thêm giao dịch đầu tiên của bạn!</Text>
              </View>
            }
          />
        )}

        <TouchableOpacity 
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddTransaction}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  dashboard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceLabel: {
    color: '#A0A0A0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIconContainerIncome: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statIconContainerExpense: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statIcon: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    marginBottom: 2,
  },
  statIncome: {
    color: '#4caf50',
    fontSize: 16,
    fontWeight: '700',
  },
  statExpense: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
  },
  listHeader: {
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  listContent: {
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#208AEF',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#208AEF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 34,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
  }
});
