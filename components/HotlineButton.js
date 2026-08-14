import React from 'react';
import { TouchableOpacity, StyleSheet, Alert, Linking, View } from 'react-native';
import { Headset } from 'phosphor-react-native';
import { colors, spacing } from '../constants/theme';

export default function HotlineButton() {
  const handlePress = () => {
    Alert.alert(
      "Liên hệ hỗ trợ",
      "Bạn có muốn gọi hotline hỗ trợ 1900-1234?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Gọi", onPress: () => Linking.openURL('tel:19001234') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.8}>
        <Headset size={28} color={colors.surface} weight="fill" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120, // Nâng lên 120px để tránh đè lên Bottom Container (nút Tiếp tục)
    right: spacing.lg,
    zIndex: 999, // Đảm bảo luôn nổi trên cùng
  },
  button: {
    backgroundColor: colors.primaryBlue,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  }
});
