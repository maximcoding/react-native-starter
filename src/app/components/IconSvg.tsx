import React from 'react';
import { View } from 'react-native';
import { AppIcon, IconName } from '@assets/icons';

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  style?: any;
}

export const IconSvg = ({ name, size = 24, color = '#000', style }: Props) => {
  const IconComponent = AppIcon[name];

  if (!IconComponent) {
    console.warn(`❗ IconSvg: icon "${name}" not found in AppIcon`);
    return <View style={{ width: size, height: size }} />;
  }

  return (
    <View style={style}>
      <IconComponent
        width={size}
        height={size}
        stroke={color}
        fill={color}
        strokeWidth={2}
      />
    </View>
  );
};
