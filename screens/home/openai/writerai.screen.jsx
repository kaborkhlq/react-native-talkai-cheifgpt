import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Dimensions, ToastAndroid} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown'
import * as Clipboard from 'expo-clipboard';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

import useLicenseModal from '../../../components/license.modal';
import Button from '../../../components/button';
import useColors from '../../../assets/values/colors';
import GlobalStyle from '../../../assets/values/global.style'
import Loading from '../../../components/loading';
import Config from '../../../redux/config';
import useCustomerInfo from '../../../redux/useCustomerInfo';

import { updateCredit } from '../../../redux/actions/auth.action';
import { OpenAIWriter } from '../../../redux/actions/openai.action';
import { ScrollView } from 'react-native-gesture-handler';
const {width, height} = Dimensions.get('window');

const WriterAI = (props) => {
    const [setPopup, LicenseModal] = useLicenseModal(props.navigation);
    const [Colors, GetColors] = useColors();
    const [customerInfo, getCustomerInfo]= useCustomerInfo()
    const [loading, setLoading] = useState(true);
    const [reqmsg, setReqMsg] = useState('');
    const [message, setMessage] = useState("If you want to start your own business or need new ideas for your current business, Talk AI Assisstant can help generate new concepts and strategies.");
    const [prompt, setPrompt] = useState(null);
    const [categoryData, setCategoryData] = useState([]);
    const [category, setCategory] = useState('');
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();
    const OpenAIReducer = useSelector(state => state.OpenAIReducer);
    const AuthReducer = useSelector(state => state.AuthReducer)

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
        containerStyle: {
            backgroundColor:'transparent',
            borderRadius: 10, 
            borderStyle:'solid', 
            borderColor: Colors.bgLight, 
            borderWidth: 1, 
            width: '100%',
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
            margin:  5,
            fontSize: 16, 
            color: Colors.bgLight,
        },
        dropdownIcon: {
            width: 15,
            height: 15,
            resizeMode: 'contain'
        },
        textStyle: {
            fontSize: 16, 
            color: Colors.bgLight
        },
        mt15: {
            marginTop: 15,
        },
        mb10: {
            marginBottom: 10
        },
        textAreaStyle: {
            textAlignVertical: 'top',
            color: Colors.bgLight,
            fontSize: 16, 
        }
    });

    useEffect(() => {
        GetColors()
        getCustomerInfo();
        setLoading(true);
        setPrompt(props.route.params.prompt);
        setCategoryData(props.route.params.categoryData);
        setCategory(props.route.params.category);
        setQuery(props.route.params.query);
    }, [])

    useEffect(() => {
        if(query !== '') setLoading(false);
    }, [query]);

    useEffect(() => {
        if(loading) {
            if(OpenAIReducer.IS_REQUEST) {
                setLoading(true);
            } else if(OpenAIReducer.IS_SUCCESS) {
                setMessage(OpenAIReducer.openAIWriterMsg);
                setLoading(false);
            } else if(OpenAIReducer.IS_FAILURE) {
                setLoading(false);
            }
        }
    }, [OpenAIReducer])

    const generateAdvise = () => {
        if(customerInfo !== null) {
            if(customerInfo.activeSubscriptions.length > 0) {
                setLoading(true);
                dispatch(OpenAIWriter(`${category}, ${query}`, reqmsg));
            } else if(AuthReducer.data.credit > 0) {
                dispatch(updateCredit(AuthReducer.data.uid, AuthReducer.data.credit - 1))
                setLoading(true);
                dispatch(OpenAIWriter(`${category}, ${query}`, reqmsg));
            } else {
                setPopup(true);
            }
        } 
    }

    const copyMessage = async () => {
        await Clipboard.setStringAsync(message);
        ToastAndroid.show('Content successfully copied.', ToastAndroid.LONG);
    }

    return (
        <View style={[{backgroundColor: Colors.background}, GlobalStyle.container, styles.container]}>
            <View style={[GlobalStyle.row, { justifyContent: 'space-between', alignItems: 'center', width: '100%' }]}>
                <TouchableOpacity onPress={() => props.navigation.replace('Home')}>
                    <Image tintColor={Colors.bgLight} source={require('../../../assets/drawables/ic_back.png')} style={[styles.icon]} />
                </TouchableOpacity>
                <Text style={[GlobalStyle.ManjariBold, styles.title]}>Talk AI Writer</Text>
                <TouchableOpacity style={[GlobalStyle.row, GlobalStyle.column_center, GlobalStyle.row_center]}>
                    <FontAwesome5 style={{marginRight: 10}} name="coins" size={24} color={Colors.bgLight} />
                    <Text style={[GlobalStyle.ManjariBold, styles.title]}>{AuthReducer.data.credit}</Text>
                </TouchableOpacity>
            </View>
            <Text style={[GlobalStyle.ManjariBold, styles.textStyle, styles.mt15, styles.mb10]}>Case</Text>
            <SelectDropdown
                data={loading ? [] : prompt[category]}
                onSelect={(selectedItem, index) => { setQuery(selectedItem) }}
                defaultValue={loading ? '' : query}
                buttonStyle={[styles.containerStyle]}
                rowStyle={[{backgroundColor: Colors.background, borderStyle: 'solid', borderBottomWidth: 1.5, borderColor: Colors.bgLight}]}
                rowTextStyle={[GlobalStyle.Manjari, styles.textStyle]}
                buttonTextStyle={[GlobalStyle.Manjari, styles.textStyle]}
                renderDropdownIcon={() => (<Image tintColor={Colors.bgLight} style={[styles.dropdownIcon]} source={require('../../../assets/drawables/ic_arrow_right.png')} />)}
                dropdownIconPosition="right"
            />
            <Text style={[GlobalStyle.ManjariBold, styles.textStyle, styles.mt15, styles.mb10]}>About</Text>
            <TextInput onChangeText={(e) => setReqMsg(e)} style={[GlobalStyle.Manjari, styles.containerStyle]} placeholder="Candy business in London" placeholderTextColor={Colors.secondaryText} />            
            <View style={[styles.containerStyle, { marginTop: 10, height: height / 2, position: 'relative' }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={[GlobalStyle.Manjari, styles.textAreaStyle]}>{message}</Text>
                </ScrollView>
                <TouchableOpacity onPress={copyMessage} style={{position: 'absolute', top: -15, right: -15, backgroundColor:Colors.bgDark, padding: 10, borderRadius: 30, borderStyle:'solid', borderWidth: 1, borderColor: '#23DB77'}}>
                    <Feather name="copy" size={20} color={Colors.bgLight} />
                </TouchableOpacity>
            </View>
            <Button title="GENERATE TEXT" width='100%' marginTop={10} bgColor={Colors.mainGreen} titleColor={Colors.darkGreen} onPress={() => generateAdvise()} />
            <Loading loading={loading} />
            {LicenseModal}
        </View>
    )
}

export default WriterAI