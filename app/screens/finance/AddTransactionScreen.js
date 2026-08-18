import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { AuthContext } from '../../../context/AuthContext';
import { db } from '../../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { colors, spacing, radius, typography } from '../../../constants/theme';
import { CaretLeft } from 'phosphor-react-native';

export default function AddTransactionScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [type, setType] = useState('expense'); // 'income' hoặc 'expense'
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!amount || !note) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền và ghi chú');
      return;
    }

    const numAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Lỗi', 'Số tiền không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'financeNotes'), {
        ownerId: user.uid,
        type,
        amount: numAmount,
        note,
        createdAt: serverTimestamp()
      });
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể lưu giao dịch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <CaretLeft size={24} color={colors.headingText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm giao dịch mới</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.typeSelector}>
          <TouchableOpacity 
            style={[styles.typeButton, type === 'expense' && styles.typeExpenseActive]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>Tiền Chi</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.typeButton, type === 'income' && styles.typeIncomeActive]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>Tiền Thu</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Số tiền (VNĐ)</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Ghi chú</Text>
        <TextInput
          style={styles.input}
          placeholder="Ví dụ: Ăn trưa, Nhận lương..."
          value={note}
          onChangeText={setNote}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <Text style={styles.buttonText}>Lưu giao dịch</Text>
          )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLighter,
  },
  headerTitle: {
    fontFamily: typography.semiBold,
    fontSize: 18,
    color: colors.headingText,
  },
  backButton: {
    padding: spacing.xs,
  },
  form: {
    padding: spacing.lg,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    borderRadius: radius.button,
    backgroundColor: colors.surface,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radius.button,
  },
  typeExpenseActive: {
    backgroundColor: colors.primaryRed,
  },
  typeIncomeActive: {
    backgroundColor: colors.primaryBlue,
  },
  typeText: {
    fontFamily: typography.medium,
    color: colors.secondaryText,
    fontSize: 15,
  },
  typeTextActive: {
    color: colors.surface,
    fontFamily: typography.semiBold,
  },
  label: {
    fontFamily: typography.medium,
    color: colors.headingText,
    marginBottom: spacing.xs,
    fontSize: 15,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    height: 50,
    fontFamily: typography.regular,
    fontSize: 16,
    marginBottom: spacing.lg,
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
});
