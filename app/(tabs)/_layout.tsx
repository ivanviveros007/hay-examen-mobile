import React from 'react';
import { Tabs } from 'expo-router';
import { CustomTabBar } from '../../src/components/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#F8F4FF' },
        headerShadowVisible: false,
        headerTintColor: '#3D2060',
        headerTitleStyle: { fontWeight: '800', fontSize: 16 },
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerTitle: 'Hay Examen ✏️',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Mis Exámenes',
          headerTitle: '🎒 Mis Exámenes',
        }}
      />
    </Tabs>
  );
}
