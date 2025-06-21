import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>🍽️ RestaurantReservation</Text>
                <Text style={styles.subtitle}>
                    Witaj w systemie rezerwacji stolików w naszej restauracji! Zarezerwuj swój stolik szybko i wygodnie.
                </Text>
                <Pressable style={styles.button} onPress={() => navigation.navigate('Lista rezerwacji')}>
                    <Text style={styles.buttonText}>Przejdź dalej</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F0FA', // delikatny niebieski
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 28,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        gap: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2973B2', // ciemny niebieski z Twojej palety
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#2973B2', // niebieski przycisk
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
