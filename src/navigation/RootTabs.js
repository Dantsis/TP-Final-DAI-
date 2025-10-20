import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EventsStack from './EventsStack';
import ScannerScreen from '../screens/ScannerScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import colors from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: '#000' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutted,
        tabBarIcon: ({ color, size }) => {
          const map = {
            Eventos: 'calendar',
            Escanear: 'qr-code',
            Mapa: 'map',
            Perfil: 'person'
          };
          return <Ionicons name={map[route.name]} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Eventos" component={EventsStack} />
      <Tab.Screen name="Escanear" component={ScannerScreen} />
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
