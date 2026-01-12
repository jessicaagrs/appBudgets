import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { theme } from '@/theme/theme';

import { Budget } from '@/types/budget.type';

import { formatCurrency } from '@/utils/formatters';

import { sumPricesBugets } from '@/services/storage.service';

import { Tag } from '../common';

import { RootStackParamList } from '@/app/app';

type BudgetProps = {
  budget: Budget;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export const CardBudget = ({ budget }: BudgetProps) => {
  const navigation = useNavigation<NavigationProps>();

  const handlePress = () => {
    navigation.navigate('Details', { budgetId: budget.id });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
    >
      <View style={styles.text}>
        <Text style={styles.title}>{budget.title}</Text>
        <Text style={styles.subtitle}>{budget.client}</Text>
      </View>
      <View style={styles.info}>
        <Tag status={budget.status} />
        <View style={styles.price}>
          <Text style={styles.priceSymbol}>R$</Text>
          <Text style={styles.priceValue}>
            {formatCurrency(sumPricesBugets(budget.items))}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    padding: 16,
    backgroundColor: theme.colors.gray_100,
    borderWidth: 1,
    borderColor: theme.colors.gray_200,
    width: '100%',
    borderRadius: 10,
  },
  text: {
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: theme.colors.gray_700,
    maxWidth: 215,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.gray_600,
    maxWidth: 215,
  },
  info: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 16,
  },
  price: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  priceSymbol: {
    fontSize: 12,
    lineHeight: 20,
    color: theme.colors.gray_700,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: theme.colors.gray_700,
  },
});
