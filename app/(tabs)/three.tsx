// app/(tabs)/three.tsx
import {StyleSheet} from 'react-native';
import {View} from '@/components/Themed';
import DreamDoc from '@/components/DreamDoc';

export default function TabThreeScreen() {
    return (
        <View style={styles.container}>
            <DreamDoc/>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
