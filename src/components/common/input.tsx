import Icon from '@expo/vector-icons/FontAwesome6';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { theme } from '@/theme/theme';

type InputProps = TextInputProps & {
  showIcon?: boolean;
  colorIcon?: string;
};

export const Input = ({
  showIcon = true,
  placeholder = 'Título ou cliente',
  onChangeText,
  value,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  colorIcon,
  style,
  ...props
}: InputProps) => {
  const baseStyle = showIcon
    ? styles.input
    : [styles.input, styles.noIconPadding];

  return (
    <View style={styles.container}>
      {showIcon && (
        <Icon
          name='magnifying-glass'
          size={20}
          color={colorIcon || theme.colors.gray_600}
          style={styles.icon}
        />
      )}

      <TextInput
        style={[baseStyle, multiline && styles.textArea, style]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.gray_500}
        onChangeText={onChangeText}
        value={value}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    minHeight: 48,
    flex: 1,
  },
  icon: {
    position: 'absolute',
    top: 14,
    left: 16,
    zIndex: 1,
    pointerEvents: 'none',
  },
  input: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: theme.colors.gray_300,
    paddingTop: 12,
    paddingRight: 16,
    paddingBottom: 12,
    paddingLeft: 48,
    fontSize: 16,
  },
  noIconPadding: {
    paddingLeft: 16,
  },
  textArea: {
    minHeight: 120,
    borderRadius: 16,
  },
});
