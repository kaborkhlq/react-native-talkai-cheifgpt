import React, {useState, useEffect} from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native'

import GlobalStyle from '../assets/values/global.style';
import useColors from '../assets/values/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

const EditText = (props) => {
    const [Colors, GetColors] = useColors();
    const [value, setValue] = useState('');

    const styles = new StyleSheet.create({
        container: {
            backgroundColor: Colors.bgDark,
            width: '90%',
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 20,
        },
        textinput: {
            color: Colors.input3,
            fontSize: 15,
            paddingRight: 30,
            width: '100%'
        },
        icon: {
            width: 20,
            height: 20,
            resizeMode: 'contain',
            marginRight: 10,
        }
    });

    useEffect(() => {
        GetColors();
        setValue(props.value);
    }, [props])

    const onChangeText = (e) => props.onChange && (props.onChange(e))
    const onSubmitEditing = (e) => { props.searchSubmit && (setValue(value => props.erase ? '' : value), props.searchSubmit(e)) }
    const inputMode = (e) => (props.inputMode && props.inputMode !== 'password') ? props.inputMode : 'text'
    
    return (
        <View style={[styles.container, GlobalStyle.row, GlobalStyle.column_center, props.style]}>
            <TouchableOpacity onPress={() => props?.onSearch()}>
                { props.icon && (<Image style={[styles.icon]} source={props.icon} />) }
            </TouchableOpacity>
            <TextInput editable={props.editable} value={props.value} onChangeText={onChangeText} onSubmitEditing={onSubmitEditing} multiline={props.multiline} placeholder={props.placeholder} placeholderTextColor={Colors.secondaryText} style={[GlobalStyle.Manjari, styles.textinput, props.textStyle]} secureTextEntry={props.inputMode === 'password'} inputMode={inputMode} />
        </View>
    )
}

EditText.defaultProps = {
    icon: null,
    placeholder: '',
    inputMode: 'text',
    multiline: false,
    style: {},
    searchSubmit: null,
    erase: true,
    editable: true,
}

export default EditText