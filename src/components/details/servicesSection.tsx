import Icon from '@expo/vector-icons/FontAwesome6';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme/theme';
import { Item } from '@/types/budget.type';
import { formatCurrency } from '@/utils/formatters';

type ServicesSectionProps = Readonly<{
  items: Item[];
}>;

const Separator = () => <View style={styles.separator} />;

export function ServicesSection({ items }: ServicesSectionProps) {
  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.detail}</Text>
        <Text
          style={styles.itemDescription}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </View>
      <View style={styles.itemPricing}>
        <Text style={styles.itemPrice}>
          {formatCurrency(item.price * item.qty)}
        </Text>
        <Text style={styles.itemQty}>Qt: {item.qty}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon
          name='receipt'
          size={20}
          color={theme.colors.purple_base}
        />
        <Text style={styles.headerText}>Serviços inclusos</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.gray_600,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 12,
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 22,
    color: theme.colors.gray_700,
  },
  itemDescription: {
    fontSize: 12,
    lineHeight: 20,
    color: theme.colors.gray_500,
  },
  itemPricing: {
    alignItems: 'flex-end',
    gap: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: theme.colors.gray_700,
  },
  itemQty: {
    fontSize: 12,
    lineHeight: 20,
    color: theme.colors.gray_600,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.gray_200,
  },
});
