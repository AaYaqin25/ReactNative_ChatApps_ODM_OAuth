import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request } from '../utils/api';
import socket from '../../socket';

export default function FormLogin({ navigation }) {
    const [userName, setUserName] = useState('');

    const handleSubmit = async () => {
        try {
            const { data } = await request.post('users/auth', { username: userName });
            if (data.success) {
                await AsyncStorage.setItem('user', JSON.stringify(data.data));
                request.interceptors.request.use(function (config) {
                    config.headers.Authorization = `Bearer ${data.data.token}`;
                    return config;
                });
                navigation.navigate('FormChat');
                socket.emit('send new user', { username: data.data.username, _id: data.data.id, unreadCount: 0 });
                socket.emit('join room', data.data.username);
                setUserName('');
            } else {
                alert('fail login');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FORM LOGIN</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={(name) => setUserName(name)}
                defaultValue={userName}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontWeight: 'bold',
        marginBottom: '5%',
    },
    input: {
        height: 40,
        width: '70%',
        fontWeight: 'bold',
        borderWidth: 1,
        padding: 10,
        borderRadius: 50,
        marginBottom: '3%',
        backgroundColor: '#e5e6e6',
    },
    button: {
        height: 40,
        width: '70%',
        fontWeight: 'bold',
        borderWidth: 1,
        padding: 10,
        borderRadius: 50,
        alignItems: 'center',
        backgroundColor: '#0558fd',
    },
    buttonText: {
        color: 'honeydew',
        fontWeight: 'bold',
    },
});