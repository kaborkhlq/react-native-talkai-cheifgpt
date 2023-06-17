import React, {useEffect, useState, useRef} from 'react';
import * as SecureStore from 'expo-secure-store';
import {View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, Linking, Platform} from 'react-native';
import { Avatar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';
import moment from 'moment/moment';
import { DoFirebaseSignOut, GoogleSignOut, FaceBookSignOut } from '../../redux/actions/auth.action';
import { MaterialIcons, Feather, Entypo, Octicons } from '@expo/vector-icons'; 

import useColors from '../../assets/values/colors';
import GlobalStyle from '../../assets/values/global.style';
import BottomNavigator from '../../components/bottom.navigator';
import useCustomerInfo from '../../redux/useCustomerInfo';
import Config from '../../redux/config';

const {width, height} = Dimensions.get('window');
const GOOGLE_PACKAGE_NAME = 'com.chiefgpt.talkai'

const ProfileScreen = (props) => {
    const [Colors, GetColors] = useColors();
    const AuthReducer = useSelector(state => state.AuthReducer);
    const [customerInfo, getCustomerInfo] = useCustomerInfo()
    const dispatch = useDispatch()

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
        label: {
            color: Colors.bgLight,
            fontSize: 18,
        },
        slabel: {
            color: Colors.secondaryText,
            fontSize: 15,
        }
    });

    useEffect(() => {
        GetColors()
        getCustomerInfo();
        console.log(AuthReducer.data)
    }, []);

    const changeTheme = () => {
        SecureStore.getItemAsync('theme').then(result => {
            let theme = '';
            if(result === undefined || result === null || result === 'dark') theme = 'light'
            else if(result === 'light') theme = 'dark'
            SecureStore.setItemAsync('theme', theme).then(result => {
                props.navigation.replace('Profile')
            })
        });
    }

    const rateUs = () => {
        if (Platform.OS != 'ios') {
            //To open the Google Play Store
            Linking.openURL(`market://details?id=${GOOGLE_PACKAGE_NAME}`).catch(err =>
              alert('Please check for the Google Play Store')
            );
        } else {
            //To open the Apple App Store
            Linking.openURL(
              `itms://itunes.apple.com/in/app/apple-store/${APPLE_STORE_ID}`
            ).catch(err => alert('Please check for the App Store'));
        }
    }

    const signOut = () => {
        if(AuthReducer.service === 'google') dispatch(GoogleSignOut());
        else if(AuthReducer.service === 'firebase') dispatch(DoFirebaseSignOut());
        else dispatch(FaceBookSignOut());

        props.navigation.replace('SignIn')
    }

    return (
        <View style={[{backgroundColor: Colors.background}, GlobalStyle.container, styles.container, GlobalStyle.column_center]}>
            <View style={[GlobalStyle.row, { justifyContent: 'space-between', alignItems: 'center', width: '100%' }]}>
                <TouchableOpacity onPress={() => props.navigation.replace('Home')}>
                    <Image tintColor={Colors.bgLight} source={require('../../assets/drawables/ic_back.png')} style={[styles.icon]} />
                </TouchableOpacity>
                <Text style={[GlobalStyle.ManjariBold, styles.title]}>Talk AI Profile</Text>
                <View></View>
            </View>
            <View style={[GlobalStyle.row, GlobalStyle.column_center, {width: '100%'}]}>
                <Avatar.Image size={80} source={{uri: AuthReducer.data.photo}} style={{marginRight: 20, marginTop: 20}} />
                <View>
                    <Text style={[GlobalStyle.ManjariBold, styles.label]}>{AuthReducer.data.username}</Text>
                    {(customerInfo && customerInfo.activeSubscriptions.length > 0) ? (
                        <Text style={[GlobalStyle.ManjariBold, styles.slabel]}>Subscribe is active till {moment(customerInfo.latestExpirationDate).format('DD.MM.YYYY')}</Text>
                    ) : (
                        <Text style={[GlobalStyle.ManjariBold, styles.slabel]}>No Subscription</Text>
                    )}
                </View>
            </View>
            <TouchableOpacity style={[GlobalStyle.row, GlobalStyle.column_center, {width: '100%', marginTop: 20,}]}>
                <Feather style={{marginRight: 20}} name="phone" size={24} color={Colors.bgLight} />
                <Text style={[GlobalStyle.ManjariBold, styles.label]}>{AuthReducer.data.phone === null ? 'No Phone' : AuthReducer.data.phone}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[GlobalStyle.row, GlobalStyle.column_center, {width: '100%', marginTop: 20,}]}>
                <Entypo style={{marginRight: 20}} name="credit" size={24} color={Colors.bgLight} />
                <Text style={[GlobalStyle.ManjariBold, styles.label]}>{AuthReducer.data.credit} Credit Available</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[GlobalStyle.row, GlobalStyle.column_center, {width: '100%', marginTop: 20,}]}>
                <Octicons style={{marginRight: 20}} name="verified" size={24} color={Colors.bgLight} />
                <Text style={[GlobalStyle.ManjariBold, styles.label]}>{AuthReducer.data.emailVerifed ? 'Email Verified' : 'Email Not Verified'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={changeTheme} style={[GlobalStyle.row, GlobalStyle.column_center, {width: '100%', marginTop: 20,}]}>
                <Entypo style={{marginRight: 20}} name="light-up" size={24} color={Colors.bgLight} />
                <Text style={[GlobalStyle.ManjariBold, styles.label]}>Change Screen Mode</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={rateUs} style={[GlobalStyle.row, GlobalStyle.column_center, {width: '100%', marginTop: 20,}]}>
                <Octicons style={{marginRight: 20}} name="star" size={24} color={Colors.bgLight} />
                <Text style={[GlobalStyle.ManjariBold, styles.label]}>Rate US</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={signOut} style={[GlobalStyle.row, GlobalStyle.column_center, {width: '100%', marginTop: 20,}]}>
                <Octicons style={{marginRight: 20}} name="sign-out" size={24} color={Colors.bgLight} />
                <Text style={[GlobalStyle.ManjariBold, styles.label]}>Sign Out</Text>
            </TouchableOpacity>
            
            <BottomNavigator active="Profile" navigation={props.navigation} />
        </View>
    )
}

export default ProfileScreen