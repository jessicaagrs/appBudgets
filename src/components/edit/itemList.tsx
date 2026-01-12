import { theme } from '@/theme/theme';
import { Item } from '@/types/budget.type';
import { formatCurrency } from '@/utils/formatters';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../common';

type ItemListProps = Readonly<{
  data: Item;
  onEdit: (id: string) => void;
}>;

export function ItemList({ data, onEdit }: ItemListProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{data.detail}</Text>
        <Text
          style={styles.description}
          numberOfLines={1}
        >
          {data.description}
        </Text>
      </View>
      <View style={styles.actionContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatCurrency(data.price)}</Text>
          <Text style={styles.quantity}>Qt: {data.qty}</Text>
        </View>
        <Button
          label=''
          style={styles.button}
          onPress={() => onEdit(data.id)}
          colorIcon={theme.colors.purple_base}
          iconName='edit'
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    gap: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  textContainer: {
    gap: 4,
    flex: 1,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  priceContainer: {
    gap: 4,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.gray_700,
  },
  description: {
    fontSize: 12,
    color: theme.colors.gray_500,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.gray_700,
  },
  quantity: {
    fontSize: 12,
    color: theme.colors.gray_600,
  },
  button: {
    minWidth: 40,
    minHeight: 40,
    backgroundColor: theme.colors.white,
  },
});
