import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, RefreshControl} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable'

import Navbar from '../../../components/navbar';
import useColors from '../../../assets/values/colors';
import GlobalStyle from '../../../assets/values/global.style';
import Loading from '../../../components/loading';
import BottomNavigator from '../../../components/bottom.navigator';

import EditText from '../../../components/edittext'
import { GetImagePrompt, GetFavouritesPrompt } from '../../../redux/actions/openai.action';
const {width, height} = Dimensions.get('window');
import NoData from '../../../assets/13659-no-data.json'

const slideUp = {0: { bottom: -1.5 * height }, 1: {bottom: 0}};
const slideDown = {0: { bottom: 0 }, 1: {bottom: -1.5 * height}};

const PromptAI = (props) => {
    const [Colors, GetColors] = useColors();
    const _scrollView = useRef(null);
    const [refreshing, setRefreshing] = useState(false);
    const [category, setCategory] = useState('');
    const [prompt, setPrompt] = useState(null);
    const [tab, setTab] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [query, setQuery] = useState('');
    const _panel = useRef();
    const [favorites, setFavorites] = useState([]);
    const [favoriteQueries, setFavoriteQueries] = useState([]);
    const [tfavoriteQueries, settFavoriteQueries] = useState([]);

    const AuthReducer = useSelector(state => state.AuthReducer);
    const styles = new StyleSheet.create({
        container: {
            padding: 10,
        },
        icon: {
            width: 20,
            height: 20,
            resizeMode: 'contain'
        },
        title: {
            color: Colors.bgLight,
            fontSize: 20,
            fontWeight: 'bold'
        },
        msgContent: {
            width: '100%',
            marginTop: 20,
            height: height - height / 10 * 3.5
        },
        portrait: {
            width: '100%',
            height: 200,
            resizeMode: 'cover',
            marginBottom: 10,
            borderRadius: 10,
        },
        label: {
            fontSize: 16,
            color: Colors.bgLight,
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 20,
        },
        textContainer: {
            backgroundColor: Colors.bgDark,
            borderRadius: 20,
            justifyContent: 'center',
        },
        text: { 
            color: Colors.bgLight, 
            fontSize: 15, 
            fontWeight: 400,
            textAlign: 'center',
            paddingHorizontal: 10,
        },
        toolPanel: {
            bottom: -1.5 * height, 
            position: 'absolute',
            width: width,
            height: height,
            backgroundColor: Colors.toolBackground,
            padding: 20
        },
    });

    const onFullScreen = (item, uri) => {
        if(item !== null && item !== undefined && uri !== null && uri !== undefined)
            props.navigation.push('ImageView', { prompt: item, uri: uri })
    }

    useEffect(() => {
        GetColors();
        setRefreshing(true)
        GetImagePrompt().then(result => {
            setPrompt(result._data);
            setRefreshing(false)
            setCategoryData(Object.keys(result._data)); 
        }).catch(error => {
            // console.log(error);
        });

        onRefresh();
    }, []);

    useEffect(() => {
        if(category !== '') _scrollView?.current?.scrollTo({ x: 0, y: 0, animated: true })
    }, [category]);

    const onRefresh = () => {
        setRefreshing(true);
        GetFavouritesPrompt(AuthReducer.data.uid).then(result => {
            if(result._data !== undefined && result._data !== null) {
                let keys = Object.keys(result._data), t = [];
                for(let i = 0 ; i < keys.length ; i++) {
                    if(result._data[keys[i]] !== '') t.push(keys[i])
                }
                setFavorites(result._data);
                setFavoriteQueries(t);
                settFavoriteQueries(t);
            }
            setRefreshing(false);
        }).catch(error => {
            // console.log(error);
        });
    }
    const toggleTab = () => { setRefreshing(false); setTab(!tab); }

    const goToDetailPage = (query, url) => {
        props.navigation.push('PromptAIDetail', {
            query: query,
            url: url
        })
    }

    const onMagicShow = () => {
        props.navigation.push('PromptAIDetail')
    }

    useEffect(() => {
        let t;
        if(query === '') {
            t = favoriteQueries;
        } else {
            t = favoriteQueries.filter((item, index, array) => item.indexOf(query) >= 0)
        }
        settFavoriteQueries(t);
    }, [query]);

    const renderPrompts = () => {
        if(prompt !== null && category !== '') {
            let t = [], c = 0, t1 = [];
            for(let i = 0 ; i < prompt[category].length ; i++) {
                if(c === 4) {
                    t.push(t1);
                    t1 = [];
                    c = 0;
                }
                t1.push(prompt[category][i]);
                c++;
            }
            t.push(t1);
            let component = t.map((item, index, array) => 
                <View key={index} style={{paddingHorizontal: 20, marginBottom: 10}}> 
                    <View style={[GlobalStyle.row, GlobalStyle.row_space_around]}>
                        {item[0] && (<TouchableOpacity style={[{width: '50%', marginRight: 20}, styles.textContainer, GlobalStyle.column_center]} onPress={() => goToDetailPage(item[0], '') } >
                            <Text style={[GlobalStyle.Manjari, styles.text]}>{item[0]}</Text>     
                        </TouchableOpacity>  )} 
                        <View style={{width: '50%'}}>
                            {item[1] && (<TouchableOpacity style={[styles.textContainer, GlobalStyle.column_center, { height: height / 10, justifyContent: 'center'}]} onPress={() => goToDetailPage(item[1], '') } >
                                <Text style={[GlobalStyle.Manjari, styles.text]}>{item[1]}</Text>     
                            </TouchableOpacity>  )} 
                            {item[2] && (<TouchableOpacity style={[styles.textContainer, GlobalStyle.column_center, { marginTop: 10,height: height / 10, justifyContent: 'center'}]} onPress={() => goToDetailPage(item[2], '') } >
                                <Text style={[GlobalStyle.Manjari, styles.text]}>{item[2]}</Text>     
                            </TouchableOpacity>  )}
                        </View>
                    </View> 
                    {item[3] && (<TouchableOpacity style={[{marginTop: 10, paddingVertical: 20}, styles.textContainer, GlobalStyle.column_center]} onPress={() => goToDetailPage(item[3], '') } >
                        <Text style={[GlobalStyle.Manjari, styles.text]}>{item[3]}</Text>     
                    </TouchableOpacity> )} 
                </View>
            )
            return component
            // prompt[category].map((item, index, array) =>
            // <TouchableOpacity key={index} style={[styles.textContainer, GlobalStyle.column_center]} 
            // onPress={() => goToDetailPage(item, '') }>
            //     <Text style={[GlobalStyle.Manjari, styles.text]}>{item}</Text>       
            // </TouchableOpacity>
        } else {
            return (<View></View>)
        }
    }

    return (
        <View style={[{backgroundColor: Colors.background}, GlobalStyle.container, styles.container, GlobalStyle.column_center]}>
            <View style={[GlobalStyle.row, { justifyContent: 'space-between', alignItems: 'center', width: '90%' }]}>
                <TouchableOpacity onPress={() => props.navigation.replace('Home')}>
                    <Image tintColor={Colors.bgLight} source={require('../../../assets/drawables/ic_back.png')} style={[styles.icon]} />
                </TouchableOpacity>
                <Text style={[GlobalStyle.ManjariBold, styles.title]}>AI Image Prompts</Text>
                <TouchableOpacity onPress={toggleTab}>
                    <FontAwesome5 name="history" size={24} color={Colors.bgLight} />
                </TouchableOpacity>
            </View>
            {
                tab ? (
                    <View style={[{width: width}]}>
                        <View style={{width: width, flexDirection: 'row', justifyContent:'center'}}>
                            <EditText onChange={(e) => setQuery(e)} erase={false} style={{marginTop: 20}} icon={require('../../../assets/drawables/ic_search.png')} placeholder="Search.." />
                        </View>
                        { tfavoriteQueries.length === 0 && (
                            <View style={{width: width,  alignItems: 'center', justifyContent: 'center'}}>
                                <LottieView source={NoData} autoplay style={{width: width}} />
                            </View>
                        ) }
                        <ScrollView style={styles.msgContent} >
                            <View style={[GlobalStyle.row]}>
                                <View style={[{flexGrow:1, margin: 5, marginTop: -60}]}>
                                    { tfavoriteQueries.map((item, index, array) => index % 3 === 0 && (
                                        <TouchableOpacity key={index}
                                        onPress={() => onFullScreen(item, favorites[item]) }>
                                            <Image style={[styles.portrait]} source={{uri: `${favorites[item]}` }} /> 
                                        </TouchableOpacity>
                                    ) ) }
                                </View>
                                <View style={[{flexGrow:1, margin: 5, marginTop: 0}]}>
                                { tfavoriteQueries.map((item, index, array) => index % 3 === 1 && (
                                        <TouchableOpacity key={index} 
                                        onPress={() => onFullScreen(item, favorites[item]) }>
                                            <Image style={[styles.portrait]} source={{uri: `${favorites[item]}` }} /> 
                                        </TouchableOpacity>
                                    ) ) }
                                </View>
                                <View style={[{flexGrow:1, margin: 5, marginTop: -30}]}>
                                { tfavoriteQueries.map((item, index, array) => index % 3 === 2 && (
                                        <TouchableOpacity key={index} 
                                        onPress={() => onFullScreen(item, favorites[item]) }>
                                            <Image style={[styles.portrait]} source={{uri: `${favorites[item]}` }} /> 
                                        </TouchableOpacity>
                                    ) ) }
                                </View>
                            </View>
                        </ScrollView>
                    </View>                   
                ) : (
                    <View style={{width: width}}>
                        <View style={{width: width, flexDirection: 'row', justifyContent:'center'}}>
                            <Navbar query={category} data={categoryData} onChange={(e) => setCategory(e)} />
                        </View>
                        <Text style={[GlobalStyle.Manjari, styles.label]}>{category}</Text>
                        <ScrollView ref={_scrollView} style={[styles.msgContent, { height: height - height / 10 * 3.5 }]} >
                            {renderPrompts()}
                        </ScrollView>
                    </View>
                )
            }
            <Loading loading={refreshing} />
            <BottomNavigator onMagicShow={onMagicShow} active="PromptAI" navigation={props.navigation} />
            <View style={{width: width, height: height, position: refreshing ? 'absolute': 'relative', display: refreshing ? 'flex': 'none'}}></View>
        </View>
    )
}

export default PromptAI