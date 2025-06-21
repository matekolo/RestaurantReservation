import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
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

            Alert.alert('Sukces', 'Konto zosta³o utworzone!');
            navigation.navigate('Login');
        } catch (error: any) {
            Alert.alert('B³¹d rejestracji', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rejestracja</Text>
            <TextInput style={styles.input} placeholder="Nazwa u¿ytkownika" value={username} onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder="Has³o" secureTextEntry value={password} onChangeText={setPassword} />
            <Button title="Zarejestruj siê" onPress={handleRegister} />
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                Masz ju¿ konto? Zaloguj siê
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
