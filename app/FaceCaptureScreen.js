import React, { useState, useRef, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ApplicationContext } from '../context/ApplicationContext';
import { colors, spacing, radius, typography } from '../constants/theme';
import { Camera, ArrowsClockwise, Check } from 'phosphor-react-native';
import ProgressStepper from '../components/ProgressStepper';

export default function FaceCaptureScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [previewBase64, setPreviewBase64] = useState(null);
  const cameraRef = useRef(null);
  const { setFaceImage } = useContext(ApplicationContext);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Chúng tôi cần quyền truy cập camera để chụp ảnh.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Cấp quyền</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
      setPreviewBase64(photo.base64);
    }
  };

  const retakePicture = () => {
    setPreviewBase64(null);
  };

  const confirmPicture = () => {
    setFaceImage(previewBase64);
    navigation.navigate('QrScan');
  };

  return (
    <View style={styles.container}>
      <ProgressStepper currentStep={5} totalSteps={6} />

      {previewBase64 ? (
        <View style={styles.previewContainer}>
          <Image 
            source={{ uri: `data:image/jpeg;base64,${previewBase64}` }} 
            style={styles.previewImage} 
          />
          <View style={styles.actionContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.retakeButton]} onPress={retakePicture}>
              <ArrowsClockwise size={24} color={colors.primaryRed} />
              <Text style={styles.retakeText}>Chụp lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.confirmButton]} onPress={confirmPicture}>
              <Check size={24} color={colors.surface} />
              <Text style={styles.confirmText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="front"
            ref={cameraRef}
          />
          
          <View style={styles.overlayFrame}>
            <View style={styles.frameBorder} />
          </View>

          <View style={styles.cameraControls}>
            <View style={styles.instructionBox}>
              <Text style={styles.instructionText}>Đưa khuôn mặt vào trong khung hình</Text>
            </View>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureInner}>
                <Camera size={32} color={colors.primaryBlue} weight="fill" />
              </View>
            </TouchableOpacity>
          </View>
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.appBackground,
  },
  permissionText: {
    fontFamily: typography.medium,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontSize: 16,
    color: colors.primaryBlue,
  },
  permissionButton: {
    backgroundColor: colors.primaryRed,
    padding: spacing.md,
    borderRadius: radius.button,
  },
  permissionButtonText: {
    fontFamily: typography.semiBold,
    color: colors.surface,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlayFrame: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  frameBorder: {
    width: 250,
    height: 350,
    borderWidth: 2,
    borderColor: colors.surface,
    borderRadius: 150, // Hình Oval cho khuôn mặt
    backgroundColor: 'transparent',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: spacing.xxl,
  },
  instructionBox: {
    backgroundColor: 'rgba(18, 42, 130, 0.8)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginBottom: spacing.xl,
  },
  instructionText: {
    fontFamily: typography.medium,
    color: colors.surface,
    fontSize: 14,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    position: 'absolute',
    bottom: spacing.xxl,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    paddingHorizontal: spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.button,
    elevation: 4,
  },
  retakeButton: {
    backgroundColor: colors.surface,
  },
  confirmButton: {
    backgroundColor: colors.primaryBlue,
  },
  retakeText: {
    fontFamily: typography.semiBold,
    color: colors.primaryRed,
    marginLeft: spacing.xs,
    fontSize: 16,
  },
  confirmText: {
    fontFamily: typography.semiBold,
    color: colors.surface,
    marginLeft: spacing.xs,
    fontSize: 16,
  }
});
