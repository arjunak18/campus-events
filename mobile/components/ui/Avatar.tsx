import React from 'react';
import { View, Text, Image } from 'react-native';
import { theme } from '../../constants/theme';

interface AvatarProps {
  url?: string;
  uri?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar = ({ url, uri, initials, size = 'md' }: AvatarProps) => {
  const sizeMap = { sm: 32, md: 48, lg: 64, xl: 96 };
  const s = sizeMap[size];
  const imageSource = url || uri;

  return (
    <View style={[{ width: s, height: s, borderRadius: s / 2, backgroundColor: theme.colors.secondary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }]}>
      {imageSource ? (
        <Image source={{ uri: imageSource }} style={{ width: s, height: s }} />
      ) : (
        <Text style={{ color: theme.colors.text, fontWeight: 'bold', fontSize: s * 0.4 }}>
          {initials || '?'}
        </Text>
      )}
    </View>
  );
};