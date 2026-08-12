import AsyncStorage from '@react-native-async-storage/async-storage';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
}

const STORAGE_KEY = '@finance_app_transactions';

export const saveTransaction = async (transaction: Transaction) => {
  try {
    const transactions = await getTransactions();
    transactions.push(transaction);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transaction', error);
  }
};

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting transactions', error);
    return [];
  }
};

export const deleteTransaction = async (id: string) => {
  try {
    const transactions = await getTransactions();
    const updated = transactions.filter(t => t.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting transaction', error);
  }
};
