import { FC, ReactNode, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { theme } from "@/presentation/ui/styles/colorsTheme";

const SafeAreaContainer: FC<{
  children?: ReactNode;
  customStyles?: object;
  customLoading?: boolean;
  disabledPaddingHorizontal?: boolean;

}> = ({
  children,
  customStyles = { backgroundColor: theme.primary.main },
  customLoading,
  disabledPaddingHorizontal
}) => {
    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState(false);

    return (
      <>
        {(customLoading || loading) && (
          <View
            style={{
              position: "absolute",
              zIndex: 999,
              height: "100%",
              width: "100%",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.6)",
            }}
          >
            <ActivityIndicator style={{}} size="large" color={theme.shape.background} />
          </View>
        )}

        <View
          style={[
            {
              flex: 1,
              paddingHorizontal: disabledPaddingHorizontal ? 0 : 16,
            }
            ,
            styles.background,
            { paddingTop: insets.top, paddingBottom: insets.bottom },
            customStyles,
          ]}
        >
          {children}
        </View>

      </>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
});

export { SafeAreaContainer };
