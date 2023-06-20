import { useEffect, useState } from 'react';
import {View, Image, StyleSheet, Dimensions, Text, TouchableOpacity} from 'react-native'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
const {width, height} = Dimensions.get('window')
import { AntDesign } from '@expo/vector-icons';

import useColors from '../../assets/values/colors';
import GlobalStyle from '../../assets/values/global.style';

export default function ImageView({route, navigation}) {
    const [Colors, GetColors] = useColors();
    const [prompt, setPrompt] = useState('')
    const [uri, setUri] = useState(null)

    useEffect(() => {
        setPrompt(route.params.prompt)
        setUri(route.params.uri)
    }, [route.params])

    useEffect(() => {
        GetColors()
    }, [])

    return (
      <View style={styles.container}>
        <View style={[GlobalStyle.row, {justifyContent: 'flex-end', width: '100%'}]}>
            <TouchableOpacity onPress={() => navigation.pop()}>
                <AntDesign name="close" size={24} color={Colors.bgLight} />
            </TouchableOpacity>
        </View>
        <Text style={[GlobalStyle.ManjariBold, {color: Colors.bgLight, textAlign: 'center', fontSize: 20}]}>{prompt}</Text>
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