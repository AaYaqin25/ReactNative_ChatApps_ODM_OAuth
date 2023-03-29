import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'

export const request = axios.create({
    baseURL: 'http://192.168.1.99:3000/',
    timeout: 1000,
    headers: {
        Authorization: parseJson()
    }
});


async function parseJson() {
    const asyncData = await AsyncStorage.getItem('user')
    const data = JSON.parse(asyncData)

    if (data && data?.token) {
        return "Bearer " + data?.token
    } else {
        return null
    }
}

export async function dataJson() {
    const asyncData = await AsyncStorage.getItem('user')
    const data = JSON.parse(asyncData)

    return data
}

