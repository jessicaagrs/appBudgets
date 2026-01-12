import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme/theme';

import { RootStackParamList } from '@/app/app';
import { Button } from '@/components/common';
import useBudget from '@/context/budget.context';
import { BudgetStatus } from '@/enum/enum';

export const Header = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data } = useBudget();

  const draftCount = data.filter(
    budget => budget.status === BudgetStatus.RASCUNHO
  ).length;

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Orçamentos</Text>
        <Text style={styles.subtitle}>
          Você tem {draftCount} {draftCount === 1 ? 'item' : 'itens'} em
          rascunho
        </Text>
      </View>
      <Button onPress={() => navigation.navigate('Edit')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray_200,
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
    color: theme.colors.purple_base,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.gray_500,
  },
});
