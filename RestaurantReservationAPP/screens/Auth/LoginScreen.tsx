import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../services/api';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const response = await API.post('/auth/login', {
                username,
                passwordHash: password,
            });

            const { token, id, role } = response.data;

            // ✅ Zapis tokena i danych użytkownika
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('userId', id.toString());
            await AsyncStorage.setItem('role', role);

            Alert.alert('Zalogowano pomyślnie');
            navigation.navigate('ReservationList');
        } catch (error) {
            console.error('Błąd logowania:', error);
            Alert.alert('Błąd logowania', 'Sprawdź nazwę użytkownika i hasło');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🔐 Logowanie</Text>
            <TextInput
                style={styles.input}
                placeholder="Nazwa użytkownika"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Hasło"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Zaloguj</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#F8F9FA',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
