import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

import { ApplicationProvider } from './context/ApplicationContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { colors } from './constants/theme';

// --- AUTH SCREENS ---
import LoginScreen from './app/screens/auth/LoginScreen';

// --- FINANCE SCREENS (VỎ BỌC) ---
import FinanceHomeScreen from './app/screens/finance/FinanceHomeScreen';
import AddTransactionScreen from './app/screens/finance/AddTransactionScreen';

// --- RLOS SCREENS (BÍ MẬT) ---
import OnboardingScreen from './app/screens/rlos/OnboardingScreen';
import ConsentScreen from './app/screens/rlos/ConsentScreen';
import PhoneEntryScreen from './app/screens/rlos/PhoneEntryScreen';
import OtpScreen from './app/screens/rlos/OtpScreen';
import LoanApplicationScreen from './app/screens/rlos/LoanApplicationScreen';
import IncomeVerificationScreen from './app/screens/rlos/IncomeVerificationScreen';
import QrScanScreen from './app/screens/rlos/QrScanScreen';
import FaceCaptureScreen from './app/screens/rlos/FaceCaptureScreen';
import ReviewAndSubmitScreen from './app/screens/rlos/ReviewAndSubmitScreen';
import StatusScreen from './app/screens/rlos/StatusScreen';
import ApplicationHistoryScreen from './app/screens/rlos/ApplicationHistoryScreen';

const Stack = createNativeStackNavigator();

// 1. Stack Đăng nhập
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

// 2. Stack Vỏ bọc (Tài chính)
const FinanceStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.appBackground } }}>
    <Stack.Screen name="FinanceHome" component={FinanceHomeScreen} />
    <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ presentation: 'modal' }} />
  </Stack.Navigator>
);

// 3. Stack Bí mật (RLOS)
const RLOSStack = () => (
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
    <Stack.Screen name="LoanApplication" component={LoanApplicationScreen} options={{ headerShown: false }} />
    <Stack.Screen name="IncomeVerification" component={IncomeVerificationScreen} options={{ headerShown: false }} />
    <Stack.Screen name="FaceCapture" component={FaceCaptureScreen} options={{ headerShown: false }} />
    <Stack.Screen name="QrScan" component={QrScanScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ReviewAndSubmit" component={ReviewAndSubmitScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Status" component={StatusScreen} options={{ gestureEnabled: false, headerShown: false }} />
    <Stack.Screen name="ApplicationHistory" component={ApplicationHistoryScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

// --- CỔNG KIỂM SOÁT TỔNG (AuthGateway) ---
const AuthGateway = () => {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.appBackground }}>
        <ActivityIndicator size="large" color={colors.primaryBlue} />
      </View>
    );
  }

  // Chưa đăng nhập -> Vào cổng vỏ bọc (Login)
  if (!user) return <AuthStack />;

  // Đăng nhập bằng tài khoản bí mật -> Vào RLOS
  if (role === 'admin') return <RLOSStack />;

  // Các tài khoản khác -> Vào Vỏ bọc (Tài chính)
  return <FinanceStack />;
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <ApplicationProvider>
        <NavigationContainer>
          <AuthGateway />
        </NavigationContainer>
      </ApplicationProvider>
    </AuthProvider>
  );
}
