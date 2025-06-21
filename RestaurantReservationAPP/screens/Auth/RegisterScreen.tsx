import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const res = await fetch('http://localhost:5242/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, passwordHash: password }),
            });

            if (!res.ok) {
                const error = await res.text();
                throw new Error(error);
            }

            Alert.alert('Sukces', 'Konto zostało utworzone!');
            navigation.navigate('Login');
        } catch (error: any) {
            Alert.alert('Błąd rejestracji', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📝 Rejestracja</Text>
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
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Zarejestruj się</Text>
            </TouchableOpacity>
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                Masz już konto? <Text style={styles.linkInner}>Zaloguj się</Text>
            </Text>
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
    link: {
        marginTop: 16,
        textAlign: 'center',
        fontSize: 14,
        color: '#000',
    },
    linkInner: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
});
