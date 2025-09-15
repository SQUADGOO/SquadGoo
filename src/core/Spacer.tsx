
// Spacer.tsx
import React from 'react';
import { View } from 'react-native';

type SpacerProps = {
  size?: number;       // how much space
  horizontal?: boolean; // horizontal vs vertical
};

const Spacer: React.FC<SpacerProps> = ({ size = 8, horizontal = false }) => {
  return (
    <View style={horizontal ? { width: size } : { height: size }} />
  );
};

export default Spacer;
