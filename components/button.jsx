import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import Colors from '../assets/values/colors';
import GlobalStyle from '../assets/values/global.style';

const Button = (props) => {
    return (
        <TouchableOpacity style={[styles.buttonStyle, GlobalStyle.row, GlobalStyle.row_center, GlobalStyle.column_center, { marginTop: props.marginTop ? props.marginTop : 50, backgroundColor: '#23DB77', width: props.width }]} onPress={() => props.onPress()}>
            <Text style={[GlobalStyle.ManjariBold, styles.buttonText, { color: props.titleColor }]}>{props.title}</Text>
        </TouchableOpacity>
    );
}

const styles = new StyleSheet.create({
    buttonStyle: {
        borderRadius: 25,
        padding: 10,
    },
    buttonText: {
        fontSize: 16,
    }
})

export default Button;