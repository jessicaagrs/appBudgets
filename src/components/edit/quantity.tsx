import { theme } from '@/theme/theme';
import Icon from '@expo/vector-icons/FontAwesome6';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type QuantityProps = {
  quantity: number;
  setQuantity: (qty: number) => void;
};

export const Quantity = ({ quantity, setQuantity }: QuantityProps) => {
  const handlePressDecrease = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePressDecrease}>
        <Icon
          name='minus'
          size={16}
          color={theme.colors.purple_base}
        />
      </TouchableOpacity>
      <Text>{quantity}</Text>
      <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
        <Icon
          name='plus'
          size={16}
          color={theme.colors.purple_base}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.gray_100,
    borderRadius: 16,
    gap: 20,
    maxWidth: 120,
  },
});
