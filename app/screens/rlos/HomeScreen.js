import React, { useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { ApplicationContext } from '../../../context/ApplicationContext';

export default function HomeScreen({ navigation }) {
  const { resetSession } = useContext(ApplicationContext);

  // Đảm bảo mỗi khi vào Home, state sẽ được dọn dẹp sạch sẽ
  useEffect(() => {
    resetSession();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hệ thống nhận diện</Text>
      <Text style={styles.subtitle}>Bản thử nghiệm nội bộ</Text>
      <Button 
        title="Bắt đầu quét CCCD" 
        onPress={() => navigation.navigate('QrScan')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 40
  }
});
