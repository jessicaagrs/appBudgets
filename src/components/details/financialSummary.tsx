import Icon from '@expo/vector-icons/FontAwesome6';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme/theme';
import { formatCurrency } from '@/utils/formatters';

type FinancialSummaryProps = Readonly<{
  subtotal: number;
  discount: number;
  total: number;
}>;

export function FinancialSummary({
  subtotal,
  discount,
  total,
}: FinancialSummaryProps) {
  const discountPercentage =
    subtotal > 0 ? ((discount / subtotal) * 100).toFixed(0) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon
          name='calculator'
          size={20}
          color={theme.colors.purple_base}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
        </View>
        {discount > 0 && (
          <View style={styles.row}>
            <View style={styles.discountLabel}>
              <Text style={styles.label}>Desconto</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>
                  {discountPercentage}% off
                </Text>
              </View>
            </View>
            <Text style={styles.discountValue}>
              - {formatCurrency(discount)}
            </Text>
          </View>
        )}
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Investimento total</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: theme.colors.gray_100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.gray_200,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.gray_600,
  },
  value: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.gray_700,
  },
  discountLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountBadge: {
    backgroundColor: theme.colors.sucess_light,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.sucess_dark,
  },
  discountValue: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.gray_700,
  },
  totalRow: {
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: theme.colors.gray_700,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: theme.colors.gray_700,
  },
});
