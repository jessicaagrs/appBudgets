import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { BudgetStatus, SortOptionBudgets } from '@/enum/enum';

import {
  deleteBudget,
  duplicateBudget,
  getBudgets,
  sumPricesBugets,
  updateBudget,
} from '@/services/storage.service';

import { Budget } from '@/types/budget.type';

type BudgetContextValue = {
  data: Budget[];
  loading: boolean;
  error: string;
  fetchBudgets: () => Promise<void>;
  deleteBudget: (budgetId: string) => Promise<boolean>;
  duplicateBudget: (budgetId: string) => Promise<Budget | null>;
  updateBudget: (budgetId: string, budget: Budget) => Promise<boolean>;
  applyFilters: (params?: {
    sort?: SortOptionBudgets;
    status?: BudgetStatus;
    query?: string;
  }) => void;
  resetFilters: () => void;
};

const BudgetContext = createContext<BudgetContextValue | null>(null);

function sortBudgets(list: Budget[], sortOption: SortOptionBudgets) {
  const sorted = [...list];

  switch (sortOption) {
    case SortOptionBudgets.DATE_ASC:
      sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;

    case SortOptionBudgets.DATE_DESC:
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;

    case SortOptionBudgets.AMOUNT_ASC:
      sorted.sort(
        (a, b) => sumPricesBugets(a.items) - sumPricesBugets(b.items)
      );
      break;

    case SortOptionBudgets.AMOUNT_DESC:
      sorted.sort(
        (a, b) => sumPricesBugets(b.items) - sumPricesBugets(a.items)
      );
      break;

    default:
      break;
  }

  return sorted;
}

export function BudgetProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [allBudgets, setAllBudgets] = useState<Budget[]>([]);
  const [data, setData] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const budgets = await getBudgets();
      setAllBudgets(budgets);
      setData(budgets);
    } catch (err) {
      const message = (err as Error).message || 'Erro ao buscar orçamentos';
      setError(message);
      console.error('hook/useBudget.fetchBudgets', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteBudget = useCallback(
    async (budgetId: string) => {
      const success = await deleteBudget(budgetId);
      if (success) {
        await fetchBudgets();
      }
      return success;
    },
    [fetchBudgets]
  );

  const handleDuplicateBudget = useCallback(
    async (budgetId: string) => {
      const duplicated = await duplicateBudget(budgetId);
      if (duplicated) {
        await fetchBudgets();
      }
      return duplicated;
    },
    [fetchBudgets]
  );

  const handleUpdateBudget = useCallback(
    async (budgetId: string, budget: Budget) => {
      const success = await updateBudget(budgetId, budget);
      if (success) {
        await fetchBudgets();
      }
      return success;
    },
    [fetchBudgets]
  );

  const applyFilters = useCallback(
    (params?: {
      sort?: SortOptionBudgets;
      status?: BudgetStatus;
      query?: string;
    }) => {
      const { sort, status, query } = params ?? {};

      let next = allBudgets;

      if (query?.trim()) {
        const q = query.trim().toLowerCase();
        next = next.filter(
          budget =>
            budget.client.toLowerCase().includes(q) ||
            budget.title.toLowerCase().includes(q)
        );
      }

      if (status != null) {
        next = next.filter(budget => budget.status === status);
      }

      if (sort != null) {
        next = sortBudgets(next, sort);
      }

      setData(next);
    },
    [allBudgets]
  );

  const resetFilters = useCallback(() => {
    setData(allBudgets);
  }, [allBudgets]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const value = useMemo<BudgetContextValue>(
    () => ({
      data,
      loading,
      error,
      fetchBudgets,
      deleteBudget: handleDeleteBudget,
      duplicateBudget: handleDuplicateBudget,
      updateBudget: handleUpdateBudget,
      applyFilters,
      resetFilters,
    }),
    [
      data,
      loading,
      error,
      fetchBudgets,
      handleDeleteBudget,
      handleDuplicateBudget,
      handleUpdateBudget,
      applyFilters,
      resetFilters,
    ]
  );

  return (
    <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
  );
}

export default function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error('useBudget must be used within <BudgetProvider>');
  }
  return ctx;
}
