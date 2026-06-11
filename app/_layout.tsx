import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ThemeProvider, useTheme } from "../context/themeContext";

function TabLayout() {
  const { isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
          borderTopColor: isDark ? '#333' : '#e0e0e0',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "options" : "options-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="times" options={{ href: null }} />
      <Tabs.Screen name="themes" options={{ href: null }} />
    </Tabs>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <TabLayout />
    </ThemeProvider>
  );
}