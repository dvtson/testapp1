import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction } from '../utils/storage';

interface Props {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

export const TransactionItem: React.FC<Props> = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === 'income';

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={[styles.iconContainer, { backgroundColor: isIncome ? '#e8f5e9' : '#ffebee' }]}>
          <Text style={[styles.iconText, { color: isIncome ? '#4caf50' : '#f44336' }]}>
            {isIncome ? '↓' : '↑'}
          </Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.description}>{transaction.description}</Text>
          <Text style={styles.date}>{new Date(transaction.date).toLocaleDateString()}</Text>
        </View>
      </View>
      
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isIncome ? '#4caf50' : '#f44336' }]}>
          {isIncome ? '+' : '-'}{transaction.amount.toLocaleString('vi-VN')} đ
        </Text>
        <TouchableOpacity onPress={() => onDelete(transaction.id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 20,
    fontWeight: '700',
  },
  details: {
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  right: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 12,
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
