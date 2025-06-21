import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReservationFormScreen from '../screens/ReservationFormScreen';
import ReservationListScreen from '../screens/ReservationListScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    ReservationList: undefined;
    ReservationForm: { reservation?: any } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Logowanie' }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Rejestracja' }} />
                <Stack.Screen name="ReservationList" component={ReservationListScreen} options={{ title: 'Lista rezerwacji' }} />
                <Stack.Screen name="ReservationForm" component={ReservationFormScreen} options={{ title: 'Nowa rezerwacja' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
