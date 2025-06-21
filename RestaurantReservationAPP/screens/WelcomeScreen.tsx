import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>RestaurantReservation</Text>
                <Text style={styles.subtitle}>
                    Witaj w systemie rezerwacji stolików w naszej restauracji! Zarezerwuj swój stolik szybko i wygodnie.
                </Text>

                <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.buttonText}>Przejdź dalej</Text>
                </Pressable>

                <Pressable onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.linkText}>Zamiast tego przejdź do rejestracji</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8f0fe',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        width: '80%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#2973B2',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
        color: '#333',
    },
    button: {
        backgroundColor: '#2973B2',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    linkText: {
        marginTop: 16,
        color: '#2973B2', // np. niebieski
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontSize: 14,
    }
});
