import {useState, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView, RefreshControl } from 'react-native';
import LottieView from 'lottie-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRewardedAd } from 'react-native-google-mobile-ads';

import { updateCredit } from '../../../redux/actions/auth.action';
import EditText from '../../../components/edittext';
import GlobalStyle from '../../../assets/values/global.style';
import useColors from '../../../assets/values/colors';
import { OpenAIPrompt, AddFavoritePrompt } from '../../../redux/actions/openai.action';
import blankImage from '../../../assets/drawables/prompt_template.png';
import BottomNavigator from '../../../components/bottom.navigator';
import Config from '../../../redux/config';
import useCustomerInfo from '../../../redux/useCustomerInfo';
const {width, height} = Dimensions.get('window');

const adUnit = Config.Rewarded.AdUnitID;
const requestOptions = {};

const PromptDetailScreen = (props) => {
    const [customerInfo, getCustomerInfo] = useCustomerInfo();
    const [Colors, GetColors] = useColors()
    const _favorite = useRef(null);
    const [query, setQuery] = useState('');
    const [index, setIndex] = useState(1);
    const [images, setImages] = useState([
        // { prompt: 'Monumental sculpture on a square', url: 'https://cdn.stablediffusionapi.com/generations/118ad7f8-7c0c-4cba-8182-24849657305d-0.png' }
    ]);
    const dispatch = useDispatch();
    const [selected, setSelected] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const AuthReducer = useSelector(state => state.AuthReducer);
    const { isLoaded, isClosed, load, show, isEarnedReward, reward } = useRewardedAd(adUnit, requestOptions)

    const styles = new StyleSheet.create({
        icon: {
            width: 20,
            height: 20,
            resizeMode: 'contain'
        },
        title: {
            color: Colors.bgLight,
            fontSize: 20,
        },
        round: {
            width: 10,
            height: 10,
            borderRadius: 100,
            backgroundColor: Colors.bgDark,
            marginRight: 10,
        },
        green: {
            backgroundColor: '#23DB77',
            width: 30,
        },
        scrollContainer: {
            width: '90%'
        },
        scrollItem: {
            width: width / 3, 
            height: 100, 
            resizeMode: 'cover', 
            borderRadius: 10,
            marginRight: 10,
        },
        preview: {
            width: width, 
            height: width / 1.3, 
            padding: 20, 
            backgroundColor: Colors.bgDark,
            marginTop: 20,
            position: 'relative'
        }
    });

    useEffect(() => { GetColors() }, [])
    useEffect(() => {
        if(isEarnedReward) {
            dispatch(updateCredit(AuthReducer.data.uid, AuthReducer.data.credit + 1))
        }
    }, [isEarnedReward])

    useEffect(() => {
        if(isLoaded) show();
    }, [isLoaded])

    useEffect(() => {
        getCustomerInfo();
        setTimeout(() => {
            _favorite.current.play()
        }, 1000)

        setQuery(props.route.params.query)
        setImages(images => [...images, {
            prompt: props.route.params.query,
            url: props.route.params.url
        }])
        setPreviewImage(props.route.params.url)
        setSelected(items => [ ...items, 1 ])
        setIndex(1);
    }, [])

    useEffect(() => {
        selected.indexOf(index) >= 0 ? _favorite.current.play() : _favorite.current.reset();
    }, [index]);

    const generate = async () => {
        setRefreshing(true);
        let n = 1;
        for(let i = 0 ; i < n ; i++) {
            let result = await OpenAIPrompt(query, 1, 512, i);
            console.log(result);
            if(result.images.status === 'success') setImages(images => [ ...images, {
                prompt: result.prompt,
                url: result.images.output[0]
            }]);
        }
        setRefreshing(false);
    }

    const handleSearchPrompt = async () => {
        if(query !== '' && !refreshing) {
            if(customerInfo !== null) {
                if(customerInfo.activeSubscriptions.length > 0) {
                    generate()
                } else if(AuthReducer.data.credit > 0) {
                    dispatch(updateCredit(AuthReducer.data.uid, AuthReducer.data.credit - 1))
                    generate();
                } else {
                    let value = Math.random()
                    if(value > 0.5) {
                        props.navigation.replace('License');
                    } else {
                        setRefreshing(true);
                        load();
                    }
                }
            } 
        }
    }

    useEffect(() => {
        if(isEarnedReward) {
            dispatch(updateCredit(AuthReducer.data.uid, AuthReducer.data.credit + 1))
        }
        setRefreshing(false);
    }, [isEarnedReward])

    useEffect(() => {
        setRefreshing(false);
    }, [isClosed])

    const addFavorite = (prompt, url) => {
        _favorite.current.play()
        setSelected(items => [ ...items, index ])
        AddFavoritePrompt(AuthReducer.data.uid, prompt, url);
    }

    return (
        <View style={[{backgroundColor: Colors.background}, GlobalStyle.container, GlobalStyle.column_center]}>
            <View style={[GlobalStyle.row, { justifyContent: 'space-between', alignItems: 'center', width: '90%', paddingLeft: 10, paddingRight: 10 }]}>
                <TouchableOpacity onPress={() => props.navigation.replace('PromptAI')}>
                    <Image tintColor={Colors.bgLight} source={require('../../../assets/drawables/ic_back.png')} style={[styles.icon]} />
                </TouchableOpacity>
                <Text style={[GlobalStyle.ManjariBold, styles.title]}>Talk AI Prompts</Text>
                <View></View>
            </View>
            <View style={{width: width, flexDirection: 'row', justifyContent:'center'}}>
                <EditText value={query} onChange={(e) => setQuery(e)} searchSubmit={handleSearchPrompt} erase={false} style={{marginTop: 20}} icon={require('../../../assets/drawables/ic_search.png')} placeholder="Search.." />
            </View>
            <View style={[GlobalStyle.row_center, GlobalStyle.column_center, styles.preview]}>
                <Image style={{ width: width / 1.5, height: width / 1.5, resizeMode: 'stretch', borderRadius: 10 }} source={previewImage === '' ? blankImage : { uri: previewImage }} />
                <TouchableOpacity onPress={() => addFavorite(images[index-1].prompt, images[index-1].url)} style={{position: 'absolute', top: 10, right: 10, backgroundColor: Colors.bgLight, borderRadius: 100}}>
                    <LottieView
                        ref={_favorite}
                        style={{width: 40, height: 40, borderRadius: 100, backgroundColor: Colors.bgDark }}
                        source={require('../../../assets/favorite.json')}
                        loop={false}
                    />
                </TouchableOpacity>
            </View>
            <View style={[GlobalStyle.row, GlobalStyle.row_center, GlobalStyle.column_center, { marginBottom: 20, marginTop: 20 }]}>
                { images.map((item, key, array) => <View key={key} style={[styles.round, key === index - 1 && styles.green]}></View>) }
            </View>
            <ScrollView horizontal={true} style={[styles.scrollContainer]} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleSearchPrompt} />
            }>
            {
                images.map((item, key, array) => 
                    <TouchableOpacity key={key} onPress={() => { setIndex(key + 1); setPreviewImage(item.url)} }>
                        <Image style={[styles.scrollItem]} source={item.url === '' ? blankImage : {uri: item.url}} />
                    </TouchableOpacity>
                )
            }
            </ScrollView>
            <BottomNavigator active="PromptAI" navigation={props.navigation} />
        </View>
    )
}

export default PromptDetailScreen;