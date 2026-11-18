/**
 * @file src/app/(tabs)/_layout.tsx
 * Bottom Tabs Navigator with RTL Support, Badges, and Dynamic Brand Tokens.
 */

import { useLanguage } from "@/context/LanguageContext";
import { useCartStore } from "@/stores/useCartStore";
import { useStoreTheme } from "@/theme/ThemeContext";
import { Tabs } from "expo-router";
import {
  Grid2X2,
  House,
  Search,
  ShoppingCart,
  UserRound,
  type LucideIcon,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function TabIcon({
  icon,
  label,
  focused,
  color,
  badgeCount,
  isRTL,
  activeBackgroundColor,
}: {
  icon: LucideIcon;
  label: string;
  focused: boolean;
  color: string;
  badgeCount?: number;
  isRTL: boolean;
  activeBackgroundColor: string;
}) {
  const Icon = icon;
  const [scale] = useState(() => new Animated.Value(focused ? 1.05 : 1));
  const [opacity] = useState(() => new Animated.Value(focused ? 1 : 0.72));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: focused ? 1.05 : 1,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: focused ? 1 : 0.72,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused, opacity, scale]);

  return (
    <View style={styles.tabItemContainer} accessibilityLabel={label}>
      <Animated.View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: focused ? activeBackgroundColor : "transparent",
            direction: isRTL ? "rtl" : "ltr",
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <Icon size={27} color={color} strokeWidth={1.8} />
        {Boolean(badgeCount && badgeCount > 0) && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {badgeCount! > 99 ? "99+" : badgeCount}
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

export default function TabsLayout() {
  const { colors, storeConfig } = useStoreTheme();
  const { language, t, isRTL } = useLanguage();
  const itemCount = useCartStore((state) => state.getItemCount());
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.surface,
          shadowColor: "transparent",
          elevation: 0,
        },
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
          color: colors.textPrimary,
          textAlign: isRTL ? "right" : "left",
          writingDirection: isRTL ? "rtl" : "ltr",
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderLight,
          borderTopWidth: 1,
          flexDirection: "row",
          height: 64 + insets.bottom,
          alignItems: "center",
          justifyContent: "space-around",
          paddingTop: 0,
          paddingBottom: insets.bottom,
          direction: isRTL ? "rtl" : "ltr",
        },
        tabBarItemStyle: {
          flex: 1,
          height: 64,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 0,
        },
      }}
    >
      <Tabs.Screen
        name="categories"
        options={{
          title: t("التصنيفات"),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={Grid2X2}
              label={t("الأقسام")}
              focused={focused}
              color={focused ? colors.primary : colors.textMuted}
              isRTL={isRTL}
              activeBackgroundColor={colors.primaryLight}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t("البحث عن منتج"),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={Search}
              label={t("البحث")}
              focused={focused}
              color={focused ? colors.primary : colors.textMuted}
              isRTL={isRTL}
              activeBackgroundColor={colors.primaryLight}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: storeConfig.name[language],
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={House}
              label={t("الرئيسية")}
              focused={focused}
              color={focused ? colors.primary : colors.textMuted}
              isRTL={isRTL}
              activeBackgroundColor={colors.primaryLight}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t("سلة المشتريات"),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={ShoppingCart}
              label={t("السلة")}
              focused={focused}
              color={focused ? colors.primary : colors.textMuted}
              badgeCount={itemCount}
              isRTL={isRTL}
              activeBackgroundColor={colors.primaryLight}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("حسابي"),
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={UserRound}
              label={t("حسابي")}
              focused={focused}
              color={focused ? colors.primary : colors.textMuted}
              isRTL={isRTL}
              activeBackgroundColor={colors.primaryLight}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
});
