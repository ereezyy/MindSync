import React from 'react';
import { View, ViewStyle, I18nManager } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';

interface RTLSafeViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
}

export const RTLSafeView: React.FC<RTLSafeViewProps> = ({
  children,
  style,
  flexDirection = 'row',
  alignItems,
  justifyContent,
}) => {
  const { isRTL } = useTranslation();

  // Automatically flip row directions for RTL
  const getFlexDirection = () => {
    if (!isRTL) return flexDirection;
    
    if (flexDirection === 'row') return 'row-reverse';
    if (flexDirection === 'row-reverse') return 'row';
    return flexDirection; // column and column-reverse stay the same
  };

  // Flip alignment for RTL
  const getAlignItems = () => {
    if (!isRTL || !alignItems) return alignItems;
    
    if (alignItems === 'flex-start') return 'flex-end';
    if (alignItems === 'flex-end') return 'flex-start';
    return alignItems;
  };

  // Flip justification for RTL
  const getJustifyContent = () => {
    if (!isRTL || !justifyContent) return justifyContent;
    
    if (justifyContent === 'flex-start') return 'flex-end';
    if (justifyContent === 'flex-end') return 'flex-start';
    return justifyContent;
  };

  const rtlSafeStyle: ViewStyle = {
    ...style,
    flexDirection: getFlexDirection(),
    alignItems: getAlignItems(),
    justifyContent: getJustifyContent(),
  };

  return <View style={rtlSafeStyle}>{children}</View>;
};

// Text direction component
export const RTLSafeText: React.FC<{
  children: React.ReactNode;
  style?: any;
}> = ({ children, style }) => {
  const { isRTL } = useTranslation();
  
  const textStyle = {
    ...style,
    textAlign: isRTL ? ('right' as const) : ('left' as const),
    writingDirection: isRTL ? ('rtl' as const) : ('ltr' as const),
  };

  // Use React Native Text component
  const { Text } = require('react-native');
  return <Text style={textStyle}>{children}</Text>;
};

// Margin/Padding helpers for RTL
export const useRTLStyles = () => {
  const { isRTL } = useTranslation();

  return {
    // Margin helpers
    marginStart: (value: number) => ({ [isRTL ? 'marginRight' : 'marginLeft']: value }),
    marginEnd: (value: number) => ({ [isRTL ? 'marginLeft' : 'marginRight']: value }),
    
    // Padding helpers
    paddingStart: (value: number) => ({ [isRTL ? 'paddingRight' : 'paddingLeft']: value }),
    paddingEnd: (value: number) => ({ [isRTL ? 'paddingLeft' : 'paddingRight']: value }),
    
    // Position helpers
    left: (value: number) => ({ [isRTL ? 'right' : 'left']: value }),
    right: (value: number) => ({ [isRTL ? 'left' : 'right']: value }),
    
    // Border helpers
    borderStartWidth: (value: number) => ({ [isRTL ? 'borderRightWidth' : 'borderLeftWidth']: value }),
    borderEndWidth: (value: number) => ({ [isRTL ? 'borderLeftWidth' : 'borderRightWidth']: value }),
    
    // Text alignment
    textAlign: isRTL ? ('right' as const) : ('left' as const),
    textAlignOpposite: isRTL ? ('left' as const) : ('right' as const),
    
    // Flex direction
    flexRow: isRTL ? ('row-reverse' as const) : ('row' as const),
    flexRowReverse: isRTL ? ('row' as const) : ('row-reverse' as const),
  };
};

// Icon rotation for RTL (for arrows, etc.)
export const useRTLIconRotation = () => {
  const { isRTL } = useTranslation();
  
  return {
    // Rotate arrows for RTL
    arrowLeft: isRTL ? 'arrow-right' : 'arrow-left',
    arrowRight: isRTL ? 'arrow-left' : 'arrow-right',
    chevronLeft: isRTL ? 'chevron-right' : 'chevron-left',
    chevronRight: isRTL ? 'chevron-left' : 'chevron-right',
    
    // Transform style for custom icons
    transform: isRTL ? [{ scaleX: -1 }] : undefined,
  };
};