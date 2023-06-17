import {View, StyleSheet,ScrollView, TouchableOpacity, Text} from 'react-native'
import {useEffect, useState} from 'react';

import useColors from '../assets/values/colors';
import GlobalStyle from '../assets/values/global.style';

const Navbar = (props) => {
    const [value, setValue] = useState('');
    const [Colors, GetColors] = useColors()

    const styles = new StyleSheet.create({
        container: {
            width: '90%',
            marginTop: 15,
        },
        buttonStyle: {
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#23DB77',
            padding: 5,
            paddingLeft: 15,
            paddingRight: 15,
            borderRadius: 20,
            marginRight: 10,
        },
        textStyle: {
            fontSize: 15,
            fontWeight: 400,
            color: '#23DB77'
        },
        buttonActiveStyle: {
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#23DB77',
            backgroundColor: '#23DB77',
            padding: 5,
            paddingLeft: 15,
            paddingRight: 15,
            borderRadius: 20,
            marginRight: 10,
        },
        textActiveStyle: {
            fontSize: 15,
            fontWeight: 400,
            color: Colors.bgDark
        }
    });

    useEffect(() => {
        GetColors()
        props.data[0] !== undefined && props.query === '' && handleChange(props.data[0]);
        if(props.query !== '') setValue(props.query);
    }, [props.data]);

    const handleChange = (e) => {
        setValue(e);
        props.onChange(e);
    }

    return (
        <View style={styles.container}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {
                    props.data.map((item, index, array) =>
                        <TouchableOpacity key={index} style={[item === value ? styles.buttonActiveStyle : styles.buttonStyle]} onPress={() => handleChange(item)}>
                            <Text style={[GlobalStyle.Manjari, item === value ? styles.textActiveStyle : styles.textStyle]}>{item}</Text>
                        </TouchableOpacity>
                    )
                }
            </ScrollView>
        </View>
    )
}

export default Navbar