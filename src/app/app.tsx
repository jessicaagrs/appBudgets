import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import EditScreen from '@/app/routes/edit';
import HomeScreen from '@/app/routes/home';
import DetailsScreen from '@/app/routes/details';

import { BudgetProvider } from '@/context/budget.context';
import { theme } from '@/theme/theme';

export type RootStackParamList = {
  Home: undefined;
  Edit: { budgetId?: string } | undefined;
  Details: { budgetId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList, 'root'>();

function RootStack() {
  return (
    <Stack.Navigator
      id='root'
      initialRouteName='Home'
      screenOptions={{
        contentStyle: { backgroundColor: theme.colors.white },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name='Home'
        component={HomeScreen}
      />
      <Stack.Screen
        name='Edit'
        component={EditScreen}
      />
      <Stack.Screen
        name='Details'
        component={DetailsScreen}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.statusbar}>
        <StatusBar
          animated={true}
          barStyle={'dark-content'}
        />
        <NavigationContainer>
          <BudgetProvider>
            <RootStack />
          </BudgetProvider>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  statusbar: {
    flex: 1,
  },
});
