import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Filters, Header, ListBudgets, Welcome } from '@/components/home';

import { theme } from '@/theme/theme';

function HomeScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Welcome />;
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Filters />
        <ListBudgets />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 24,
  },
});

export default HomeScreen;
