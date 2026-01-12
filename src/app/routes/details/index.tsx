import Icon from '@expo/vector-icons/FontAwesome6';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { RootStackParamList } from '@/app/app';
import { Tag } from '@/components/common';
import {
  ActionButtons,
  BudgetCard,
  FinancialSummary,
  ServicesSection,
} from '@/components/details';
import useBudget from '@/context/budget.context';
import { sumPricesBugets } from '@/services/storage.service';
import { theme } from '@/theme/theme';
import { Budget } from '@/types/budget.type';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function DetailsScreen() {
  const route = useRoute<DetailsScreenRouteProp>();
  const navigation = useNavigation<NavigationProps>();
  const {
    data: budgets,
    deleteBudget: deleteBudgetFn,
    duplicateBudget: duplicateBudgetFn,
  } = useBudget();
  const [budget, setBudget] = useState<Budget | null>(null);

  const { budgetId } = route.params;

  useEffect(() => {
    const foundBudget = budgets.find(b => b.id === budgetId);
    if (foundBudget) {
      setBudget(foundBudget);
    } else {
      Alert.alert('Erro', 'Orçamento não encontrado');
      navigation.goBack();
    }
  }, [budgetId, budgets, navigation]);

  const handleDelete = () => {
    Alert.alert(
      'Excluir orçamento',
      'Tem certeza que deseja excluir este orçamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteBudgetFn(budgetId)
              .then(success => {
                if (success) {
                  Alert.alert('Sucesso', 'Orçamento excluído com sucesso');
                  navigation.navigate('Home');
                } else {
                  Alert.alert('Erro', 'Não foi possível excluir o orçamento');
                }
              })
              .catch(() => {
                Alert.alert('Erro', 'Não foi possível excluir o orçamento');
              });
          },
        },
      ]
    );
  };

  const handleDuplicate = async () => {
    const duplicated = await duplicateBudgetFn(budgetId);
    if (duplicated) {
      Alert.alert('Sucesso', 'Orçamento duplicado com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } else {
      Alert.alert('Erro', 'Não foi possível duplicar o orçamento');
    }
  };

  const handleEdit = () => {
    navigation.navigate('Edit', { budgetId });
  };

  const handleShare = async () => {
    if (!budget) return;

    const subtotal = sumPricesBugets(budget.items);
    const discount = budget.discount || 0;
    const total = subtotal - discount;

    const message = `
📄 *Orçamento #${budget.id.substring(0, 6)}*

🏢 Cliente: ${budget.client}
📋 Título: ${budget.title}
📊 Status: ${budget.status}

💰 Subtotal: R$ ${subtotal.toFixed(2)}
🎟️ Desconto: R$ ${discount.toFixed(2)}
💵 Total: R$ ${total.toFixed(2)}

📦 Serviços (${budget.items.length}):
${budget.items
  .map(
    (item, index) =>
      `${index + 1}. ${item.detail} - R$ ${item.price.toFixed(2)} (Qtd: ${
        item.qty
      })`
  )
  .join('\n')}
    `.trim();

    try {
      await Share.share({
        message,
        title: `Orçamento #${budget.id.substring(0, 6)}`,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar o orçamento');
    }
  };

  if (!budget) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  const subtotal = sumPricesBugets(budget.items);
  const discount = budget.discount || 0;
  const total = subtotal - discount;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon
            name='chevron-left'
            size={20}
            color={theme.colors.gray_700}
          />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            Orçamento #{budget.id.substring(0, 6)}
          </Text>
        </View>
        <Tag status={budget.status} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BudgetCard budget={budget} />
        <ServicesSection items={budget.items} />
        <FinancialSummary
          subtotal={subtotal}
          discount={discount}
          total={total}
        />
      </ScrollView>

      <ActionButtons
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onEdit={handleEdit}
        onShare={handleShare}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.gray_600,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray_200,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.gray_700,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
});
