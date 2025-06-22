import { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import API from '../services/api';
import { Snackbar } from 'react-native-paper';



type Table = {
    id: number;
    number: number;
};

export default function ReservationFormScreen() {
    const [tables, setTables] = useState<Table[]>([]);
    const [tableId, setTableId] = useState<number>(-1);
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [datetimeString, setDatetimeString] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');



    const route = useRoute();
    const navigation = useNavigation();
    const existingReservation = (route.params as any)?.reservation;

    useEffect(() => {
        const fetchTables = async () => {
            const res = await API.get<Table[]>('/tables');
            setTables(res.data);
        };
        fetchTables();
    }, []);

    useEffect(() => {
        if (existingReservation) {
            setName(existingReservation.customerName);
            setTableId(existingReservation.table.id);
            const parsedDate = new Date(existingReservation.reservationTime);
            setDate(parsedDate);
        }
    }, [existingReservation]);

    useEffect(() => {
        const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        setDatetimeString(localISO);
    }, [date]);

    const handleSubmit = async () => {
    if (!name || !datetimeString || tableId === -1) {
        setSnackbarMessage('Uzupełnij wszystkie pola!');
        setSnackbarVisible(true);
        return;
    }

    const payload = {
        id: existingReservation?.id,
        customerName: name,
        reservationTime: datetimeString,
        tableId: tableId,
    };

    try {
        if (existingReservation) {
            await API.put(`/reservations/${existingReservation.id}`, payload);
            setSnackbarMessage('Rezerwacja została zaktualizowana!');
        } else {
            const response = await API.post('/reservations', payload);
            const message = response.data?.message || 'Rezerwacja zapisana!';
            setSnackbarMessage(message);
        }

        setSnackbarVisible(true);
        setName('');
        setDate(new Date());
        setTableId(-1);

        // opóźnij powrót po pokazaniu Snackbara
        setTimeout(() => navigation.goBack(), 1500);
    } catch (err) {
        console.error('Błąd:', err);
        setSnackbarMessage('Nie udało się zapisać rezerwacji.');
        setSnackbarVisible(true);
    }
};




    return (
        <View style={styles.container}>
            <Text style={styles.label}>Imię i nazwisko:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Jan Kowalski"
            />

            <Text style={styles.label}>Data i godzina:</Text>
            {Platform.OS === 'web' ? (
                <input
                    type="datetime-local"
                    value={datetimeString}
                    onChange={(e) => {
                        const localValue = e.target.value;
                        setDatetimeString(localValue);
                        const [datePart, timePart] = localValue.split('T');
                        const [year, month, day] = datePart.split('-').map(Number);
                        const [hour, minute] = timePart.split(':').map(Number);
                        const localDate = new Date(year, month - 1, day, hour, minute);
                        setDate(localDate);
                    }}
                    style={{ ...styles.input, padding: 8 }}
                />
            ) : (
                <>
                    <Button
                        title={date.toLocaleString()}
                        onPress={() => setShowPicker(true)}
                    />
                    {showPicker && (
                        <DateTimePicker
                            value={date}
                            mode="datetime"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowPicker(false);
                                if (selectedDate) {
                                    setDate(selectedDate);
                                }
                            }}
                        />
                    )}
                </>
            )}

            <Text style={styles.label}>Wybierz stolik:</Text>
            <Picker
                selectedValue={tableId}
                onValueChange={(itemValue) => setTableId(Number(itemValue))}
                style={styles.input}
            >
                <Picker.Item label="-- wybierz stolik --" value={-1} />
                {tables.map((table) => (
                    <Picker.Item
                        key={table.id}
                        label={`Stolik #${table.number}`}
                        value={table.id}
                    />
                ))}
            </Picker>

            <Button title="ZAREZERWUJ" onPress={handleSubmit} />
            <Snackbar
  visible={snackbarVisible}
  onDismiss={() => setSnackbarVisible(false)}
  duration={2000}
  action={{
    label: 'OK',
    onPress: () => setSnackbarVisible(false),
  }}
>
  {snackbarMessage}
</Snackbar>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, gap: 12 },
    label: { fontWeight: 'bold' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: Platform.OS === 'web' ? 8 : 10,
        width: '100%',
    },
});