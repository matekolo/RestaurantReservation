import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AddTableScreen() {
    const [number, setNumber] = useState('');
    const [seats, setSeats] = useState('');
    const navigation = useNavigation();

    const handleAddTable = async () => {
        if (!number || !seats) {
            Alert.alert('Błąd', 'Uzupełnij wszystkie pola');
            return;
        }

        try {
            const response = await fetch('http://localhost:5242/api/tables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    number: parseInt(number),
                    seats: parseInt(seats),
                    isAvailable: true
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            Alert.alert('Sukces', 'Stolik został dodany');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Błąd', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>➕ Dodaj nowy stolik</Text>
            <TextInput
                style={styles.input}
                placeholder="Numer stolika"
                keyboardType="numeric"
                value={number}
                onChangeText={setNumber}
            />
            <TextInput
                style={styles.input}
                placeholder="Liczba miejsc"
                keyboardType="numeric"
                value={seats}
                onChangeText={setSeats}
            />
            <TouchableOpacity style={styles.button} onPress={handleAddTable}>
                <Text style={styles.buttonText}>Dodaj stolik</Text>
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
