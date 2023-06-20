import KEYS from '../keys';
import Config from '../config';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Auth from '@react-native-firebase/auth';
import FirebaseApp from '@react-native-firebase/app';
import FireStore from '@react-native-firebase/firestore';
import analytics from '@react-native-firebase/analytics';
import * as Facebook from 'expo-facebook';

export const DoFirebaseSignIn = (email, pwd) => dispatch => {
    dispatch({type: KEYS.SIGN_IN_REQUEST})
    if(!FirebaseApp.apps.length) FirebaseApp.initializeApp(Config.firebaseConfig);

    Auth().signInWithEmailAndPassword(email, pwd).then(result => {
        analytics().setUserId(result.user.uid)
        FireStore().collection('Users').doc(result.user.uid).get().then(doc => {
            dispatch({
                type: KEYS.SIGN_IN_SUCCESS,
                payload: {
                    uid: result.user.uid,
                    email: result.user.email,
                    emailVerifed: result.user.emailVerified,
                    username: doc._data.username,
                    phone: doc._data.phone,
                    photo: result.user.photoURL,
                    credit: doc._data.phone
                },
                service: 'firebase'
            })
        });
    }).catch(error => {
        dispatch({
            type: KEYS.SIGN_IN_FAILURE,
            payload: {
                error: error.code,
                error_description: error.message 
            }
        })
    });
}

export const DoFirebaseSignUp = (email, username, phone, password) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch({type: KEYS.SIGN_UP_REQUEST})
        if(!FirebaseApp.apps.length) FirebaseApp.initializeApp(Config.firebaseConfig);

        Auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            FireStore().collection('Users').doc(user.uid).get().then(doc => {
                if(doc._data === undefined) {
                    FireStore().collection('Users').doc(user.uid).set({
                        phone: phone,
                        username: username,
                        favourites: [],
                        credit: 5
                    }).then(() => {
                        user.sendEmailVerification().then(result => {
                            dispatch({
                                type: KEYS.SIGN_UP_SUCCESS,
                                payload: {},
                                service: 'firebase'
                            })
                        }).catch(error => {
                            dispatch({
                                type: KEYS.SIGN_UP_FAILURE,
                                payload: error
                            })
                        })
                    });
                } else {
                    resolve('is-exist');
                }
            });
            
        })
        .catch((error) => {
            dispatch({
                type: KEYS.SIGN_UP_FAILURE,
                payload: error
            })
        });
    })
}
export const DoFirebaseSignOut = () => dispatch => {
    Auth()
    .signOut()
    .then(() => dispatch({type: SIGN_OUT_SUCCESS}));
    
}
export const DoGoogleSignIn = (type) => dispatch => {
    return new Promise(async (resolve, reject) => {
        dispatch({ type: KEYS.SIGN_IN_REQUEST })
        if(!FirebaseApp.apps.length) FirebaseApp.initializeApp(Config.firebaseConfig);
        
        GoogleSignin.configure({
            scopes: ['profile', 'email'], // what API you want to access on behalf of the user, default is email and profile
            webClientId: Config.webClientId, // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: true,
        });

        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            
            const googleCredential = Auth.GoogleAuthProvider.credential(userInfo.idToken);
            Auth().signInWithCredential(googleCredential).then(userCredential => {
                const user = userCredential.user;
                analytics().setUserId(user.uid)
                FireStore().collection('Users').doc(user.uid).get().then(doc => {
                    if(doc._data === undefined) {
                        FireStore().collection('Favorites').doc(user.uid).set({})
                        FireStore().collection('Users').doc(user.uid).set({
                            phone: user.phoneNumber,
                            username: user.displayName,
                            credit: 5,
                        }).then(() => {
                            dispatch({
                                type: KEYS.SIGN_IN_SUCCESS,
                                payload: {
                                    uid: user.uid,
                                    email: user.email,
                                    emailVerifed: user.emailVerified,
                                    username: user.displayName,
                                    phone: user.phoneNumber,
                                    photo: user.photoURL,
                                    credit: 5
                                },
                                service: 'google'
                            })
                        }).catch(error => {
                            dispatch({
                                type: KEYS.SIGN_IN_FAILURE,
                                payload: error
                            })
                        });
                    } else {
                        dispatch({
                            type: KEYS.SIGN_IN_SUCCESS,
                            payload: {
                                uid: user.uid,
                                email: user.email,
                                emailVerifed: user.emailVerified,
                                username: doc._data.username,
                                phone: doc._data.phone,
                                photo: user.photoURL,
                                credit: doc._data.credit
                            },
                            service: 'google'
                        })
                    }
                });
            });
        } catch (error) {
            console.log(error);
            dispatch({
                type: KEYS.SIGN_IN_FAILURE,
                payload: {
                    error: 'NETWORK_ERROR',
                    error_description: 'Check your network connection'
                }
            })
        }
    });
}
export const DoFaceBookSignIn = (type) => dispatch => {
    return new Promise(async (resolve, reject) => {
        dispatch({ type: KEYS.SIGN_IN_REQUEST })

        if(!FirebaseApp.apps.length) FirebaseApp.initializeApp(Config.firebaseConfig);
        
        try {
            await Facebook.initializeAsync({appId: Config.FB_APP_ID,});
            const { type, token } = await Facebook.logInWithReadPermissionsAsync({ permissions: ['public_profile', 'email'] })

            switch (type) {
                case 'success': {
                    const credential = Auth.FacebookAuthProvider.credential(token);
                    Auth.signInAndRetrieveDataWithCredential(credential).then(userCredential => {
                        const user = userCredential.user;
                        
                        FireStore().collection('Users').doc(user.uid).get().then(doc => {
                            if(doc._data === undefined) {
                                FireStore().collection('Favorites').doc(user.uid).set({})
                                FireStore().collection('Users').doc(user.uid).set({
                                    phone: user.phoneNumber,
                                    username: user.displayName,
                                    credit: 5,
                                }).then(() => {
                                    dispatch({
                                        type: KEYS.SIGN_IN_SUCCESS,
                                        payload: {
                                            uid: user.uid,
                                            email: user.email,
                                            emailVerifed: user.emailVerified,
                                            username: user.displayName,
                                            phone: user.phoneNumber,
                                            photo: user.photoURL,
                                            credit: 5
                                        },
                                        service: 'google'
                                    })
                                }).catch(error => {
                                    dispatch({
                                        type: KEYS.SIGN_IN_FAILURE,
                                        payload: error
                                    })
                                });
                            } else {
                                dispatch({
                                    type: KEYS.SIGN_IN_SUCCESS,
                                    payload: {
                                        uid: user.uid,
                                        email: user.email,
                                        emailVerifed: user.emailVerified,
                                        username: doc._data.username,
                                        phone: doc._data.phone,
                                        photo: user.photoURL,
                                        credit: doc._data.credit
                                    },
                                    service: 'google'
                                })
                            }
                        });
                    });
                }
                case 'cancel': {
                    dispatch({
                        type: KEYS.SIGN_IN_FAILURE,
                        payload: error
                    })
                }
            }
        } catch(error) {
            dispatch({
                type: KEYS.SIGN_IN_FAILURE,
                payload: error
            })
        }
    });    
}

export const updateCredit = (uid, credit) => dispatch => {
    return new Promise((resolve, reject) => {
        if(!FirebaseApp.apps.length) FirebaseApp.initializeApp(Config.firebaseConfig);
        
        FireStore().collection('Users').doc(uid).update('credit', credit).then(result => {
            dispatch({
                type: KEYS.UPDATE_CREDIT,
                payload: credit
            })
            resolve(result)
        }).catch(error => {
            reject(error)
        });
    })
}

export const GoogleSignOut = () => dispatch => {
    return new Promise(async (resolve, reject) => {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();

        dispatch({type: SIGN_OUT_SUCCESS})
    });
}

export const FaceBookSignOut = () => dispatch => {
    return new Promise(async (resolve, reject) => {
        dispatch({type: SIGN_OUT_SUCCESS})
    });
}