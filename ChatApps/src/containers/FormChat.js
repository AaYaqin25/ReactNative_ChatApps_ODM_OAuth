import React, { Fragment, useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import ChatBody from './ChatBody'
import ContactList from './ContactList'
import { useDispatch } from 'react-redux'
import { addMessage, receiverReadNotice, removeMessage, selectedReadNotice } from '../actions/chats';
import socket from '../../socket'
import { dataJson } from '../utils/api'

export default function FormChat({ navigation }) {
    const dispatch = useDispatch()
    const parseJsonData = dataJson()
    const [chat, setChat] = useState(false)
    const [message, setMessage] = useState('')
    const [name, setName] = useState('')
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        socket.on('connect', () => {
            parseJsonData.then((data) => {
                socket.emit('join room', data.username)
            }).catch((err) => console.log(err))
            setIsConnected(true);
        });

        socket.on('receive message', (data) => {
            dispatch(addMessage({ _id: data._id, message: data.message, date: data.date, sender: data.sender, receiver: data.receiver, readstatus: data.readstatus }, name))
        })

        socket.on('receive selected read notice', (id) => {
            dispatch(selectedReadNotice(id))
        })

        socket.on('receive receiver read notice', (id) => {
            dispatch(receiverReadNotice(id))
        })

        socket.on('receive new user', (data) => {
            dispatch(loadContact({ username: data.username, _id: data._id, unreadCount: data.unreadCount }))
        })

        socket.on('delete message', (id) => {
            dispatch(removeMessage(id))
        })

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        console.log(isConnected);

        return () => {
            socket.off('connect');
            socket.off('receive message');
            socket.off('delete message');
            socket.off('receive notification')
            socket.off('disconnect');
        };
    }, [dispatch, name, isConnected]);

    const handleFormChat = (target) => {
        setChat(true)
        setName(target)
    }

    return (
        <View style={styles.container}>
            {chat ?
                <ChatBody name={name} back={() => setChat(false)} message={message} setMessage={setMessage} />
                :
                <Fragment>
                    <Text style={styles.headerText}>Contact</Text>
                    <ContactList formChat={handleFormChat} navigation={navigation} />
                </Fragment>
            }
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    headerText: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
        padding: 20,
        backgroundColor: '#317873',
        fontWeight: 'bold',
        marginBottom: 7,
        color: 'honeydew',
        fontSize: 15
    }
});


