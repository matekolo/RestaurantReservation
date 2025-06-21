import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import API from '../services/api';

type Table = {
    id: number;
    number: number;
    seats: number;
    isAvailable: boolean;
};

export default function TablesScreen() {
    const [tables, setTables] = useState<Table[]>([]);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await API.get<Table[]>('/tables');
                setTables(response.data);
            } catch (error) {
                console.error('Błąd pobierania stolików:', error);
            }
        };

        fetchTables();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Lista stolików</Text>
            <FlatList
                data={tables}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>Stolik #{item.number}</Text>
                        <Text>Miejsc: {item.seats}</Text>
                        <Text>Status: {item.isAvailable ? 'Dostępny' : 'Zajęty'}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    item: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
});
