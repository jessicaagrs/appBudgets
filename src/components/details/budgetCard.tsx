import Icon from '@expo/vector-icons/FontAwesome6';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme/theme';
import { Budget } from '@/types/budget.type';

type BudgetCardProps = Readonly<{
  budget: Budget;
}>;

export function BudgetCard({ budget }: BudgetCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon
          name='shop'
          size={24}
          color={theme.colors.purple_base}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{budget.title}</Text>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Cliente</Text>
          <Text style={styles.value}>{budget.client}</Text>
        </View>
        <View style={styles.datesRow}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Criado em</Text>
            <Text style={styles.dateValue}>{formatDate(budget.createdAt)}</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Atualizado em</Text>
            <Text style={styles.dateValue}>{formatDate(budget.updatedAt)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    backgroundColor: theme.colors.gray_100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.gray_200,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: theme.colors.gray_700,
  },
  infoSection: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    lineHeight: 20,
    color: theme.colors.gray_500,
  },
  value: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.gray_700,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 24,
  },
  dateItem: {
    gap: 4,
  },
  dateLabel: {
    fontSize: 12,
    lineHeight: 20,
    color: theme.colors.gray_500,
  },
  dateValue: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.gray_700,
  },
});
