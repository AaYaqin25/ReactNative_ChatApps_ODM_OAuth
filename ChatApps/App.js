import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import FormLogin from "./src/components/FormLogin";
import FormChat from './src/containers/FormChat';
import { legacy_createStore as createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './src/reducers'
import thunk from 'redux-thunk'

const Stack = createStackNavigator()
const store = createStore(rootReducer, applyMiddleware(thunk))
export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="FormLogin">
                    <Stack.Screen name="FormLogin" component={FormLogin} options={{ headerShown: false }} />
                    <Stack.Screen name="FormChat" component={FormChat} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    )
}