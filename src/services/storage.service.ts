import AsyncStorage from '@react-native-async-storage/async-storage';

import { Budget, Item } from '@/types/budget.type';

import { DATA } from './data';

const KEY = 'budgets';

const getBudgets = async () => {
  try {
    const value = await AsyncStorage.getItem(KEY);

    if (value !== null) {
      return JSON.parse(value) as Budget[];
    }

    await createBudget(DATA);
    return DATA;
  } catch (error) {
    console.log(`Log error getBudgets: ${error}`);
    return [];
  }
};

const createBudget = async (value: Budget[]) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(KEY, jsonValue);
  } catch (error) {
    console.log(`Log error createBudget: ${error}`);
  }
};

const sumPricesBugets = (items: Item[]) => {
  if (!items || items.length === 0) {
    return 0;
  }

  return items.reduce((total, item) => total + item.price * item.qty, 0);
};

export { createBudget, getBudgets, sumPricesBugets };
