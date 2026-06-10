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
      
      <Tabs.Screen
        name="settings" 
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "options" : "options-outline"} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          href: null,
        }}
      />


      <Tabs.Screen
        name="times"
        options={{
          href: null,
        }}
      />


        <Tabs.Screen
        name="themes"
        options={{
          href: null,
        }}
      />


      <Tabs.Screen
        name="ocrTrain"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}