import { Image, ImageBackground, StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import ScreenWrapper from '@/core/ScreenWrapper'
import { Images } from '@/assets'
import { colors, hp, wp } from '@/theme'
import globalStyles from '@/styles/globalStyles'
// import { Ionicons } from '@expo/vector-icons'
import Svg, { Circle } from 'react-native-svg'
import AppText from '@/core/AppText'
import VectorIcons, { iconLibName } from '@/theme/vectorIcon'
import { screenNames } from '@/navigation/screenNames'

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const onboardingData = [
  {
    id: 1,
    title: "Find a Job that\nBest Fits You",
    description: "Lorem ipsum dolor sit amet, consectetur\nadipiscing elit, sed do eiusmod tempor\nincididunt ut labore"
  },
  {
    id: 2,
    title: "Discover Your\nDream Career",
    description: "Explore thousands of job opportunities\nwith all the information you need.\nIt's your future, come find it"
  },
  {
    id: 3,
    title: "Get Started\nToday",
    description: "Create your profile and start applying\nto jobs that match your skills\nand interests perfectly"
  }
];

const OnBoardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  const radius = 35;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    // Animate progress based on current index
    Animated.timing(progressAnim, {
      toValue: (currentIndex + 1) / 3,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Navigate to next screen (e.g., Login or Home)
      // navigation.navigate('Login');
      console.log('Onboarding completed!');
      navigation.navigate(screenNames.SIGN_IN)
    }
  };

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
        {/* Background pattern */}
        <ImageBackground 
          source={Images.authBG} 
          style={styles.backgroundPattern}
          resizeMode="cover"
        />
        
        {/* Bottom white container */}
        <View style={styles.bottomContainer}>
            {/* Illustration */}
            <Image 
              source={Images.topIllustration} 
              style={styles.illustration}
              resizeMode="contain"
            />
            
            {/* Content Container */}
            <View style={styles.contentContainer}>
                {/* Title */}
                <AppText style={styles.title}>{onboardingData[currentIndex].title}</AppText>
                
                {/* Description */}
                <AppText style={styles.description}>
                    {onboardingData[currentIndex].description}
                </AppText>
                
                {/* Page Indicators */}
                {/* <View style={styles.indicatorContainer}>
                    {onboardingData.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                index === currentIndex && styles.activeIndicator
                            ]}
                        />
                    ))}
                </View> */}
                
                {/* Next Button with Circular Progress */}
                <TouchableOpacity 
                    style={styles.nextButton} 
                    activeOpacity={0.8}
                    onPress={handleNext}
                >
                    {/* Background Circle (Gray) */}
                    <Svg 
                        width={hp(8)} 
                        height={hp(8)} 
                        style={styles.progressSvg}
                        viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}
                    >
                        {/* Background circle */}
                        <Circle
                            cx={radius + strokeWidth}
                            cy={radius + strokeWidth}
                            r={radius}
                            stroke="#E5E5E5"
                            strokeWidth={strokeWidth}
                            fill="none"
                        />
                        {/* Progress circle */}
                        <AnimatedCircle
                            cx={radius + strokeWidth}
                            cy={radius + strokeWidth}
                            r={radius}
                            stroke="#FF6B35"
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            transform={`rotate(-90 ${radius + strokeWidth} ${radius + strokeWidth})`}
                        />
                    </Svg>
                    
                    {/* Inner Circle Button */}
                    <View style={styles.innerCircle}>
                        <VectorIcons 
                            name={iconLibName.Ionicons}
                            iconName="chevron-forward"
                            size={24}
                            color={colors.white}
                        />
                        {/* <Ionicons 
                            name="chevron-forward" 
                            size={24} 
                            color={colors.white} 
                        /> */}
                    </View>
                </TouchableOpacity>
                
                {/* Skip Button (optional) */}
                {currentIndex < onboardingData.length - 1 && (
                    <TouchableOpacity 
                        style={styles.skipButton}
                        onPress={() => {
                            // navigation.navigate('Login');
                            console.log('Skip onboarding');
                        }}
                    >
                        <AppText style={styles.skipText}>Skip</AppText>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    </View>
  )
}

export default OnBoardingScreen

const styles = StyleSheet.create({
    container: {
        ...globalStyles.mainContainer,
        backgroundColor: '#F2F7FD',
    },
    backgroundPattern: {
        width: wp(100),
        height: hp(55),
        position: 'absolute',
        top: 0,
    },
    bottomContainer: {
        backgroundColor: colors.white,
        width: wp(100),
        height: hp(65),
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        alignItems: 'center',
    },
    illustration: {
        width: wp(75),
        height: hp(35),
        position: 'absolute',
        top: -hp(17),
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp(8),
        marginTop: hp(20),
    },
    title: {
        fontSize: hp(4),
        fontWeight: '700',
        color: '#1A1A1A',
        lineHeight: hp(4.5),
        textAlign: 'center',
    },
    description: {
        fontSize: hp(2),
        color: '#8B95A7',
        textAlign: 'center',
        lineHeight: hp(2.8),
        marginTop: hp(2),
        marginBottom: hp(3),
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(4),
    },
    indicator: {
        width: hp(1),
        height: hp(1),
        borderRadius: hp(0.5),
        backgroundColor: '#E5E5E5',
        marginHorizontal: wp(1),
    },
    activeIndicator: {
        width: hp(3),
        backgroundColor: '#FF6B35',
    },
    nextButton: {
        width: hp(9),
        height: hp(9),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    progressSvg: {
        position: 'absolute',
    },
    innerCircle: {
        width: hp(6),
        height: hp(6),
        borderRadius: hp(3.5),
        backgroundColor: '#4B3A5A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipButton: {
        marginTop: hp(2),
        paddingVertical: hp(1),
        paddingHorizontal: wp(5),
    },
    skipText: {
        fontSize: hp(1.8),
        color: '#8B95A7',
        fontWeight: '500',
    }
})