import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, RefreshControl} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';


import Navbar from '../../../components/navbar';
import Button from '../../../components/button';
import useColors from '../../../assets/values/colors';
import GlobalStyle from '../../../assets/values/global.style';
import Loading from '../../../components/loading';
import BottomNavigator from '../../../components/bottom.navigator';

import EditText from '../../../components/edittext'
import { OpenAIPrompt, GetImagePrompt, OpenAIQueuedPrompt, GetFavouritesPrompt } from '../../../redux/actions/openai.action';
const {width, height} = Dimensions.get('window');
import blankImage from '../../../assets/drawables/prompt_template.png';

const PromptAI = (props) => {
    const [Colors, GetColors] = useColors();
    const _scrollView = useRef(null);
    const [refreshing, setRefreshing] = useState(false);
    const [category, setCategory] = useState('');
    const [prompt, setPrompt] = useState(null);
    const [tab, setTab] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [query, setQuery] = useState('');

    const [favorites, setFavorites] = useState([]);
    const [favoriteQueries, setFavoriteQueries] = useState([]);

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
            padding: 10, 
            backgroundColor: Colors.bgDark, 
            marginLeft: 10, 
            marginBottom: 10, 
            marginRight: 10, 
            paddingTop: 20, 
            paddingBottom: 20, 
            borderRadius: 20,
        },
        text: { 
            color: Colors.bgLight, 
            fontSize: 20, 
            fontWeight: 400,
            textAlign: 'center'
        }
    });

    useEffect(() => {
        GetColors();
        GetImagePrompt().then(result => {
            setPrompt(result._data);
            setCategoryData(Object.keys(result._data)); 
        }).catch(error => {
            console.log(error);
        });

        onRefresh();
    }, []);

    useEffect(() => {
        if(category !== '') _scrollView.current.scrollTo({ x: 0, y: 0, animated: true })
    }, [category]);

    const onRefresh = () => {
        setRefreshing(true);
        GetFavouritesPrompt(AuthReducer.data.uid).then(result => {
            if(result._data !== undefined && result._data !== null) {
                setFavorites(result._data);
                setFavoriteQueries(Object.keys(result._data));
            }
            setRefreshing(false);
        }).catch(error => {
            console.log(error);
        });
    }
    const toggleTab = () => { setRefreshing(false); setTab(!tab); }

    const goToDetailPage = (query, url) => {
        props.navigation.replace('PromptAIDetail', {
            query: query,
            url: url
        })
    }


    return (
        <View style={[{backgroundColor: Colors.background}, GlobalStyle.container, styles.container, GlobalStyle.column_center]}>
            <View style={[GlobalStyle.row, { justifyContent: 'space-between', alignItems: 'center', width: '90%' }]}>
                <TouchableOpacity onPress={() => props.navigation.replace('Home')}>
                    <Image tintColor={Colors.bgLight} source={require('../../../assets/drawables/ic_back.png')} style={[styles.icon]} />
                </TouchableOpacity>
                <Text style={[GlobalStyle.ManjariBold, styles.title]}>Talk AI Prompts</Text>
                <TouchableOpacity onPress={toggleTab}>
                    <Image source={require('../../../assets/drawables/ic_prompt.png')} tintColor={Colors.bgLight} style={[styles.icon]} />
                </TouchableOpacity>
            </View>
            {
                !tab ? (
                    <View style={{width: width}}>
                        <View style={{width: width, flexDirection: 'row', justifyContent:'center'}}>
                            <EditText onChange={(e) => setQuery(e)} searchSubmit={() => goToDetailPage(query, '')} erase={false} style={{marginTop: 20}} icon={require('../../../assets/drawables/ic_search.png')} placeholder="Search.." />
                        </View>
                        <ScrollView style={styles.msgContent} 
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }>
                            <View style={[GlobalStyle.row]}>
                                <View style={[{flexGrow:1, margin: 5, marginTop: -60}]}>
                                    { favoriteQueries.map((item, index, array) => index % 3 === 0 && (
                                        <TouchableOpacity key={index}
                                        onPress={() => goToDetailPage(item, favorites[item]) }>
                                            <Image style={[styles.portrait]} source={{uri: `${favorites[item]}` }} /> 
                                        </TouchableOpacity>
                                    ) ) }
                                </View>
                                <View style={[{flexGrow:1, margin: 5, marginTop: 0}]}>
                                { favoriteQueries.map((item, index, array) => index % 3 === 1 && (
                                        <TouchableOpacity key={index} 
                                        onPress={() => goToDetailPage(item, favorites[item]) }>
                                            <Image style={[styles.portrait]} source={{uri: `${favorites[item]}` }} /> 
                                        </TouchableOpacity>
                                    ) ) }
                                </View>
                                <View style={[{flexGrow:1, margin: 5, marginTop: -30}]}>
                                { favoriteQueries.map((item, index, array) => index % 3 === 2 && (
                                        <TouchableOpacity key={index} 
                                        onPress={() => goToDetailPage(item, favorites[item]) }>
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
                            {
                                prompt !== null && category !== '' && prompt[category].map((item, index, array) =>
                                    <TouchableOpacity key={index} style={[styles.textContainer, GlobalStyle.column_center]} 
                                    onPress={() => goToDetailPage(item, '') }>
                                        <Text style={[GlobalStyle.Manjari, styles.text]}>{item}</Text>       
                                    </TouchableOpacity>
                                )
                            }
                        </ScrollView>
                    </View>
                )
            }   
            <BottomNavigator active="PromptAI" navigation={props.navigation} />
            <View style={{width: width, height: height, position: refreshing ? 'absolute': 'relative', display: refreshing ? 'flex': 'none'}}></View>
        </View>
    )
}

export default PromptAI