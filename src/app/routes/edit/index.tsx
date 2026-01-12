import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Checkbox from 'expo-checkbox';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import uuid from 'react-native-uuid';

import { RootStackParamList } from '@/app/app';
import { Button, Input, Modal, Tag } from '@/components/common';
import {
  Header,
  IconDoc,
  IconInfo,
  IconStatus,
  ItemList,
  Quantity,
} from '@/components/edit';
import useBudget from '@/context/budget.context';
import {
  createBudget,
  getBudgets,
  sumPricesBugets,
} from '@/services/storage.service';
import { formatCurrency } from '@/utils/formatters';

import { BudgetStatus } from '@/enum/enum';
import { theme } from '@/theme/theme';
import { Item } from '@/types/budget.type';

type EditScreenRouteProp = RouteProp<RootStackParamList, 'Edit'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function EditScreen() {
  const route = useRoute<EditScreenRouteProp>();
  const navigation = useNavigation<NavigationProps>();
  const { fetchBudgets, data: budgets, updateBudget } = useBudget();

  const [discount, setDiscount] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BudgetStatus | null>(
    null
  );
  const [services, setServices] = useState<Item[] | null>(null);
  const [newService, setNewService] = useState<Item | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);

  const statuses = useMemo(
    () => [
      BudgetStatus.RASCUNHO,
      BudgetStatus.ENVIADO,
      BudgetStatus.APROVADO,
      BudgetStatus.RECUSADO,
    ],
    []
  );

  useEffect(() => {
    const budgetId = route.params?.budgetId;
    if (budgetId) {
      setIsEditMode(true);
      setEditingBudgetId(budgetId);

      const budget = budgets.find(b => b.id === budgetId);
      if (budget) {
        setTitle(budget.title);
        setClient(budget.client);
        setSelectedStatus(budget.status as BudgetStatus);
        setServices(budget.items);
        setDiscount(budget.discount || 0);
      } else {
        Alert.alert('Erro', 'Orçamento não encontrado');
        navigation.goBack();
      }
    }
  }, [route.params?.budgetId, budgets, navigation]);

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

  const deleteService = useCallback(() => {
    if (!newService) {
      setModalVisible(false);
      return;
    }

    if (newService.id && services) {
      setServices(prevServices =>
        prevServices
          ? prevServices.filter(service => service.id !== newService.id)
          : null
      );
    }

    setNewService(null);
    setModalVisible(false);
  }, [newService, services]);

  const saveService = useCallback(() => {
    if (
      !newService?.description ||
      !newService?.detail ||
      !newService?.qty ||
      newService.qty <= 0 ||
      !newService?.price ||
      newService.price <= 0
    ) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    const existService = services?.find(
      service => service.id === newService.id
    );

    if (existService) {
      setModalVisible(false);
      return;
    }

    newService.id = String(uuid.v4());
    setServices(prevServices => {
      if (prevServices) {
        return [...prevServices, newService];
      }
      return [newService];
    });
    setNewService(null);
    setModalVisible(false);
  }, [newService]);

  const handleAddService = () => {
    setNewService(null);
    setModalVisible(true);
  };

  const handleEditService = (id: string) => {
    const serviceToEdit = services?.find(service => service.id === id);
    if (serviceToEdit) {
      setNewService(serviceToEdit);
      setModalVisible(true);
    }
  };

  const FooterModal = () => (
    <>
      <Button
        style={styles.btnDeleteService}
        iconName='trash-can'
        label=''
        colorIcon={theme.colors.danger_base}
        onPress={() => deleteService()}
      />
      <Button
        iconName='check'
        label='Salvar'
        onPress={saveService}
      />
    </>
  );

  const subtotal = sumPricesBugets(services ?? []);
  const totalItems = (services ?? []).reduce(
    (acc, item) => acc + (item.qty || 0),
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={[]}
        keyExtractor={() => 'empty'}
        renderItem={() => null}
        ListHeaderComponent={() => (
          <>
            <View style={styles.containerFields}>
              <View style={styles.infoText}>
                <IconInfo />
                <Text style={styles.infoTextLabel}>Informações gerais</Text>
              </View>
              <View style={styles.inputContainer}>
                <Input
                  showIcon={false}
                  placeholder='Título'
                  value={title}
                  onChangeText={setTitle}
                />
                <Input
                  showIcon={false}
                  placeholder='Cliente'
                  value={client}
                  onChangeText={setClient}
                />
              </View>
            </View>
            <View style={styles.containerFields}>
              <View style={styles.infoText}>
                <IconStatus />
                <Text style={styles.infoTextLabel}>Status</Text>
              </View>
              <View style={styles.statusContainer}>
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
            </View>
            <View style={[styles.containerFields, styles.containerFieldsAuto]}>
              <View style={styles.infoText}>
                <IconDoc />
                <Text style={styles.infoTextLabel}>Serviços inclusos</Text>
              </View>
              <View style={styles.servicesContainer}>
                {(services ?? []).map((item, index) => (
                  <View key={String(item.id)}>
                    {index > 0 && <View style={styles.serviceSeparator} />}
                    <ItemList
                      data={item}
                      onEdit={handleEditService}
                    />
                  </View>
                ))}
              </View>
              <Button
                iconName='plus'
                label='Adicionar Serviço'
                styleLabel={{ color: theme.colors.purple_base }}
                colorIcon={theme.colors.purple_base}
                style={styles.btnAddService}
                onPress={handleAddService}
              />
            </View>
          </>
        )}
        ListFooterComponent={() => (
          <View style={styles.containerFields}>
            <View style={styles.infoText}>
              <IconInfo />
              <Text style={styles.infoTextLabel}>Investimento</Text>
            </View>
            <View style={styles.investmentRow}>
              <Text style={styles.investmentLabel}>Subtotal</Text>
              <Text style={styles.investmentValue}>
                {formatCurrency(subtotal)}
              </Text>
              <Text style={styles.investmentItems}>{totalItems} itens</Text>
            </View>
            <View style={styles.investmentRow}>
              <Text style={styles.investmentLabel}>Desconto</Text>
              <Input
                showIcon={false}
                placeholder='%'
                value={discount ? String(discount) : ''}
                onChangeText={v => setDiscount(Number(v) || 0)}
                keyboardType='numeric'
                style={styles.discountInput}
              />
              <Text
                style={[
                  styles.investmentValue,
                  { color: theme.colors.danger_base },
                ]}
              >
                - {formatCurrency(discountAmount)}
              </Text>
            </View>
            <View style={styles.investmentRow}>
              <Text style={styles.investmentLabel}>Valor total</Text>
              <View style={{ alignItems: 'flex-end' }}>
                {discountAmount > 0 && (
                  <Text
                    style={[
                      styles.investmentValue,
                      {
                        textDecorationLine: 'line-through',
                        color: theme.colors.gray_400,
                        fontSize: 13,
                      },
                    ]}
                  >
                    {formatCurrency(subtotal)}
                  </Text>
                )}
                <Text style={[styles.investmentValue, { fontWeight: 'bold' }]}>
                  {formatCurrency(total)}
                </Text>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      />
      <View style={styles.footerButtons}>
        <Button
          label='Cancelar'
          style={[
            styles.footerButton,
            {
              backgroundColor: theme.colors.white,
              borderColor: theme.colors.gray_300,
            },
          ]}
          styleLabel={{ color: theme.colors.purple_base }}
          onPress={() => navigation?.goBack?.()}
        />
        <Button
          iconName='check'
          label='Salvar'
          style={[
            styles.footerButton,
            { backgroundColor: theme.colors.purple_base },
          ]}
          styleLabel={{ color: theme.colors.white }}
          onPress={async () => {
            if (
              !title.trim() ||
              !client.trim() ||
              !selectedStatus ||
              !services ||
              services.length === 0
            ) {
              Alert.alert(
                'Erro',
                'Preencha todos os campos e adicione pelo menos um serviço.'
              );
              return;
            }

            if (isEditMode && editingBudgetId) {
              const updatedBudget = {
                id: editingBudgetId,
                title: title.trim(),
                client: client.trim(),
                status: selectedStatus,
                items: services,
                discount,
                createdAt:
                  budgets.find(b => b.id === editingBudgetId)?.createdAt ||
                  new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

              const success = await updateBudget(
                editingBudgetId,
                updatedBudget
              );
              if (success) {
                Alert.alert('Sucesso', 'Orçamento atualizado com sucesso!');
                navigation?.goBack?.();
              } else {
                Alert.alert('Erro', 'Não foi possível atualizar o orçamento.');
              }
            } else {
              const budgetsList = await getBudgets();
              const now = new Date().toISOString();
              const newBudget = {
                id: String(uuid.v4()),
                title: title.trim(),
                client: client.trim(),
                status: selectedStatus,
                items: services,
                discount,
                createdAt: now,
                updatedAt: now,
              };
              await createBudget([...(budgetsList || []), newBudget]);
              await fetchBudgets();
              Alert.alert('Sucesso', 'Orçamento salvo com sucesso!');
              navigation?.goBack?.();
            }
          }}
        />
      </View>

      <Modal
        titleHeader='Serviço'
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        styleModal={{ height: 500 }}
        footer={<FooterModal />}
      >
        <View style={styles.containerTextInputs}>
          <Input
            showIcon={false}
            placeholder='Título'
            value={newService?.detail || ''}
            onChangeText={value =>
              setNewService(prev => {
                if (!prev) {
                  return { detail: value } as Item;
                }
                return { ...prev, detail: value };
              })
            }
          />
          <Input
            placeholder='Descrição'
            showIcon={false}
            multiline
            numberOfLines={10}
            maxLength={90}
            value={newService?.description || ''}
            onChangeText={value =>
              setNewService(prev => {
                if (!prev) {
                  return { description: value } as Item;
                }
                return { ...prev, description: value };
              })
            }
          />
          <View style={styles.containerQuantity}>
            <Input
              showIcon={false}
              placeholder='Preço'
              value={newService?.price ? String(newService.price) : ''}
              onChangeText={value =>
                setNewService(prev => {
                  const price = Number.parseFloat(value) || 0;
                  if (!prev) {
                    return { price } as Item;
                  }
                  return { ...prev, price };
                })
              }
              keyboardType='numeric'
              style={{ flex: 1 }}
            />
            <Quantity
              quantity={newService?.qty || 0}
              setQuantity={
                setNewService
                  ? (qty: number) =>
                      setNewService(prev => {
                        if (!prev) {
                          return { qty } as Item;
                        }
                        return { ...prev, qty };
                      })
                  : () => {}
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  investmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  investmentLabel: {
    color: theme.colors.gray_600,
    fontSize: 14,
    flex: 1,
  },
  investmentValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.gray_700,
    minWidth: 100,
    textAlign: 'right',
  },
  investmentItems: {
    fontSize: 12,
    color: theme.colors.gray_500,
    marginLeft: 8,
  },
  discountInput: {
    minWidth: 60,
    maxWidth: 70,
    height: 40,
    marginHorizontal: 8,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray_300,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    textAlign: 'center',
    fontSize: 14,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray_200,
  },
  footerButton: {
    flex: 1,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  containerFields: {
    gap: 16,
    borderWidth: 1,
    borderColor: theme.colors.gray_200,
    padding: 16,
    borderRadius: 16,
    backgroundColor: theme.colors.white,
    marginBottom: 16,
  },
  containerFieldsAuto: {
    height: 'auto',
    minHeight: 150,
  },
  infoText: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  infoTextLabel: {
    fontSize: 14,
    color: theme.colors.purple_base,
    fontWeight: '600',
  },
  inputContainer: {
    gap: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  servicesContainer: {
    flexDirection: 'column',
    gap: 0,
    width: '100%',
  },
  serviceSeparator: {
    height: 1,
    backgroundColor: theme.colors.gray_200,
    marginVertical: 12,
  },
  filterList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '50%',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderColor: theme.colors.gray_400,
    borderWidth: 1,
    borderRadius: 4,
  },
  btnAddService: {
    marginTop: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.purple_base,
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    height: 48,
  },
  containerTextInputs: {
    gap: 12,
  },
  containerQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 75,
    gap: 8,
  },
  btnDeleteService: {
    borderRadius: '50%',
    minWidth: 48,
    height: 48,
    padding: 12,
    paddingLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray_300,
    backgroundColor: theme.colors.gray_100,
  },
});
