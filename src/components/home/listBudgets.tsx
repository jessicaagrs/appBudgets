import { useEffect } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { CardBudget } from './cardBudget';

import useBudget from '@/context/budget.context';

const Separator = () => <View style={styles.separator} />;

export function ListBudgets() {
  const { data: budgets, loading, error } = useBudget();

  useEffect(() => {
    if (error) {
      Alert.alert('Ocorreu um erro inesperado', error);
    }
  }, [error]);

  if (loading) {
    return <Text style={styles.loadingText}>Carregando orçamentos...</Text>;
  }

  return (
    <FlatList
      data={budgets}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <CardBudget budget={item} />}
      ItemSeparatorComponent={Separator}
    />
  );
}

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  separator: {
    height: 8,
  },
});
