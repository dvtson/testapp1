import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ApplicationProvider } from './context/ApplicationContext';
import { useEffect } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { auth } from './config/firebase';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { View, ActivityIndicator } from 'react-native';
import { colors } from './constants/theme';

// Import screens
import OnboardingScreen from './app/OnboardingScreen';
import ConsentScreen from './app/ConsentScreen';
import PhoneEntryScreen from './app/PhoneEntryScreen';
import OtpScreen from './app/OtpScreen';
import LoanApplicationScreen from './app/LoanApplicationScreen';
import IncomeVerificationScreen from './app/IncomeVerificationScreen';
import QrScanScreen from './app/QrScanScreen';
import FaceCaptureScreen from './app/FaceCaptureScreen';
import ReviewAndSubmitScreen from './app/ReviewAndSubmitScreen';
import StatusScreen from './app/StatusScreen';
import ApplicationHistoryScreen from './app/ApplicationHistoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    // Đăng nhập ẩn danh tự động để định danh thiết bị an toàn
    signInAnonymously(auth).catch((error) => {
      console.error("Lỗi đăng nhập ẩn danh:", error);
    });
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.appBackground }}>
        <ActivityIndicator size="large" color={colors.primaryBlue} />
      </View>
    );
  }

  return (
    <ApplicationProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Onboarding"
          screenOptions={{
            headerStyle: { backgroundColor: colors.appBackground },
            headerTintColor: colors.primaryBlue,
            headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 18 },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.appBackground }
          }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Consent" component={ConsentScreen} options={{ headerShown: false }} />
          
          <Stack.Screen name="Home" component={PhoneEntryScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Otp" component={OtpScreen} options={{ headerShown: false }} />
          
          <Stack.Screen name="LoanApplication" component={LoanApplicationScreen} options={{ title: 'Khoản vay đề nghị', headerShown: true }} />
          <Stack.Screen name="IncomeVerification" component={IncomeVerificationScreen} options={{ title: 'Thu nhập & Tài sản', headerShown: true }} />
          <Stack.Screen name="FaceCapture" component={FaceCaptureScreen} options={{ title: 'Chụp khuôn mặt', headerShown: true }} />
          <Stack.Screen name="QrScan" component={QrScanScreen} options={{ title: 'Quét CCCD', headerShown: true }} />
          
          <Stack.Screen name="ReviewAndSubmit" component={ReviewAndSubmitScreen} options={{ title: 'Xác nhận hồ sơ', headerShown: true }} />
          <Stack.Screen name="Status" component={StatusScreen} options={{ gestureEnabled: false, headerShown: false }} />
          <Stack.Screen name="ApplicationHistory" component={ApplicationHistoryScreen} options={{ title: 'Lịch sử hồ sơ', headerShown: true }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApplicationProvider>
  );
}
