import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ApplicationContext } from '../../../context/ApplicationContext';
import { parseQrCccd } from '../../../utils/parseQrCccd';
import { colors, spacing, radius, typography } from '../../../constants/theme';
import { Scan, QrCode, CaretLeft } from 'phosphor-react-native';
import ProgressStepper from '../../../components/ProgressStepper';

export default function QrScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);
  const { setQrData } = useContext(ApplicationContext);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.messageCard}>
          <Text style={styles.message}>Ứng dụng cần quyền sử dụng camera để quét QR CCCD.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Cấp quyền Camera</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }) => {
    if (hasScanned) return;
    setHasScanned(true); // Tạm dừng quét tiếp

    const result = parseQrCccd(data);
    if (result.success) {
      setQrData(result.data);
      navigation.navigate('ReviewAndSubmit');
    } else {
      Alert.alert(
        "Lỗi mã QR",
        result.error,
        [{ text: "Quét lại", onPress: () => setHasScanned(false) }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.appBackground }}>
        <TouchableOpacity 
          style={{ padding: spacing.sm, paddingLeft: spacing.lg }} 
          onPress={() => { if(navigation.canGoBack()) navigation.goBack(); }}
        >
          <CaretLeft size={28} color={colors.primaryBlue} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <ProgressStepper currentStep={6} totalSteps={6} />
        </View>
      </View>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
      />
      
      <View style={styles.overlayFrame}>
        <View style={styles.frameBorder} />
      </View>

      <View style={styles.overlay}>
        <View style={styles.instructionBox}>
          <QrCode size={24} color={colors.surface} style={styles.instructionIcon} />
          <Text style={styles.overlayText}>Vui lòng đưa mã QR mặt trước CCCD vào khung hình</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBgStart,
    justifyContent: 'center',
  },
  messageCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    margin: spacing.lg,
    borderRadius: radius.card,
    alignItems: 'center',
  },
  message: {
    fontFamily: typography.regular,
    fontSize: 16,
    color: colors.headingText,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.button,
  },
  primaryButtonText: {
    fontFamily: typography.semiBold,
    color: colors.surface,
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  overlayFrame: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameBorder: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: colors.primaryBlue,
    borderRadius: radius.card,
    backgroundColor: 'rgba(18, 42, 130, 0.1)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.xl * 2,
  },
  instructionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.card,
    marginHorizontal: spacing.xl,
  },
  instructionIcon: {
    marginRight: spacing.sm,
  },
  overlayText: {
    fontFamily: typography.medium,
    color: colors.surface,
    fontSize: 14,
    flex: 1,
  }
});
