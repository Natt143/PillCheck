import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
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
      {/* Updated from profile to settings */}
      <Tabs.Screen
        name="settings" 
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            /* Using options-outline or information-circle-outline for an info/settings look */
            <Ionicons name={focused ? "options" : "options-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}