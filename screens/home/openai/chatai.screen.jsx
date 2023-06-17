import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useRewardedAd } from 'react-native-google-mobile-ads';

import { updateCredit } from '../../../redux/actions/auth.action.jsx';
import MessageContent from '../../../components/message.content.jsx';
import EditText from '../../../components/edittext';
import useColors from '../../../assets/values/colors';
import GlobalStyle from '../../../assets/values/global.style';
import Loading from '../../../components/loading.jsx';

import Config from '../../../redux/config';
import useCustomerInfo from '../../../redux/useCustomerInfo';
import { OpenAIChat } from '../../../redux/actions/openai.action';
const {width, height} = Dimensions.get('window');

const adUnit = Config.Rewarded.AdUnitID;
const requestOptions = {};

const ChatAI = (props) => {
    const [Colors, GetColors] = useColors()
    const [limit, setLimit] = useState(0);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const msgContent = useRef();
    const dispatch = useDispatch();
    const OpenAIReducer = useSelector(state => state.OpenAIReducer);
    const AuthReducer = useSelector(state => state.AuthReducer)
    const [customerInfo, getCustomerInfo] = useCustomerInfo();
    const { isLoaded, isClosed, load, show, isEarnedReward, reward } = useRewardedAd(adUnit, requestOptions)
    const styles = new StyleSheet.create({
        container: {
            padding: 20,
        },
        icon: {
            width: 20,
            height: 20,
            resizeMode: 'contain'
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

    useEffect(() =>{
        GetColors()
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
        setLoading(true);
        dispatch(OpenAIChat(`${OpenAIReducer.messages}\nYou: Act as my friend called Dave. My name is ${AuthReducer.data.username}.`));
    }, [AuthReducer])

    useEffect(() => {
        if(loading) {
            if(OpenAIReducer.IS_REQUEST) {
                setLoading(true);
            } else if(OpenAIReducer.IS_SUCCESS) {
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
        if(isEarnedReward) {
            dispatch(updateCredit(Auth.data.uid, Auth.data.credit + 1))
        }
    }, [isEarnedReward])

    useEffect(() => {
        if(isLoaded) show();
    }, [isLoaded])

    useEffect(() => {
        if(customerInfo !== null) {
            if(customerInfo.activeSubscriptions.length === 0) {
                if(AuthReducer.data.credit === 0) {
                    let value = Math.random()
                    if(value > 0.5) {
                        props.navigation.replace('License');
                    } else {
                        setLoading(true);
                        load();
                    }
                } else {
                    dispatch(updateCredit(AuthReducer.data.uid, AuthReducer.data.credit - 1))
                    setLimit(0)
                }
            }
        }
    }, [customerInfo])

    return (
        <View style={[{backgroundColor: Colors.background}, GlobalStyle.container, styles.container, GlobalStyle.column_center]}>
            <View style={[GlobalStyle.row, { justifyContent: 'space-between', alignItems: 'center', width: '90%' }]}>
                <TouchableOpacity onPress={() => props.navigation.replace('Home')}>
                    <Image tintColor={Colors.bgLight} source={require('../../../assets/drawables/ic_back.png')} style={[styles.icon]} />
                </TouchableOpacity>
                <Text style={[GlobalStyle.ManjariBold, styles.title]}>Talk AI Chat</Text>
                <View></View>
                {/* <TouchableOpacity onPress={() => setMessages([])}>
                    <Image source={require('../../../assets/drawables/ic_add.png')} style={[styles.icon]} />
                </TouchableOpacity> */}
            </View>
            <ScrollView style={styles.msgContent} ref={msgContent}>
                { messages.map((item, index, array) => (
                    item.type !== 'order' && <MessageContent key={index} content={item.content.replace(/Dave: /g, '')} type={item.type} time={item.time} />
                )) }
            </ScrollView>
            <EditText onChange={(e) => onChange(e)} searchSubmit={(e) => searchSubmit(e)} placeholder="Write a message..." style={{width: '100%', position: 'absolute', bottom: 30}} />
            <Loading loading={loading} />
        </View>
    )
}

export default ChatAI