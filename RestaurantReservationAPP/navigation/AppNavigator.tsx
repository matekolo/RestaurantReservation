import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReservationFormScreen from '../screens/ReservationFormScreen';
import ReservationListScreen from '../screens/ReservationListScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen
                    name="Welcome"
                    component={WelcomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="Lista rezerwacji" component={ReservationListScreen} />
                <Stack.Screen name="Nowa rezerwacja" component={ReservationFormScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
