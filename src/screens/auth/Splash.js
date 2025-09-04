import {StyleSheet, View, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {screenNames} from '@/navigation/screenNames';
import ScreenWrapper from '@/core/ScreenWrapper';
import globalStyles from '@/styles/globalStyles';
import {Images} from '@/assets';
import {wp} from '@/theme';

const Splash = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      navigation.replace(screenNames.ROOT_NAVIGATION);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ScreenWrapper>
      <View style={globalStyles.centerContent}>
        <Animated.Image
          source={Images.logo}
          style={[styles.logoImage, {opacity: fadeAnim}]}
          resizeMode="contain"
        />
      </View>
    </ScreenWrapper>
  );
};

export default Splash;

const styles = StyleSheet.create({
  logoImage: {
    width: wp(100),
    height: wp(40),
  },
});
