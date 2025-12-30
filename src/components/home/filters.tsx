import { Checkbox } from 'expo-checkbox';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BudgetStatus, SortOptionBudgets } from '@/enum/enum';
import { theme } from '@/theme/theme';

import { Button, Input, Modal, Tag } from '../common';
import { IconFilter } from './iconFilter';

import useBudget from '@/context/budget.context';

export function Filters() {
  const [modalVisible, setModalVisible] = useState(false);
  const [query, setQuery] = useState('');

  const [selectedStatus, setSelectedStatus] = useState<BudgetStatus | null>(
    null
  );
  const [selectedSortOption, setSelectedSortOption] =
    useState<SortOptionBudgets | null>(null);

  const [appliedStatus, setAppliedStatus] = useState<BudgetStatus | null>(null);
  const [appliedSortOption, setAppliedSortOption] =
    useState<SortOptionBudgets | null>(null);

  const { applyFilters, resetFilters } = useBudget();

  const statuses = useMemo(
    () => [
      BudgetStatus.RASCUNHO,
      BudgetStatus.ENVIADO,
      BudgetStatus.APROVADO,
      BudgetStatus.RECUSADO,
    ],
    []
  );

  const sortOptions = useMemo(
    () => [
      SortOptionBudgets.DATE_DESC,
      SortOptionBudgets.DATE_ASC,
      SortOptionBudgets.AMOUNT_DESC,
      SortOptionBudgets.AMOUNT_ASC,
    ],
    []
  );

  const toggleStatus = useCallback(
    (status: BudgetStatus, nextValue: boolean) => {
      setSelectedStatus(prev => {
        if (nextValue) return status;
        if (prev === status) return null;
        return prev;
      });
    },
    []
  );

  const toggleSortOption = useCallback(
    (sortOption: SortOptionBudgets, nextValue: boolean) => {
      setSelectedSortOption(prev => {
        if (nextValue) return sortOption;
        if (prev === sortOption) return null;
        return prev;
      });
    },
    []
  );

  useEffect(() => {
    const id = setTimeout(() => {
      applyFilters({
        query,
        status: appliedStatus ?? undefined,
        sort: appliedSortOption ?? undefined,
      });
    }, 200);

    return () => clearTimeout(id);
  }, [query, appliedStatus, appliedSortOption, applyFilters]);

  const handlePressResetFilters = useCallback(() => {
    setQuery('');
    setSelectedStatus(null);
    setSelectedSortOption(null);
    setAppliedStatus(null);
    setAppliedSortOption(null);

    resetFilters();

    setTimeout(() => setModalVisible(false), 300);
  }, [resetFilters]);

  const handlePressApplyFilters = useCallback(() => {
    setAppliedStatus(selectedStatus);
    setAppliedSortOption(selectedSortOption);

    applyFilters({
      query,
      status: selectedStatus ?? undefined,
      sort: selectedSortOption ?? undefined,
    });

    setModalVisible(false);
  }, [applyFilters, query, selectedStatus, selectedSortOption]);

  const handlePressFilterAndSort = useCallback(() => {
    setSelectedStatus(appliedStatus);
    setSelectedSortOption(appliedSortOption);
    setModalVisible(true);
  }, [appliedStatus, appliedSortOption]);

  return (
    <View style={styles.container}>
      <Input
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        autoCapitalize='none'
        clearButtonMode='while-editing'
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handlePressFilterAndSort}
      >
        <IconFilter />
      </TouchableOpacity>

      <Modal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      >
        <View style={styles.filterContainer}>
          <Text>Status</Text>
          {statuses.map(status => (
            <View
              key={String(status)}
              style={styles.filterList}
            >
              <Checkbox
                style={styles.checkbox}
                value={selectedStatus === status}
                onValueChange={(newValue: boolean) =>
                  toggleStatus(status, newValue)
                }
              />
              <Tag status={status} />
            </View>
          ))}
        </View>

        <View style={styles.filterContainer}>
          <Text>Ordenação</Text>
          {sortOptions.map(sortOption => (
            <View
              key={String(sortOption)}
              style={styles.filterList}
            >
              <Checkbox
                style={styles.radio}
                value={selectedSortOption === sortOption}
                onValueChange={(newValue: boolean) =>
                  toggleSortOption(sortOption, newValue)
                }
              />
              <Text>{sortOption}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Button
            showIcon={false}
            label='Resetar filtros'
            style={{
              backgroundColor: theme.colors.gray_100,
              borderWidth: 1,
              borderColor: theme.colors.gray_300,
            }}
            styleLabel={{ color: theme.colors.purple_base }}
            onPress={handlePressResetFilters}
          />
          <Button
            iconName='check'
            label='Aplicar'
            onPress={handlePressApplyFilters}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 50,
    backgroundColor: theme.colors.gray_100,
  },
  filterContainer: {
    gap: 16,
  },
  filterList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderColor: theme.colors.gray_400,
    borderWidth: 1,
    borderRadius: 4,
  },
  radio: {
    width: 20,
    height: 20,
    borderColor: theme.colors.gray_400,
    borderWidth: 1,
    borderRadius: 10,
  },
  footer: {
    paddingVertical: 20,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray_200,
  },
});
