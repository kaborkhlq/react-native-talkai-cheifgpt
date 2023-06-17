import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import useColors from '../assets/values/colors';
import GlobalStyle from '../assets/values/global.style';

const MessageContent = (props) => {
    const [Colors, GetColors] = useColors()
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

    return (
        <View style={[styles.container, { alignItems: props.type === 'income' ? 'flex-start' : 'flex-end' }]}>
            <View style={[styles.content, props.type === 'income' ? styles.income : styles.outcome]}>
                <Text style={[GlobalStyle.Manjari, styles.message, props.type === 'income' ? styles.msgIncome : styles.msgOutcome]}>{props.content}</Text>   
            </View>
            <Text style={[GlobalStyle.Manjari, styles.time]}>{props.time}</Text>
        </View>
    );
}

MessageContent.defaultProps = {
    type: 'income',
    content: 'If you want to start your own business or need new ideas for your current business, ChatGPT 4 can help generate new concepts and strategies.',
    time: '08:20'
}

export default MessageContent;