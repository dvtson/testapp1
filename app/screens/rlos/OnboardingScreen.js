import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Lightning, IdentificationCard, ShieldCheck } from 'phosphor-react-native';
import { colors, spacing, radius, typography } from '../../../constants/theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    title: "Vay nhanh, duyệt tự động",
    description: "Nhận kết quả phê duyệt khoản vay chỉ trong vài giây hoàn toàn tự động.",
    icon: <Lightning size={80} color={colors.primaryBlue} weight="duotone" />
  },
  {
    id: 2,
    title: "Không cần giấy tờ phức tạp",
    description: "Chỉ cần chụp ảnh CCCD để điền thông tin tự động, không rườm rà.",
    icon: <IdentificationCard size={80} color={colors.primaryBlue} weight="duotone" />
  },
  {
    id: 3,
    title: "Bảo mật thông tin tuyệt đối",
    description: "Hệ thống an toàn, không lưu trữ dữ liệu cá nhân nhạy cảm trên máy.",
    icon: <ShieldCheck size={80} color={colors.primaryBlue} weight="duotone" />
  }
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      scrollViewRef.current?.scrollTo({ x: width * (currentIndex + 1), animated: true });
    } else {
      navigation.replace('Consent'); // Dùng replace để không quay lại được onboarding
    }
  };

  const handleSkip = () => {
    navigation.replace('Consent');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header: Logo và nút Bỏ qua */}
      <View style={styles.header}>
        <Image 
          source={require('../../../assets/images/vrb-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Bỏ qua</Text>
        </TouchableOpacity>
      </View>

      {/* Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <View style={styles.iconContainer}>
              {slide.icon}
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Controls */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : null
              ]} 
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === SLIDES.length - 1 ? 'Bắt đầu ngay' : 'Tiếp tục'}
          </Text>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  logo: {
    width: 120,
    aspectRatio: 1417 / 856, // Giữ đúng tỷ lệ gốc ~1.65:1
  },
  skipBtn: {
    padding: spacing.sm,
  },
  skipText: {
    fontFamily: typography.medium,
    color: colors.secondaryText,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    elevation: 2,
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontFamily: typography.bold,
    fontSize: 24,
    color: colors.primaryBlue,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontFamily: typography.regular,
    fontSize: 16,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderLight,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primaryRed,
  },
  button: {
    backgroundColor: colors.primaryRed,
    paddingVertical: 16,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: typography.semiBold,
    color: colors.surface,
    fontSize: 16,
  }
});
