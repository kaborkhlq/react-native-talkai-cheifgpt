import React from 'react';
import {View, Text, StyleSheet, Pressable, TouchableOpacity, ToastAndroid} from 'react-native';
import useColors from '../assets/values/colors';
import GlobalStyle from '../assets/values/global.style';
import { Feather } from '@expo/vector-icons'; 
import * as Clipboard from 'expo-clipboard';

const MessageContent = (props) => {
    const [Colors, GetColors] = useColors()
    const [flag, setFlag] = React.useState(false);
    const styles = new StyleSheet.create({
        container: {
            width: '100%',
            marginBottom: 20,
        },
        content: {
            width: '60%',
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
            borderRadius: 20,
        },
        message: {
            fontSize: 15,
            fontWeight: 400, 
        },  
        income: {
            backgroundColor: Colors.bgDark,
            borderBottomLeftRadius: 0,
        },
        msgIncome: {
            color: Colors.bgLight
        },
        outcome: {
            backgroundColor:'#23DB77',
            borderBottomRightRadius: 0,
        },
        msgOutcome: {
            color: Colors.darkGreen
        },
        time: {
            marginTop: 5,
            color: Colors.secondaryText,
            fontSize: 11,
            fontWeight: 500,
        }
    });

    React.useEffect(() => {
        GetColors()
    }, [])

    const showTooltip = () => setFlag(e => !e)

    const copyMessage = async () => {
        setFlag(false)
        await Clipboard.setStringAsync(props.content);
        ToastAndroid.show('Content successfully copied.', ToastAndroid.LONG);
    }
    const editMessage = () => {
        setFlag(false)
        props?.editMessage(props.content)
    }

    return (
        <Pressable onPress={showTooltip} style={[styles.container, { position: 'relative', alignItems: props.type === 'income' ? 'flex-start' : 'flex-end' }]}>
            <View style={[styles.content, props.type === 'income' ? styles.income : styles.outcome]}>
                <Text style={[GlobalStyle.Manjari, styles.message, props.type === 'income' ? styles.msgIncome : styles.msgOutcome]}>{props.content}</Text>   
            </View>
            <Text style={[GlobalStyle.Manjari, styles.time]}>{props.time}</Text>
            {
                flag && (
                    <View style={[props.type === 'income' ? {left: 24} : {right: 24}, GlobalStyle.row, GlobalStyle.column_center, {position: 'absolute', top: -18, backgroundColor:Colors.bgDark, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 30, borderStyle:'solid', borderWidth: 1, borderColor: '#23DB77' }]}>
                        <TouchableOpacity onPress={copyMessage} style={{marginRight: 10}}>
                            <Feather name="copy" size={18} color={Colors.bgLight} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={editMessage}>
                            <Feather name="edit" size={18} color={Colors.bgLight} />
                        </TouchableOpacity>
                    </View>
                )
            }
        </Pressable>
    );
}

MessageContent.defaultProps = {
    type: 'income',
    content: 'If you want to start your own business or need new ideas for your current business, ChatGPT 4 can help generate new concepts and strategies.',
    time: '08:20'
}

export default MessageContent;