import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const res = await fetch('http://localhost:5242/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, passwordHash: password }),
            });

            if (!res.ok) {
                const error = await res.text();
                throw new Error(error);
            }

            const data = await res.json();
            Alert.alert('Zalogowano', `Witaj, ${data.username}!`);
            navigation.navigate('ReservationList');
        } catch (error: any) {
            Alert.alert('B³¹d logowania', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Logowanie</Text>
            <TextInput style={styles.input} placeholder="Nazwa u¿ytkownika" value={username} onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder="Has³o" secureTextEntry value={password} onChangeText={setPassword} />
            <Button title="Zaloguj siê" onPress={handleLogin} />
            <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
                Nie masz konta? Zarejestruj siê
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 28, marginBottom: 16, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 10, borderRadius: 6 },
    link: { color: 'blue', marginTop: 16, textAlign: 'center' },
});
