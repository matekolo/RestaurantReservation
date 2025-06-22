import { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useNavigation, useIsFocused, NavigationProp } from '@react-navigation/native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';
import { RootStackParamList } from '../navigation/AppNavigator';

type Reservation = {
    id: number;
    customerName: string;
    reservationTime: string;
    table: {
        number: number;
        id: number;
    };
};

export default function ReservationListScreen() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState<number | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const isFocused = useIsFocused();

    const fetchReservations = async () => {
        try {
            const res = await API.get<Reservation[]>('/reservations');
            setReservations(res.data);
        } catch (err) {
            console.error('Błąd ładowania rezerwacji:', err);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchReservations();
        }
    }, [isFocused]);

    useEffect(() => {
        const loadRole = async () => {
            const role = await AsyncStorage.getItem('role');
            setUserRole(role);
        };
        loadRole();
    }, []);

    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', gap: 8, marginRight: 8 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ReservationForm')}
                        style={styles.headerButton}
                    >
                        <Text style={styles.headerButtonText}>+ Rezerwacja</Text>
                    </TouchableOpacity>
                    {role === 'Manager' && (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('AddTable')}
                            style={styles.headerButton}
                        >
                            <Text style={styles.headerButtonText}>+ Stolik</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ),
        });
    }, [navigation, role]);


    const handleDelete = async (id: number) => {
        try {
            await API.delete(`/reservations/${id}`);
            setReservations((prev) => prev.filter((r) => r.id !== id));
            setModalVisible(false);
        } catch (err) {
            console.error('Błąd usuwania:', err);
            Alert.alert('Nie udało się usunąć rezerwacji.');
        }
    };

    const confirmDelete = (id: number) => {
        setReservationToDelete(id);
        setModalVisible(true);
    };

    const renderItem = ({ item }: { item: Reservation }) => (
        <View style={styles.card}>
            <Text style={styles.name}>{item.customerName}</Text>
            <Text style={styles.detail}>🪑 Stolik: #{item.table?.number || '-'}</Text>
            <Text style={styles.detail}>
                📅 Termin: {new Date(item.reservationTime).toLocaleString()}
            </Text>
            {userRole === 'Manager' && (
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#007BFF' }]}
                        onPress={() =>
                            navigation.navigate('ReservationForm', { reservation: item })
                        }
                    >
                        <Text style={styles.buttonText}>Edytuj</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#DC3545' }]}
                        onPress={() => confirmDelete(item.id)}
                    >
                        <Text style={styles.buttonText}>Usuń</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📋 Lista rezerwacji</Text>
            <FlatList
                data={reservations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
                keyboardShouldPersistTaps="handled"
            />

            <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>🗑️ Usuń rezerwację</Text>
                    <Text style={styles.modalText}>Czy na pewno chcesz usunąć tę rezerwację?</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={[styles.button, { backgroundColor: '#6C757D' }]}
                        >
                            <Text style={styles.buttonText}>Anuluj</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => reservationToDelete && handleDelete(reservationToDelete)}
                            style={[styles.button, { backgroundColor: '#DC3545' }]}
                        >
                            <Text style={styles.buttonText}>Usuń</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F7F9FC',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#222',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    detail: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        gap: 10,
    },
    button: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    addButton: {
        marginRight: 10,
        backgroundColor: '#28A745',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#444',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    headerButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    headerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
});
