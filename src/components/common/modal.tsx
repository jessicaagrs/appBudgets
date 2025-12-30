import Icon from '@expo/vector-icons/FontAwesome6';
import {
  Modal as ModalRN,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { theme } from '@/theme/theme';

type ModalFilterAndSortProps = Readonly<{
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  titleHeader?: string;
  children: React.ReactNode;
  styleModal?: StyleProp<ViewStyle>;
}>;

export function Modal({
  modalVisible,
  setModalVisible,
  titleHeader = 'Filtrar e ordenar',
  children,
  styleModal,
}: ModalFilterAndSortProps) {
  return (
    <ModalRN
      animationType='slide'
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, styleModal]}>
          <View style={styles.modalHeader}>
            <Text style={styles.titleHeader}>{titleHeader}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon
                name='x'
                size={15}
                color={theme.colors.gray_600}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>{children}</View>
        </View>
      </View>
    </ModalRN>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 22,
    backgroundColor: theme.colors.overlay,
  },
  modalView: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray_200,
    padding: 20,
  },
  titleHeader: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: 700,
  },
  modalBody: {
    padding: 20,
    gap: 20,
  },
});
