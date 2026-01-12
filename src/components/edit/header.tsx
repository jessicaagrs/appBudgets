import { RootStackParamList } from '@/app/app';
import { theme } from '@/theme/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { Button } from '../common';

export const Header = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <Button
        iconName='angle-left'
        label='Orçamento'
        onPress={() => navigation.goBack()}
        style={styles.buttonBack}
        styleLabel={styles.labelButtonBack}
        colorIcon={theme.colors.gray_700}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray_200,
  },
  buttonBack: {
    backgroundColor: theme.colors.white,
  },
  labelButtonBack: {
    color: theme.colors.gray_700,
  },
});
