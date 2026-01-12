import Icon from '@expo/vector-icons/FontAwesome6';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Button } from '@/components/common';
import { theme } from '@/theme/theme';

type ActionButtonsProps = Readonly<{
  onDelete: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onShare: () => void;
}>;

export function ActionButtons({
  onDelete,
  onDuplicate,
  onEdit,
  onShare,
}: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconButtons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onDelete}
        >
          <Icon
            name='trash-can'
            size={20}
            color={theme.colors.danger_base}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onDuplicate}
        >
          <Icon
            name='copy'
            size={20}
            color={theme.colors.purple_base}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onEdit}
        >
          <Icon
            name='pen-to-square'
            size={20}
            color={theme.colors.purple_base}
          />
        </TouchableOpacity>
      </View>
      <Button
        label='Compartilhar'
        iconName='paper-plane'
        onPress={onShare}
        style={styles.shareButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray_200,
  },
  iconButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.gray_100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray_200,
  },
  shareButton: {
    flex: 1,
    marginLeft: 12,
  },
});
