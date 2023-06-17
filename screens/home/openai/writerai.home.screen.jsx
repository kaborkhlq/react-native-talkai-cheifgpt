import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, RefreshControl, _ScrollView} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Navbar from '../../../components/navbar';
import useColors from '../../../assets/values/colors';
import GlobalStyle from '../../../assets/values/global.style';
import Loading from '../../../components/loading';
import BottomNavigator from '../../../components/bottom.navigator';

import { GetWriterPrompt } from '../../../redux/actions/openai.action';
const {width, height} = Dimensions.get('window');

const WriterAIHome = (props) => {
    const _scrollView = useRef(null);
    const [Colors, GetColors] = useColors();
    const [refreshing, setRefreshing] = useState(false);
    const [category, setCategory] = useState('');
    const [prompt, setPrompt] = useState(null);
    const [categoryData, setCategoryData] = useState([]);

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
        setRefreshing(true);
        GetWriterPrompt().then(result => {
            setPrompt(result._data);
            setCategoryData(Object.keys(result._data));
        })

        return () => {
            setPrompt(null);
            setCategoryData([]);
        }
    }, []);

    useEffect(() => {
        console.log(prompt, category);
        if(categoryData.length !== 0) {
            setCategory(categoryData[0]);
            setRefreshing(false);
        }
    }, [categoryData])

    useEffect(() => {
        if(category !== '') _scrollView.current.scrollTo({ x: 0, y: 0, animated: true })
    }, [category]);

    return (
        <View style={[{backgroundColor: Colors.background}, GlobalStyle.container, styles.container, GlobalStyle.column_center]}>
            <View style={[GlobalStyle.row, { justifyContent: 'space-between', alignItems: 'center', width: '90%' }]}>
                <TouchableOpacity onPress={() => props.navigation.replace('Home')}>
                    <Image tintColor={Colors.bgLight} source={require('../../../assets/drawables/ic_back.png')} style={[styles.icon]} />
                </TouchableOpacity>
                <Text style={[GlobalStyle.ManjariBold, styles.title]}>Talk AI Prompts</Text>
                <View></View>
            </View>
            <View style={{width: width}}>
                <View style={{width: width, flexDirection: 'row', justifyContent:'center'}}>
                    <Navbar query={category} data={categoryData} onChange={(e) => setCategory(e)} />
                </View>
                <Text style={[GlobalStyle.ManjariBold, styles.label]}>{category}</Text>
                <ScrollView ref={_scrollView} style={[styles.msgContent]} >
                    {
                        prompt !== null && category !== '' && prompt[category].map((item, index, array) =>
                            <TouchableOpacity key={index} style={[styles.textContainer, GlobalStyle.column_center]} 
                            onPress={() => props.navigation.push('WriterAI', { prompt: prompt, categoryData: categoryData, category: category, query: item })}>
                                <Text style={[GlobalStyle.ManjariBold, styles.text]}>{item}</Text>       
                            </TouchableOpacity>
                        )
                    }
                </ScrollView>
            </View>
            <Loading loading={refreshing} />
            <BottomNavigator active="WriterAIHome" navigation={props.navigation} />
        </View>
    )
}

export default WriterAIHome