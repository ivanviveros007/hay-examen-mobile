import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TAB_WIDTH = 130;
const TAB_HEIGHT = 54;
const INDICATOR_PADDING = 4;

const TABS = [
  { name: 'index', emoji: '🏠', label: 'Inicio' },
  { name: 'perfil', emoji: '📋', label: 'Exámenes' },
];

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const animated = useRef(new Animated.Value(state.index)).current;

  useEffect(() => {
    Animated.spring(animated, {
      toValue: state.index,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
    }).start();
  }, [state.index]);

  const indicatorX = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [INDICATOR_PADDING, TAB_WIDTH + INDICATOR_PADDING],
  });

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + -5 }]}>
      <View style={styles.pill}>
        <Animated.View
          style={[styles.indicator, { transform: [{ translateX: indicatorX }] }]}
        />
        {TABS.map((tab, index) => {
          const isFocused = state.index === index;
          const route = state.routes[index];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(tab.name);
            }
          };

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={onPress}
              style={styles.tab}
              activeOpacity={0.8}
            >
              <Text style={styles.emoji}>{tab.emoji}</Text>
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignSelf: 'center',
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: '#1E1035',
    borderRadius: 40,
    padding: INDICATOR_PADDING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  indicator: {
    position: 'absolute',
    top: INDICATOR_PADDING,
    width: TAB_WIDTH,
    height: TAB_HEIGHT,
    borderRadius: 36,
    backgroundColor: '#8B5CF6',
  },
  tab: {
    width: TAB_WIDTH,
    height: TAB_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    zIndex: 1,
  },
  emoji: { fontSize: 18 },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  labelActive: {
    color: '#FFFFFF',
  },
});
