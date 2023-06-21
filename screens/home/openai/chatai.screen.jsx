import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { FontAwesome5, FontAwesome, Entypo } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

import useLicenseModal from '../../../components/license.modal.jsx';
import { updateCredit } from '../../../redux/actions/auth.action.jsx';
import MessageContent from '../../../components/message.content.jsx';
import EditText from '../../../components/edittext';
import useColors from '../../../assets/values/colors';
import GlobalStyle from '../../../assets/values/global.style';
import Loading from '../../../components/loading.jsx';
import useTrackEvent from '../../../redux/useTrackEvent.jsx';

import useCustomerInfo from '../../../redux/useCustomerInfo';
import { NewChat, OpenAIChat } from '../../../redux/actions/openai.action';


const ChatAI = (props) => {
    const [response, setTract] = useTrackEvent();
    const [setPopup, LicenseModal] = useLicenseModal(props.navigation);
    const [Colors, GetColors] = useColors()
    const [limit, setLimit] = useState(0);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [savedMessages, setSavedMessages] = useState([]);
    const msgContent = useRef();
    const dispatch = useDispatch();
    const OpenAIReducer = useSelector(state => state.OpenAIReducer);
    const AuthReducer = useSelector(state => state.AuthReducer)
    const [customerInfo, getCustomerInfo] = useCustomerInfo();
    const styles = new StyleSheet.create({
        container: {
            padding: 20,
        },
        icon: {
            width: 20,
            height: 20,
            resizeMode: 'contain',
            backgroundColor: Colors.background
        },
        title: {
            color: Colors.bgLight,
            fontSize: 20,
        },
        msgContent: {
            width: '100%',
            marginBottom: 60,
            marginTop: 20,
        },
    });

    const onNewChat = () => {
        dispatch(NewChat)
        setSavedMessages([])
        setMessages([])
        SecureStore.setItemAsync('saved_chats', JSON.stringify([]))
        setLoading(true);
        dispatch(OpenAIChat(`\nYou: Act as my friend called Dave. My name is ${AuthReducer.data.username}.`));
    }

    useEffect(() =>{
        GetColors()
        SecureStore.getItemAsync('saved_chats').then(result => {
            if(result !== null && result !== undefined)
                setSavedMessages(JSON.parse(result))
        })

        return () => {
            setMessage([])
        }
    }, [])

    const searchSubmit = (e) => {
        if(limit <= 10) {
            setLoading(true);
            setMessages([
                ...messages,
                { 
                    content: message,
                    type: 'outcome',
                    time: moment().format('hh:mm')
                }
            ]);
            if(customerInfo === null || customerInfo.activeSubscriptions.length === 0) setLimit(e => e + 1)
            msgContent.current.scrollToEnd({animated: true});
            dispatch(OpenAIChat(OpenAIReducer.messages + '\nYou: ' + message));
        }
    }

    const onChange = (e) => {
        setMessage(e);
    }

    useEffect(() => {
        let array = savedMessages.concat(messages)
        let length = array.length;
        let temp = [];
        if(length > 0) {
            for(let i = length - 1 ; i >= (length >= 10 ? length - 10 : 0 ) ; i--) {
                temp.push(array[i]);
            }
        }
        SecureStore.setItemAsync('saved_chats', JSON.stringify(temp));
    }, [messages])

    useEffect(() => {
        setLoading(true);
        dispatch(OpenAIChat(`${OpenAIReducer.messages}\nYou: Act as my friend called Dave. My name is ${AuthReducer.data.username}.`));
    }, [AuthReducer])

    useEffect(() => {
        if(loading) {
            if(OpenAIReducer.IS_REQUEST) {
                setLoading(true);
            } else if(OpenAIReducer.IS_SUCCESS) {
                setTrack('chat_started', AuthReducer.data)
                setMessages([
                    ...messages,
                    { 
                        content: OpenAIReducer.openAIChatMsg,
                        type: 'income',
                        time: moment().format('hh:mm')
                    }
                ]);
                msgContent.current.scrollToEnd({animated: true});
                setLoading(false);
            } else if(OpenAIReducer.IS_FAILURE) {
                setLoading(false);
            }
        }
    }, [OpenAIReducer])

    useEffect(() => {
        if(limit >= 10) {
            getCustomerInfo();
        }
    }, [limit])

    useEffect(() => {
        if(customerInfo !== null) {
            if(customerInfo.activeSubscriptions.length === 0) {
                if(AuthReducer.data.credit === 0) {
                    setPopup(true);
                } else {
                    dispatch(updateCredit(AuthReducer.data.uid, AuthReducer.data.credit - 1))
                    setLimit(0)
                }
            }
        }
    }, [customerInfo])

    const onEditMessage = (e) => {
        setMessage(e);
    }

    return (
        <View style={[{backgroundColor: Colors.background}, GlobalStyle.container, styles.container, GlobalStyle.column_center]}>
            <View style={[GlobalStyle.row, { justifyContent: 'space-between', alignItems: 'center', width: '90%' }]}>
                <TouchableOpacity onPress={() => props.navigation.replace('Home')}>
                    <Image tintColor={Colors.bgLight} source={require('../../../assets/drawables/ic_back.png')} style={[styles.icon]} />
                </TouchableOpacity>
                <Text style={[GlobalStyle.ManjariBold, styles.title]}>Talk AI Chat</Text>
                <View style={[GlobalStyle.row, GlobalStyle.column_center, GlobalStyle.row_center]}>
                    <FontAwesome5 style={{marginRight: 10}} name="coins" size={24} color={Colors.bgLight} />
                    <Text style={[GlobalStyle.ManjariBold, styles.title]}>{AuthReducer.data.credit}</Text>
                </View>
            </View>
            <ScrollView style={styles.msgContent} ref={msgContent}>
                { savedMessages.map((item, index, array) => (
                    item.type !== 'order' && <MessageContent editMessage={onEditMessage} key={index} content={item.content.replace(/Dave: /g, '')} type={item.type} time={item.time} />
                )) }
                { messages.map((item, index, array) => (
                    item.type !== 'order' && <MessageContent editMessage={onEditMessage} key={index} content={item.content.replace(/Dave: /g, '')} type={item.type} time={item.time} />
                )) }
            </ScrollView>
            <View style={[GlobalStyle.row, GlobalStyle.column_center, GlobalStyle.row_space_around, {width: '100%', position: 'absolute', bottom: 30}]}>
                <TouchableOpacity onPress={() => onNewChat()} style={[GlobalStyle.row, GlobalStyle.column_center, GlobalStyle.row_center, {backgroundColor: Colors.bgDark, padding: 10, borderRadius: 50, width: 40, height: 40}]}>
                    <Entypo name="new-message" size={20} color={Colors.bgLight} />
                </TouchableOpacity>
                <EditText value={message} onChange={(e) => onChange(e)} searchSubmit={(e) => searchSubmit(e)} placeholder="Write a message..." style={{width: '70%'}} />
                <TouchableOpacity onPress={(e) => searchSubmit(e)} style={[GlobalStyle.row, GlobalStyle.column_center, GlobalStyle.row_center, {backgroundColor: Colors.bgDark, padding: 10, borderRadius: 50, width: 40, height: 40}]}>
                    <FontAwesome name="send" size={20} color={Colors.bgLight} />
                </TouchableOpacity>
            </View>
            {LicenseModal}
            <Loading loading={loading} />
        </View>
    )
}

export default ChatAI