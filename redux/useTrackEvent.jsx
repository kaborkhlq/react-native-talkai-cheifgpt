import React from 'react'
import Config from './config';
import FirebaseApp from '@react-native-firebase/app';
import analytics, { firebase } from '@react-native-firebase/analytics';

const useTrackEvent = () => {
    const [response, setResponse] = React.useState(false);

    const updateTrack = async (event, data) => {
        try {
            if(!FirebaseApp.apps.length) await FirebaseApp.initializeApp(Config.firebaseConfig);

            if (firebase.app().utils().isRunningInTestLab) {
                analytics().setAnalyticsCollectionEnabled(false);
            } else {
                analytics().setAnalyticsCollectionEnabled(true);
            }
            
            await analytics().logEvent(event, data)
        } catch(error) {
            console.log(error);
        }
    }

    return [response, updateTrack]
}

export default useTrackEvent