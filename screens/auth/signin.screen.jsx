import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import * as Animatable from 'react-native-animatable';
import * as SecureStore from 'expo-secure-store';
import { View, Text, TextInput, ImageBackground, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native';
import useCustomerInfo from '../../redux/useCustomerInfo';
import analytics from '@react-native-firebase/analytics';

import Button from '../../components/button';
import EditText from '../../components/edittext';
import GlobalStyle from '../../assets/values/global.style';
import useColors from '../../assets/values/colors';
import { DoFirebaseSignIn, DoGoogleSignIn, DoFaceBookSignIn } from '../../redux/actions/auth.action';
import Loading from '../../components/loading';
const {width, height} = Dimensions.get('window');

const SignIn = (props) => {
    const [Colors, GetColors] = useColors()
    const [agree, setAgree] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [customerInfo, getCustomerInfo] = useCustomerInfo();

    const _checkbox = useRef(), emailRef = useRef(null), pwdRef = useRef(null);

    const AuthReducer = useSelector(state => state.AuthReducer);
    const dispatch = useDispatch();

    const styles = new StyleSheet.create({
        background: {
            height: height,
            resizeMode: 'contain'
        },
        title: {
            color: Colors.mainGreen,
            fontSize: 30,
            marginTop: height / 15,
            marginBottom: height / 20
        },
        description: {
            color: Colors.bgLight,
            fontSize: 20,
            fontWeight: 400,
        },
        label: {
            color: Colors.bgLight,
            marginTop: 10,
            marginBottom: 10,
        },
        underline: {
            textDecorationLine: 'underline'
        },
        tinyLabel: {
            color: Colors.secondaryText,
            fontSize: 12
        },
        footer: {
            width: '60%'
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

    useEffect(() => {
        GetColors()
        SecureStore.getItemAsync('email').then(result => {
            if(result !== undefined && result !== null) {
                setEmail(result);
                setAgree(true);
                _checkbox.current.play();
            }
        });
        SecureStore.getItemAsync('password').then(result => {
            if(result !== undefined && result !== null) {
                setPassword(result);
                setAgree(true);
                _checkbox.current.play();
            }
        });
    }, [])

    useEffect(() => {
        if(loading) {
            if(AuthReducer.IS_REQUEST) {
                setLoading(true);
            } else if(AuthReducer.IS_SUCCESS) {
                setLoading(false);
                if(AuthReducer.service === 'firebase') {
                    if(AuthReducer.data.emailVerifed) {
                        Toast.show({ type: 'success', position: 'top', text1: 'Congratulations!', text2: 'Your action was successful!', visibilityTime: 3000, autoHide: true, topOffset: 30, bottomOffset: 40 });
                        if(agree) {
                            SecureStore.setItemAsync('email', email);
                            SecureStore.setItemAsync('password', password);
                        }
                        analytics().logLogin({method: 'firebase.com'})
                        GoHome();
                    } else {
                        Toast.show({ type: 'error', position: 'top', text1: 'Confirm Email Verification', text2: 'Please verify your identity!', visibilityTime: 3000, autoHide: true, topOffset: 30, bottomOffset: 40 });
                    }
                } else {
                    Toast.show({ type: 'success', position: 'top', text1: 'Congratulations!', text2: 'Your action was successful!', visibilityTime: 3000, autoHide: true, topOffset: 30, bottomOffset: 40 });
                    analytics().logLogin({method: `${AuthReducer.service}.com`})
                    GoHome();
                }
            } else if(AuthReducer.IS_FAILURE) {
                Toast.show({ type: 'error', position: 'top', text1: AuthReducer.data.error, text2: AuthReducer.data.error_description, visibilityTime: 3000, autoHide: true, topOffset: 30, bottomOffset: 40 });
                setLoading(false);
            }
        }
    }, [AuthReducer]);

    useEffect(() => {
        if(customerInfo !== null) {
            if(customerInfo.activeSubscriptions.length > 0) {
                props.navigation.replace('Home')
            } else {
                props.navigation.replace('License')
            }
        }
    }, [customerInfo]);

    const GoHome = () => getCustomerInfo();

    const onAgree = () => {
        if(!agree) _checkbox.current.play(), setAgree(true);
        else _checkbox.current.reset(), setAgree(false);
    }

    const DoFirebaseAuth = () => {
        // props.navigation.replace('Home');
        if(email === '' || email === null) emailRef.current.shake(1000);
        else if(password === '' || password === null) pwdRef.current.shake(1000);
        else {
            setLoading(true);
            dispatch(DoFirebaseSignIn(email, password));
        }
    }
    const DoGoogleSignInAuth = () => {
        setLoading(true);
        dispatch(DoGoogleSignIn('signin'));
    }

    const DoFacebookSignInAuth = () => {
        setLoading(true);
        dispatch(DoFaceBookSignIn('signin'));
    }

    return (
        <View style={[{backgroundColor: Colors.background}, GlobalStyle.container, GlobalStyle.row_space_around, {paddingVertical: 10}]}>
            <ImageBackground source={require('../../assets/drawables/dector_pattern.png')} style={[styles.background, GlobalStyle.column_center]}>
                <Image source={require('../../assets/drawables/freepik.png')} style={{width: width / 3, height: width / 3, position: 'absolute', left: 0, bottom: 0}} />
                <Text style={[GlobalStyle.ManjariBold, styles.title]}>Sign In</Text>
                <View style={[GlobalStyle.Manjari, {width: '100%', justifyContent: 'flex-start', paddingLeft: width / 20}]}>
                    <Text style={[GlobalStyle.Manjari, styles.description]}>For sign in, please, enter your e-mail</Text>
                    <Text style={[GlobalStyle.Manjari, styles.description]}>and password in the fields below.</Text>
                </View>
                <Animatable.View ref={emailRef} useNativeDriver={true} style={{width: '100%', alignItems: 'center'}}>
                    <EditText value={email} onChange={(e) => setEmail(e)} placeholder="Enter Your Email" style={{marginTop: 50}} inputMode="text" />
                </Animatable.View>
                <Animatable.View ref={pwdRef} useNativeDriver={true} style={{width: '100%', alignItems: 'center'}}>
                    <EditText value={password} onChange={(e) => setPassword(e)} placeholder="Enter Your Password" style={{marginTop: 20}} inputMode="password" />
                </Animatable.View>
                <View style={[GlobalStyle.row, GlobalStyle.column_center, { width: '100%', paddingLeft: '5%', marginTop: 10 }]} >
                    <TouchableOpacity onPress={() => onAgree()}>
                        <LottieView
                            ref={_checkbox}
                            style={{width: 40, height: 40, backgroundColor: 'transparent', color: Colors.bgLight }}
                            source={require('../../assets/checkbox.json')}
                            loop={false}
                        />
                    </TouchableOpacity>
                    <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight}]}>Remember me after Login.</Text>
                </View>

                <TouchableOpacity style={[styles.buttonStyle, GlobalStyle.row, GlobalStyle.row_center, GlobalStyle.column_center, { marginTop: 20 }]} onPress={DoGoogleSignInAuth}>
                    <LottieView
                        autoPlay
                        style={{width: 40, height: 40, }}
                        source={require('../../assets/google.json')}
                    />
                    <Text style={[GlobalStyle.ManjariBold, styles.buttonText]}>   SIGN IN WITH GOOGLE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonStyle, GlobalStyle.row, GlobalStyle.row_center, GlobalStyle.column_center, { marginTop: 10 }]} onPress={DoFacebookSignInAuth}>
                    <LottieView
                        autoPlay
                        style={{width: 40, height: 40, }}
                        source={require('../../assets/facebook.json')}
                    />
                    <Text style={[GlobalStyle.ManjariBold, styles.buttonText]}>   SIGN IN WITH FACEBOOK</Text>
                </TouchableOpacity>
                <Button title="SIGN IN" marginTop={10} width='90%' bgColor={Colors.mainGreen} titleColor={Colors.darkGreen} onPress={() => DoFirebaseAuth()} />
                <Text style={[GlobalStyle.Manjari, styles.label, GlobalStyle.underline]}>FORGET PASSWORD</Text>

                <View style={[styles.footer, GlobalStyle.row, GlobalStyle.row_space_around, GlobalStyle.column_center]}>
                    <Text style={[GlobalStyle.Manjari, styles.tinyLabel]}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => props.navigation.push('SignUp')}>
                        <Text style={[GlobalStyle.Manjari, styles.tinyLabel, GlobalStyle.underline]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                <Loading loading={loading} />
                <Toast />
            </ImageBackground>
        </View>
    );
}

export default SignIn;