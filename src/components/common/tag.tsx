import { theme } from '@/theme/theme';
import { StyleSheet, Text, View } from 'react-native';

type TagProps = {
  status: string;
};

export const Tag = ({ status }: TagProps) => {
  return (
    <View style={[styles.tagContainer, styleStatus[status]?.tagContainer]}>
      <View style={[styles.tagCircle, styleStatus[status]?.tagCircle]} />
      <Text style={[styles.tagLabel, styleStatus[status]?.tagLabel]}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tagContainer: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagCircle: {
    width: 8,
    height: 8,
    borderRadius: 50,
  },
  tagLabel: {
    fontSize: 12,
    lineHeight: 20,
    fontWeight: 700,
  },
});

const styleStatus = {
  Aprovado: {
    tagContainer: {
      backgroundColor: theme.colors.sucess_light,
    },
    tagCircle: {
      backgroundColor: theme.colors.sucess_base,
    },
    tagLabel: {
      color: theme.colors.sucess_dark,
    },
  },
  Rascunho: {
    tagContainer: {
      backgroundColor: theme.colors.gray_300,
    },
    tagCircle: {
      backgroundColor: theme.colors.gray_400,
    },
    tagLabel: {
      color: theme.colors.gray_500,
    },
  },
  Enviado: {
    tagContainer: {
      backgroundColor: theme.colors.info_light,
    },
    tagCircle: {
      backgroundColor: theme.colors.info_base,
    },
    tagLabel: {
      color: theme.colors.info_dark,
    },
  },
  Recusado: {
    tagContainer: {
      backgroundColor: theme.colors.danger_light,
    },
    tagCircle: {
      backgroundColor: theme.colors.danger_base,
    },
    tagLabel: {
      color: theme.colors.danger_dark,
    },
  },
};
