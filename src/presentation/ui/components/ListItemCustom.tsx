import React, { JSX } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ViewStyle, TextStyle } from "react-native";

type ListItemProps = {
  title: string;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  onPress?: () => void;
  marginTop?: number;
  marginBottom?: number;
  customTitleStyle?: TextStyle
};

const ListItem: React.FC<ListItemProps> = ({
  title,
  leftIcon,
  rightIcon,
  marginTop,
  marginBottom,
  onPress,
  customTitleStyle
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { marginTop, marginBottom }]}>
      <View style={{ flexDirection: "row", alignItems: "center" }} >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <Text style={[styles.title, customTitleStyle]}>{title}</Text>
      </View>

      {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 10,
  },
  title: {
    color: "#ffffff",
    fontSize: 16,
  },
  chevron: {
    color: "#a0a0a0",
    fontSize: 18,
  },
});

export { ListItem };
