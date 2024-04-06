import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import DreamForm from '@/components/DreamForm';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rédiger un rêve</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <DreamForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    padding: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginBottom: -20,
    height: 1,
    width: '80%',
  },
});
