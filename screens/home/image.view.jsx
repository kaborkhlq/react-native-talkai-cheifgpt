import { useEffect, useState, useRef } from 'react';
import {View, Image, StyleSheet, Dimensions, Text, TouchableOpacity, Platform, PermissionsAndroid} from 'react-native'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import * as Animatable from 'react-native-animatable'
import LottieView from 'lottie-react-native';
const {width, height} = Dimensions.get('window')
import { AntDesign } from '@expo/vector-icons';
import RNFetchBlob from 'rn-fetch-blob';

import useColors from '../../assets/values/colors';
import GlobalStyle from '../../assets/values/global.style';

export default function ImageView({route, navigation}) {
    const [Colors, GetColors] = useColors();
    const [prompt, setPrompt] = useState('')
    const [uri, setUri] = useState(null)
    const _favorite = useRef(), _download = useRef();

    useEffect(() => {
        console.log(route.params);
        setPrompt(route.params.prompt)
        setUri(route.params.uri)
    }, [route.params])

    useEffect(() => {
        GetColors()
    }, [])

    const handleDownload = async () => {
    
        // Function to check the platform
        // If iOS then start downloading
        // If Android then ask for permission
    
        if (Platform.OS === 'ios') {
            downloadImage();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message:
                        'App needs access to your storage to download Photos',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Once user grant the permission start downloading
                    console.log('Storage Permission Granted.');
                    downloadImage();
                } else {
                    // If permission denied then show alert
                    alert('Storage Permission Not Granted');
                }
            } catch (err) {
                // To handle permission related exception
                console.warn(err);
            }
        }
    };

    const downloadImage = () => {
        let image_URL = uri;
        let ext = getExtention(image_URL);
        ext = '.' + ext[0];
        const { config, fs } = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir;
        let options = {
            fileCache: true,
            addAndroidDownloads: { useDownloadManager: true, notification: true, path: PictureDir + `/${prompt}` + ext, description: 'Image' },
        };
        console.log(_download.current);
        _download.current.animate({ 0: { top: 10 }, 1: { top: 5 } });
        config(options)
            .fetch('GET', image_URL)
            .then(res => {
                _download.current.stopAnimation();
                _favorite.current.play()
        });
    };
    const getExtention = filename => {
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
    };

    return (
      <View style={[{backgroundColor: Colors.background}, styles.container]}>
        <View style={[GlobalStyle.row, {justifyContent: 'flex-end', width: '100%'}]}>
            <TouchableOpacity onPress={() => navigation.pop()}>
                <AntDesign name="close" size={24} color={Colors.bgLight} />
            </TouchableOpacity>
        </View>
        <Text style={[GlobalStyle.ManjariBold, {color: Colors.bgLight, textAlign: 'center', fontSize: 20, marginBottom: 10}]}>{prompt}</Text>
        <View style={{ flexShrink: 1, height: height, width: width, backgroundColor: Colors.background  }}>
            <ReactNativeZoomableView
                maxZoom={30}
                minZoom={1}
                contentWidth={width}
                contentHeight={height}
            >
                { uri && (
                    <Image
                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                        source={{ uri: uri }}
                    />
                ) }
            </ReactNativeZoomableView>
            
            <Animatable.View ref={_download} style={{justifyContent: 'center', alignItems:'center', width: 50, height: 50, overflow: 'hidden', position: 'absolute', top: 10, right: 10, backgroundColor: Colors.bgLight, borderRadius: 100}}>
                <TouchableOpacity onPress={handleDownload}>
                    <LottieView
                        ref={_favorite}
                        style={{width: 80, borderRadius: 100, backgroundColor: Colors.bgLight }}
                        source={require('../../assets/82387-download.json')}
                        loop={false}
                        autoPlay={false}
                    />
                </TouchableOpacity>
            </Animatable.View>
        </View>
      </View>
    );
  }
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});