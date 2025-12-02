// components/FastImageView.js

import {Images} from '@/assets';
import images from '@/assets/images';
import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';

const FastImageView = ({
  source,
  fallbackImage = images?.dummyUser,
  style,
  resizeMode = null,
  loadingSize = 'small',
}) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  // console.log('sour',  source)
  return (
    <View style={[styles.container, style]}>
      {loading && (
        <ActivityIndicator style={StyleSheet.absoluteFill} size={loadingSize} />
      )}
      <FastImage
        style={[StyleSheet.absoluteFill, style]}
        source={
          typeof source === 'string'
            ? {uri: source, priority: FastImage.priority.normal}
            : source
              ? source
              : fallbackImage
        }
        resizeMode={resizeMode}
        defaultSource={Images.logo}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FastImageView;
