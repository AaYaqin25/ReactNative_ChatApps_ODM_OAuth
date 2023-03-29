import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback } from "react-native";
import { dataJson } from "../utils/api";
import Markdown from 'react-native-markdown-display';
import Icon from "react-native-vector-icons/Ionicons";
import Modal from 'react-native-modal'

export default function MessageContent(props) {
    const [data, setData] = useState(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        async function parseData() {
            const parseJsonData = await dataJson()
            setData(parseJsonData)
        }
        parseData()
    }, [])

    const deleteMessage = () => {
        props.delete()
        setShowModal(false)
    }

    if (props.sent === true && props.id === data?.id) {
        return (
            <TouchableNativeFeedback onLongPress={() => setShowModal(true)}>
                <View style={styles.containerSender}>
                    <View style={styles.bubbleSender}>
                        <Markdown style={styles.textSender}>{props.chat}</Markdown>
                        <View style={styles.timestampContainer}>
                            <Text style={styles.timestamp}>{props.date}</Text>
                            {props.readstatus === true ?
                                <Icon name="checkmark-done" size={20} color="#128C7E" />
                                :
                                <Icon name="checkmark" size={20} color="#B2B2B2" />
                            }
                        </View>
                    </View>

                    <Modal isVisible={showModal}>
                        <View style={{ backgroundColor: 'white', paddingHorizontal: 25, paddingVertical: 30, borderRadius: 20 }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', color: 'black', marginBottom: 15 }}>Are you sure want to delete this message ?</Text>
                                <Text style={{ fontWeight: 'bold', color: 'black', marginBottom: 15, textAlign: "center" }}>{props.chat}</Text>
                            </View>
                            <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <TouchableOpacity style={{ borderWidth: 1, borderColor: 'black', backgroundColor: '#00A693', width: '90%', padding: 5, borderRadius: 30, marginBottom: 7 }} onPress={deleteMessage}><Text style={{ fontWeight: 'bold', textAlign: 'center', color: '#fefefe' }}>Delete</Text></TouchableOpacity>
                                <TouchableOpacity style={{ borderWidth: 1, borderColor: 'black', backgroundColor: '#bbbcbe', width: '90%', padding: 5, borderRadius: 30 }} onPress={() => setShowModal(false)}><Text style={{ fontWeight: 'bold', textAlign: 'center', color: '#fefefe' }}>Cancel</Text></TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </TouchableNativeFeedback>
        )
    } else if (props.sent === false && data?.sender === data?.id) {
        return (
            <View style={styles.containerSender}>
                <View style={styles.bubbleSender}>
                    <TouchableOpacity style={styles.resend} onPress={props.resend}><Icon name="sync" size={30} color="black" /></TouchableOpacity>
                    <Markdown style={styles.textSender}>{props.chat}</Markdown>
                    <View style={styles.timestampContainer}>
                        <View style={styles.timestamp}>
                            <Text style={styles.timestampText}>{props.date}</Text>
                            <Icon name="time-outline" style={styles.timeIcon} />
                        </View>
                    </View>
                </View>
            </View>

        )
    } else {
        return (
            data?.sender === props.receiver ?
                <View style={styles.containerReceiver}>
                    <View style={styles.bubbleReceiver}>
                        <Markdown style={styles.textReceiver}>{props.chat}</Markdown>
                        <View style={styles.timestampContainer}>
                            <Text style={styles.timestamp}>{props.date}</Text>
                        </View>
                    </View>
                </View>
                :
                null
        )
    }
}

const styles = StyleSheet.create({
    containerSender: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
        marginRight: 10
    },
    containerReceiver: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
        marginLeft: 10
    },
    bubbleSender: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C5',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    bubbleReceiver: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    textSender: {
        color: '#000',
        fontSize: 16,
        textAlign: 'right',
    },
    textReceiver: {
        color: '#000',
        fontSize: 16,
        textAlign: 'left',
        fontWeight: 'bold'
    },
    timestampContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 5
    },
    timestamp: {
        fontSize: 12,
        color: '#B2B2B2',
        marginRight: 5,
        alignItems: 'center',
        flexDirection: 'row',
    },
    timeIcon: {
        marginLeft: 5,
        fontSize: 20,
        color: '#B2B2B2',
    },
    timestampText: {
        fontSize: 12,
        color: '#B2B2B2',
    },
    resend: {
        position: 'absolute',
        left: -50,
        top: '40%',
    },
});


