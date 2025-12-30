import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import HomeScreen from '@/app/routes/home';

import { BudgetProvider } from '@/context/budget.context';
import { theme } from '@/theme/theme';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator
      id='root'
      initialRouteName='Home'
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.white },
      }}
    >
      <Stack.Screen
        name='Home'
        component={HomeScreen}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView
          style={styles.statusbar}
          edges={['top', 'bottom']}
        >
          <BudgetProvider>
            <RootStack />
          </BudgetProvider>
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  statusbar: {
    flex: 1,
    backgroundColor: '#000',
  },
});
