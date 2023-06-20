import React from 'react'
import Config from './config';
import FirebaseApp from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';

const useTrackEvent = () => {
    const [response, setResponse] = React.useState(false);
//nlbXrQ3DouQYzDlNhKfEZ0Rakad2
    const updateTrack = async () => {
        if(!FirebaseApp.apps.length) await FirebaseApp.initializeApp(Config.firebaseConfig);
        
        // await FirebaseApp.app();
        // analytics().setCurrentScreen('Analytics');

        
        await Promise.all([
            analytics().setUserId('nlbXrQ3DouQYzDlNhKfEZ0Rakad2'),
            analytics().setUserProperty('account_balance', 1000),
        ]);

        analytics().logEvent('chat_started', {
            id: 3745092
        }).then((result) => {
            console.log('then', result)
        }).catch(error => {
            console.log('error', error);
        })
    }

    return [response, updateTrack]
}

export default useTrackEvent