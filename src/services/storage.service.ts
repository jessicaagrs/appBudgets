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

const deleteBudget = async (budgetId: string) => {
  try {
    const budgets = await getBudgets();
    const filteredBudgets = budgets.filter(b => b.id !== budgetId);
    await createBudget(filteredBudgets);
    return true;
  } catch (error) {
    console.log(`Log error deleteBudget: ${error}`);
    return false;
  }
};

const duplicateBudget = async (budgetId: string) => {
  try {
    const budgets = await getBudgets();
    const budgetToDuplicate = budgets.find(b => b.id === budgetId);

    if (!budgetToDuplicate) {
      return null;
    }

    const now = new Date().toISOString();
    const duplicatedBudget: Budget = {
      ...budgetToDuplicate,
      id: String(Date.now()), // Gera um novo ID único
      title: `${budgetToDuplicate.title} (Cópia)`,
      createdAt: now,
      updatedAt: now,
    };

    await createBudget([...budgets, duplicatedBudget]);
    return duplicatedBudget;
  } catch (error) {
    console.log(`Log error duplicateBudget: ${error}`);
    return null;
  }
};

const updateBudget = async (budgetId: string, updatedBudget: Budget) => {
  try {
    const budgets = await getBudgets();
    const budgetIndex = budgets.findIndex(b => b.id === budgetId);

    if (budgetIndex === -1) {
      return false;
    }

    budgets[budgetIndex] = {
      ...updatedBudget,
      id: budgetId,
      updatedAt: new Date().toISOString(),
    };

    await createBudget(budgets);
    return true;
  } catch (error) {
    console.log(`Log error updateBudget: ${error}`);
    return false;
  }
};

const sumPricesBugets = (items: Item[]) => {
  if (!items || items.length === 0) {
    return 0;
  }

  return items.reduce((total, item) => total + item.price * item.qty, 0);
};

export {
  createBudget,
  deleteBudget,
  duplicateBudget,
  getBudgets,
  sumPricesBugets,
  updateBudget,
};

