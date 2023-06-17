import React from 'react'
import Config from './config';
import FirebaseApp from '@react-native-firebase/app';
import FireStore from '@react-native-firebase/firestore';

const useUpdateCredit = () => {
    const [response, setResponse] = React.useState(false);

    const updateCredit = (uid, credit) => {
        if(!FirebaseApp.apps.length) FirebaseApp.initializeApp(Config.firebaseConfig);
        
        FireStore().collection('Users').doc(uid).update('credit', credit).then(result => {
            setResponse(true);
        }).catch(error => {
            setResponse(false);
        });
    }

    return [response, updateCredit]
}

export default useUpdateCredit