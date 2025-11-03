import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventsScreen from '../screens/EventsScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import EventFormScreen from '../screens/EventFormScreen';
import colors from '../theme/colors';
import TicketScreen from '../screens/TicketScreen';

const Stack = createNativeStackNavigator();

export default function EventsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.primary,
        contentStyle: { backgroundColor: colors.bg }
      }}
    >
      <Stack.Screen name="ListaEventos" component={EventsScreen} options={{ title: 'Eventos' }} />
      <Stack.Screen name="DetalleEvento" component={EventDetailScreen} options={{ title: 'Detalle' }} />
      <Stack.Screen name="FormEvento" component={EventFormScreen} options={{ title: 'Nuevo / Editar' }} />
      <Stack.Screen name="Ticket" component={TicketScreen} options={{ title: 'Mi Ticket' }} />
    </Stack.Navigator>
  );
}
