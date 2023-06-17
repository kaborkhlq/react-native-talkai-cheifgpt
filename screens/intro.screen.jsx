import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Image } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useInterstitialAd } from 'react-native-google-mobile-ads';

import Config from '../redux/config';
import Button from '../components/button';
import GlobalStyle from '../assets/values/global.style';
import useColors from '../assets/values/colors';
const { width , height } = Dimensions.get('window');

const adUnit = Config.Interstitial.AdUnitID;
const requestOptions = {};

const IntroScreen = (props) => {
    const [Colors, GetColors] = useColors();
    const titles = [
        'Help with travel planning',
        'Help in choosing gifts',
        'Image generation and artistic processing',
    ];
    const descriptions = [
        'If you are planning a trip, TALK AI can help you with choosing a place, suggest attractions to visit, recommendations for booking hotels, etc.',
        'If you are looking for gift ideas for friends or loved ones, you can describe their interests and hobbies to TALK AI and it will offer you some gift options.',
        'TALK AI will help transform and improve your photos, as well as add a little artistic feature to the images',
    ];
    const buttonTitles = [
        'GREAT',
        "LET'S TRY",
        'SIGN UP'
    ];
    const _carousel = useRef(null);

    const { isLoaded, isClosed, load, show } = useInterstitialAd(adUnit, requestOptions)
    const [gone, setGone] = useState(false);

    const styles = new StyleSheet.create({
        skipButtonStyle: {
            marginRight: 20,
            marginBottom: 20,
            alignSelf: 'flex-end',
            marginTop: 20,
            backgroundColor: Colors.background
        },
        label: {
            color: Colors.bgLight,
            fontSize: 15,
            textAlign: 'right',
            fontFamily: 'Manjari',
            backgroundColor: Colors.background
        },
        tinyLabel: {
            color: Colors.secondaryText,
            fontSize: 12
        },
        footer: {
            width: '60%'
        },
        titleStyle: {
            color: Colors.mainGreen,
            fontSize: 25,
        },
        bannerImage: {
            width: '80%',
            resizeMode: 'contain',
            height: height / 2.5,
        },
        bannerDescription: {
            color: Colors.bgLight,
            fontSize: 18,
            width: '90%'
        },
        round: {
            width: 10,
            height: 10,
            borderRadius: 100,
            backgroundColor: Colors.input2,
            marginRight: 10,
        },
        green: {
            backgroundColor: '#23DB77'
        },
        
    });
    useEffect(() => { GetColors() }, [])
    useEffect(() => {
        // load();
    }, [load]);
    
    useEffect(() => {
        if (isClosed) {
            setGone(true);
            // props.navigation.replace('Introduction')
        }
    }, [isClosed]);

    useEffect(() => {
        if(isLoaded) {
            setTimeout(() => {
                if(!gone) show();
            }, 3000)
        }
    }, [isLoaded]);

    goNextStep = (index) => {
        if(index === 3) {
            props.navigation.replace('SignUp')
        } else {
            _carousel.current.snapToItem(index);
        }
    }

    _renderItem = ({item, index}) => {
        return (
            <View style={[{backgroundColor: Colors.background}, GlobalStyle.column, GlobalStyle.column_center, GlobalStyle.row_center, {height: '100%'}]}>
                <Text style={[GlobalStyle.Manjari, styles.titleStyle]}>{titles[index]}</Text>
                { index === 0 && (<Image style={[styles.bannerImage]} source={require(`../assets/drawables/intro1.png`)} />) }
                { index === 1 && (<Image style={[styles.bannerImage]} source={require(`../assets/drawables/intro2.png`)} />) }
                { index === 2 && (<Image style={[styles.bannerImage]} source={require(`../assets/drawables/intro3.png`)} />) }
                <View style={[GlobalStyle.row, GlobalStyle.row_center, GlobalStyle.column_center, { marginBottom: 20 }]}>
                    <View style={[styles.round, index === 0 && styles.green]}></View>
                    <View style={[styles.round, index === 1 && styles.green]}></View>
                    <View style={[styles.round, index === 2 && styles.green]}></View>
                </View>
                <Text style={[GlobalStyle.Manjari, styles.bannerDescription]}>{descriptions[index]}</Text>
                <Button title={buttonTitles[index]} width='90%' bgColor={Colors.mainGreen} titleColor={Colors.darkGreen} onPress={() => goNextStep(index + 1)} />
            </View>
        )
    }

    return (
        <View style={[{backgroundColor: Colors.background}, GlobalStyle.container, { paddingVertical: 10 }, GlobalStyle.column_center, GlobalStyle.row_space_around]}>
            <TouchableOpacity style={[styles.skipButtonStyle]} onPress={() => props.navigation.replace('SignIn')}>
                <Text style={[GlobalStyle.Manjari, styles.label]}>Skip</Text>
            </TouchableOpacity>

            <Carousel
                ref={_carousel}
                data={[0, 1, 2]}
                renderItem={_renderItem}
                sliderWidth={width}
                itemWidth={width}
            />

            <View style={[styles.footer, GlobalStyle.row, GlobalStyle.row_space_around, GlobalStyle.column_center]}>
                <Text style={[GlobalStyle.Manjari, styles.tinyLabel]}>Already have an account?</Text>
                <TouchableOpacity onPress={() => props.navigation.replace('SignIn')}>
                    <Text style={[GlobalStyle.Manjari, styles.tinyLabel, GlobalStyle.underline]}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default IntroScreen;