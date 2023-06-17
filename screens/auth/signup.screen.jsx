import React, {useState, useEffect, useRef} from 'react';
import { View, Text, ImageBackground, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import PhoneInput from "react-native-phone-number-input";
import Toast from 'react-native-toast-message';

import Button from '../../components/button';
import EditText from '../../components/edittext';
import GlobalStyle from '../../assets/values/global.style';
import useColors from '../../assets/values/colors';
import Loading from '../../components/loading';
const {width, height} = Dimensions.get('window');

import { DoFirebaseSignUp, DoGoogleSignIn, DoFaceBookSignIn } from '../../redux/actions/auth.action';

const SignUp = (props) => {
    const [Colors, GetColors] = useColors();
    const [agree, setAgree] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [vpassword, setVPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const agreeRef = useRef(), _checkbox = useRef(), nameRef = useRef(), emailRef = useRef(), phoneRef = useRef(), pwdRef = useRef(), vpwdRef = useRef();
    const dispatch = useDispatch();
    const AuthReducer = useSelector(state => state.AuthReducer);

    const styles = new StyleSheet.create({
        background: {
            height: height,
            resizeMode: 'contain'
        },
        title: {
            color: Colors.mainGreen,
            fontSize: 30,
            marginTop: 20,
            marginBottom: 20
        },
        description: {
            color: Colors.bgLight,
            fontSize: 20,
            fontWeight: 400,
        },
        label: {
            color: Colors.bgLight
        },
        underline: {
            textDecorationLine: 'underline'
        },
        tinyLabel: {
            color: Colors.secondaryText,
            fontSize: 12
        },
        footer: {
            marginTop: 10,
            width: '60%'
        },
        textContainer: {
            width: '100%',
            alignItems: 'center'
        },
        buttonStyle: {
            borderRadius: 25,
            padding: 4,
            backgroundColor: '#23DB77',
            width: '90%',
        },
        buttonText: {
            fontSize: 16,
            color: Colors.darkGreen
        },
    });

    useEffect(() => { GetColors() }, [])
    useEffect(() => {
        if(loading) {
            if(AuthReducer.IS_REQUEST) {
                setLoading(true);
            } else if(AuthReducer.IS_SUCCESS) {
                setLoading(false);
                if(AuthReducer.service ==='firebase') props.navigation.replace('SignIn')
                else props.navigation.replace('Home');
            } else if(AuthReducer.IS_FAILURE) {
                setLoading(false);
            }
        }
    },[AuthReducer]);

    const onAgree = () => {
        if(!agree) _checkbox.current.play(), setAgree(true);
        else _checkbox.current.reset(), setAgree(false);
    }

    const DoSignUp = () => {
        if(name === '') {
            nameRef.current.shake(1000);
        } else if(email === '') {
            emailRef.current.shake(1000);
        } else if(phoneNumber === '') {
            phoneRef.current.shake(1000);
        } else if(password === '') {
            pwdRef.current.shake(1000);
        } else if(vpassword === '') {
            vpwdRef.current.shake(1000);
        } else if(password !== vpassword) {
            pwdRef.current.shake(1000);
            vpwdRef.current.shake(1000);
        } else if(!agree) {
            agreeRef.current.shake(1000);
        } else {
            setLoading(true);
            dispatch(DoFirebaseSignUp(email, name, phoneNumber, password)).then(result => {
                setLoading(false);
                Toast.show({ type: 'error', position: 'top', text1: 'User Registeration', text2: 'User Email Already Exists!', visibilityTime: 3000, autoHide: true, topOffset: 30, bottomOffset: 40 })
            });
        }
    }

    const DoGoogleSignUp = () => {
        setLoading(true);
        dispatch(DoGoogleSignIn()).then(result => {
            setLoading(false);
            Toast.show({ type: 'error', position: 'top', text1: 'User Registeration', text2: 'User Email Already Exists!', visibilityTime: 3000, autoHide: true, topOffset: 30, bottomOffset: 40 })
        });
    }

    const DoFaceBookSignUp = () => {
        setLoading(true);
        dispatch(DoFaceBookSignIn()).then(result => {
            setLoading(false);
            Toast.show({ type: 'error', position: 'top', text1: 'User Registeration', text2: 'User Email Already Exists!', visibilityTime: 3000, autoHide: true, topOffset: 30, bottomOffset: 40 })
        });
    }

    return (
        <View style={[{backgroundColor: Colors.background}, GlobalStyle.container, GlobalStyle.row_space_around, {paddingVertical: 10}]}>
            <ImageBackground source={require('../../assets/drawables/dector_pattern.png')} style={[styles.background, GlobalStyle.column_center]}>
                <Text style={[GlobalStyle.ManjariBold, styles.title]}>Let's start</Text>
                <View style={{width: '100%', justifyContent: 'flex-start', paddingLeft: width / 20}}>
                    <Text style={[GlobalStyle.Manjari, styles.description]}>For the using TALK let's create </Text>
                    <Text style={[GlobalStyle.Manjari, styles.description]}>an account.</Text>
                </View>
                <Animatable.View ref={nameRef} useNativeDriver={true} style={styles.textContainer}>
                    <EditText onChange={(e) => setName(e)} placeholder="Name" style={{marginTop: 20}} inputMode="text" />
                </Animatable.View>
                <Animatable.View ref={emailRef} useNativeDriver={true} style={styles.textContainer}>
                    <EditText onChange={(e) => setEmail(e)} placeholder="E-mail" style={{marginTop: 10}} inputMode="email" />
                </Animatable.View>
                <Animatable.View ref={phoneRef} useNativeDriver={true} style={styles.textContainer}>
                <PhoneInput 
                    onChangeText={(text) => {setPhoneNumber(text);}}
                    codeTextStyle={[GlobalStyle.Manjari, GlobalStyle.column_center, GlobalStyle.row_center,{color: Colors.secondaryText}]} 
                    textInputProps={{placeholderTextColor : Colors.secondaryText}} 
                    containerStyle={[GlobalStyle.Manjari, GlobalStyle.column_center, GlobalStyle.row_center,{ backgroundColor: Colors.bgDark, width: '90%', paddingLeft: 20, paddingRight: 20, borderRadius: 20, marginTop: 10 }]} 
                    textContainerStyle={[GlobalStyle.Manjari, GlobalStyle.column_center, GlobalStyle.row_center,{ backgroundColor: Colors.bgDark, paddingTop: 8, paddingBottom: 8 }]} 
                    textInputStyle={[GlobalStyle.Manjari, GlobalStyle.column_center, GlobalStyle.row_center, { color: Colors.secondaryText, fontSize: 15 }]}
                    defaultCode="US"
                    layout="first" />
                </Animatable.View>
                <Animatable.View ref={pwdRef} useNativeDriver={true} style={styles.textContainer}>
                    <EditText onChange={(e) => setPassword(e)} placeholder="Password" style={{marginTop: 10}} inputMode="password" />
                </Animatable.View>
                <Animatable.View ref={vpwdRef} useNativeDriver={true} style={styles.textContainer}>
                    <EditText onChange={(e) => setVPassword(e)} placeholder="Confirm Password" style={{marginTop: 10}} inputMode="password" />
                </Animatable.View>

                <Animatable.View ref={agreeRef} style={[GlobalStyle.row, GlobalStyle.column_center, { width: '100%', paddingLeft: '5%', marginTop: 10 }]} >
                    <TouchableOpacity onPress={() => onAgree()}>
                        <LottieView
                            ref={_checkbox}
                            style={{width: 40, height: 40, backgroundColor: 'transparent', color: Colors.bgLight }}
                            source={require('../../assets/checkbox.json')}
                            loop={false}
                        />
                    </TouchableOpacity>
                    <Text style={[GlobalStyle.Manjari, styles.label]}>I agree with </Text>
                    <Text style={[GlobalStyle.Manjari, styles.label, styles.underline]}>Term</Text>
                    <Text style={[GlobalStyle.Manjari, styles.label]}> and  </Text>
                    <Text style={[GlobalStyle.Manjari, styles.label, styles.underline]}>Privacy Policy</Text>
                </Animatable.View>
                <TouchableOpacity style={[styles.buttonStyle, GlobalStyle.row, GlobalStyle.row_center, GlobalStyle.column_center, { marginTop: 20 }]} onPress={DoGoogleSignUp}>
                    <LottieView
                        autoPlay
                        style={{width: 40, height: 40, }}
                        source={require('../../assets/google.json')}
                    />
                    <Text style={[GlobalStyle.Manjari, styles.buttonText]}>   SIGN UP WITH GOOGLE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonStyle, GlobalStyle.row, GlobalStyle.row_center, GlobalStyle.column_center, { marginTop: 10 }]} onPress={DoFaceBookSignUp}>
                    <LottieView
                        autoPlay
                        style={{width: 40, height: 40, }}
                        source={require('../../assets/facebook.json')}
                    />
                    <Text style={[GlobalStyle.Manjari, styles.buttonText]}>   SIGN UP WITH FACEBOOK</Text>
                </TouchableOpacity>
                <Button title="SIGN UP" marginTop={10} width='90%' bgColor={Colors.mainGreen} titleColor={Colors.darkGreen} onPress={() => DoSignUp()} />

                <View style={[styles.footer, GlobalStyle.row, GlobalStyle.row_space_around, GlobalStyle.column_center]}>
                    <Text style={[GlobalStyle.Manjari, styles.tinyLabel]}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => props.navigation.push('SignIn')}>
                        <Text style={[GlobalStyle.Manjari, styles.tinyLabel, GlobalStyle.underline]}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            <Loading loading={loading} />
            <Toast />
        </View>
    );
}

export default SignUp;