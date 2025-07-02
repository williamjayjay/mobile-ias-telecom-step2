import React from "react";
import { Text, TextProps, TextStyle } from "react-native";

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  customNumberOfLines?: number;
  style?: TextStyle | TextStyle[];
}

const TextCustom: React.FC<CustomTextProps> = ({
  children,
  customNumberOfLines = 1,
  style,
  ...props
}) => {

  const baseStyle: TextStyle = { lineHeight: 35 };

  return (
    <Text
      numberOfLines={customNumberOfLines}
      allowFontScaling={false}
      style={[baseStyle, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

export { TextCustom };
