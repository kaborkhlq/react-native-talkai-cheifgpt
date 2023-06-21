import React, { useEffect, useState } from 'react';
import { Platform, Text, View, Dimensions, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import LottieView from 'lottie-react-native'
import Purchases from 'react-native-purchases';
const {width, height} = Dimensions.get('window');

import Config from '../../redux/config';
import Button from '../../components/button';
import GlobalStyle from '../../assets/values/global.style';
import useColors from '../../assets/values/colors';
import Loading from '../../components/loading';
import useTrackEvent from '../../redux/useTrackEvent';

const APIKeys = {
    apple: Config.RevenueCat_API_KEY.apple,
    google: Config.RevenueCat_API_KEY.google
};

const LicenseScreen = ({navigation}) => {
    const [Colors, GetColors] = useColors()
    const [response, setTrack] = useTrackEvent();
    const [currentOffering, setCurrentOffering] = useState(null);
    const [annualPackage, setAnnualPackage] = useState(null);
    const [monthlyPackage, setMonthlyPackage] = useState(null);
    const [weeklyPackage, setWeeklyPackage] = useState(null);
    const [activePackage, setActivePackage] = useState('ANNUAL')
    const [loading, setLoading] = useState(true);
    const Styles = new StyleSheet.create({
        title: {
            marginTop: 10,
            fontSize: 25,
            color: '#23DB77',
            marginBottom: 5,
        },
        label: {
            color: Colors.bgLight,
            fontSize: 16,
        },
        text: {
            color: Colors.bgLight,
            fontSize: 12,
            paddingBottom: 3,
        },
        radio: {
            width: 15,
            height: 15,
            marginRight: 20
        },
        card: {
            borderRadius: 20,
            backgroundColor: Colors.bgDark,
            paddingTop: 15,
            paddingLeft: 10,
            paddingRight: 10,
            width: '30%',
            borderStyle: 'solid',
            borderWidth: 3,
            borderColor: Colors.bgDark
        },
        divider: {
            width: '90%',
            backgroundColor: Colors.bgLight,
            height: 1,
            marginBottom: 5
        },
        activeCard: {
            borderColor: '#23DB77',
            position: 'relative'
        },
        activeText: {
            backgroundColor: '#23DB77',
            borderRadius: 20,
            color: Colors.darkGreen,
            position: 'absolute',
            width: '90%',
            textAlign: 'center',
            textAlignVertical: 'center',
            top: -15,
            paddingTop: 3,
            paddingBottom: 3
        }
    })

    useEffect(() => {
        GetColors()
        const fetchData = async () => {
            Purchases.setDebugLogsEnabled(true);
            if (Platform.OS == "android") {
                await Purchases.configure({ apiKey: APIKeys.google });
            } else {
                await Purchases.configure({ apiKey: APIKeys.apple });
            }

            const offerings = await Purchases.getOfferings();
            setAnnualPackage(offerings.current.availablePackages.filter((item, index, array) => item.packageType === 'ANNUAL')[0]);
            setMonthlyPackage(offerings.current.availablePackages.filter((item, index, array) => item.packageType === "MONTHLY")[0]);
            setWeeklyPackage(offerings.current.availablePackages.filter((item, index, array) => item.packageType === "WEEKLY")[0]);
            setCurrentOffering(offerings.current); 
            setLoading(false);     
        };

        fetchData().catch(console.log);
    }, []);

    const onSelection = () => {
        let purchasePackage;
        if(activePackage === 'ANNUAL') purchasePackage = annualPackage
        if(activePackage === 'MONTHLY') purchasePackage = monthlyPackage
        if(activePackage === 'WEEKLY') purchasePackage = weeklyPackage

        Purchases.purchasePackage(purchasePackage).then(purchaserInfo => {
            if(activePackage === 'ANNUAL') setTrack('annual_subscription_purchased', {
                currencyCode : annualPackage.product.currencyCode,
                price: annualPackage.product.price
            })
            if(activePackage === 'MONTHLY') setTrack('month_subcription_purchased', {
                currencyCode : monthlyPackage.product.currencyCode,
                price: monthlyPackage.product.price
            })
            if(activePackage === 'WEEKLY') setTrack('weekly_subscription_purchased', {
                currencyCode : weeklyPackage.product.currencyCode,
                price: weeklyPackage.product.price
            })

            navigation.replace('Home')
        })
    };


    return (
        <View style={[{backgroundColor: Colors.background}, GlobalStyle.container, { paddingVertical: 10 }, GlobalStyle.column_center, GlobalStyle.row_space_around]}>
            
            <View style={{width: width, height: width * 0.5, overflow: 'hidden', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <LottieView style={{width: width * 0.6, height: width * 0.6 }} autoPlay loop source={require('../../assets/robot.json')} />
            </View>

            <TouchableOpacity style={{position: 'absolute', top: 10, right: 10}} onPress={() => navigation.replace('Home')}>
                <Image style={{ width: 30, height: 30 }} source={require('../../assets/drawables/ic_close.png')} />
            </TouchableOpacity>

            <Text style={[GlobalStyle.ManjariBold, Styles.title]}>Unlock Unlimited Access</Text>
            <View style={{width: '90%'}}>
                <View style={[GlobalStyle.row, GlobalStyle.column_center]}>
                    <Image source={require('../../assets/drawables/radio.png')} style={[Styles.radio]} />
                    <Text style={[GlobalStyle.Manjari, Styles.label]}>No ads</Text>
                </View>
                <View style={[GlobalStyle.row, GlobalStyle.column_center]}>
                    <Image source={require('../../assets/drawables/radio.png')} style={[Styles.radio]} />
                    <Text style={[GlobalStyle.Manjari, Styles.label]}>Unlimited usages</Text>
                </View>
                <View style={[GlobalStyle.row, GlobalStyle.column_center]}>
                    <Image source={require('../../assets/drawables/radio.png')} style={[Styles.radio]} />
                    <Text style={[GlobalStyle.Manjari, Styles.label]}>Access to the latest GPT-4 engine</Text>
                </View>
                <View style={[GlobalStyle.row, GlobalStyle.column_center]}>
                    <Image source={require('../../assets/drawables/radio.png')} style={[Styles.radio]} />
                    <Text style={[GlobalStyle.Manjari, Styles.label]}>Extended prompt library access</Text>
                </View>
                <View style={[GlobalStyle.row, GlobalStyle.column_center]}>
                    <Image source={require('../../assets/drawables/radio.png')} style={[Styles.radio]} />
                    <Text style={[GlobalStyle.Manjari, Styles.label]}>Trained Image generation models</Text>
                </View>
                <View style={[GlobalStyle.row, GlobalStyle.column_center]}>
                    <Image source={require('../../assets/drawables/radio.png')} style={[Styles.radio]} />
                    <Text style={[GlobalStyle.Manjari, Styles.label]}>Type faster & longer dialogues</Text>
                </View>
            </View>
            <Text style={[GlobalStyle.ManjariBold, Styles.title]}>Select your subscription plan</Text>
            <View style={[{width: '99%', marginTop: 10}, GlobalStyle.row, GlobalStyle.row_space_around]}>
                <TouchableOpacity style={[Styles.card, GlobalStyle.column_center, activePackage === 'MONTHLY' && Styles.activeCard, GlobalStyle.row_space_around]} onPress={() => setActivePackage('MONTHLY')}>
                    <Text style={[GlobalStyle.Manjari, Styles.text]}>1 MONTH</Text>
                    <Text style={[GlobalStyle.Manjari, Styles.text]}>LICENSE</Text>
                    {
                        monthlyPackage === null ? (<Text style={[GlobalStyle.Manjari, Styles.text]}>.../month</Text>) :
                        (<Text style={[GlobalStyle.Manjari, Styles.text]}>{monthlyPackage.product.currencyCode} {monthlyPackage.product.price}/month</Text>)
                    }

                    <View style={[GlobalStyle.Manjari, Styles.divider]}></View>
                    {
                        monthlyPackage === null ? (<Text style={[GlobalStyle.Manjari, Styles.text]}>.../day</Text>) :
                        (<Text style={[GlobalStyle.Manjari, Styles.text]}>{monthlyPackage.product.currencyCode} {parseFloat(monthlyPackage.product.price/28).toFixed(2)}/day</Text>)
                    }
                </TouchableOpacity>

                <TouchableOpacity style={[Styles.card, GlobalStyle.column_center, activePackage === 'ANNUAL' && Styles.activeCard, GlobalStyle.row_space_around]} onPress={() => setActivePackage('ANNUAL')}>
                    <Text style={[GlobalStyle.Manjari, Styles.text]}>3 DAYS</Text>
                    <Text style={[GlobalStyle.Manjari, Styles.text]}>FREE TRIAL</Text>
                    {
                        annualPackage === null ? (<Text style={[GlobalStyle.Manjari, Styles.text]}>.../year</Text>) :
                        (<Text style={[GlobalStyle.Manjari, Styles.text]}>{annualPackage.product.currencyCode} {annualPackage.product.price}/year</Text>)
                    }
                    <Text style={[GlobalStyle.Manjari, Styles.text, { fontSize: 11 }]}>after free trial</Text>
                    <View style={[GlobalStyle.Manjari, Styles.divider]}></View>
                    {
                        annualPackage === null ? (<Text style={[GlobalStyle.Manjari, Styles.text]}>.../day</Text>) :
                        (<Text style={[GlobalStyle.Manjari, Styles.text]}>{annualPackage.product.currencyCode} {parseFloat(annualPackage.product.price / 350).toFixed(2)}/day</Text>)
                    }
                    <Text style={[GlobalStyle.Manjari, Styles.text, Styles.activeText]}>POPULAR</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[Styles.card, GlobalStyle.column_center, activePackage === 'WEEKLY' && Styles.activeCard,GlobalStyle.row_space_around]} onPress={() => setActivePackage('WEEKLY')}>
                    <Text style={[GlobalStyle.Manjari, Styles.text]}>1 WEEK</Text>
                    <Text style={[GlobalStyle.Manjari, Styles.text]}>LICENSE</Text>
                    {
                        weeklyPackage === null ? (<Text style={[GlobalStyle.Manjari, Styles.text]}>.../week</Text>) :
                        (<Text style={[GlobalStyle.Manjari, Styles.text]}>{weeklyPackage.product.currencyCode} {weeklyPackage.product.price}/week</Text>)
                    }

                    <View style={[GlobalStyle.Manjari, Styles.divider]}></View>
                    {
                        weeklyPackage === null ? (<Text style={[GlobalStyle.Manjari, Styles.text]}>.../day</Text>) :
                        (<Text style={[GlobalStyle.Manjari, Styles.text]}>{weeklyPackage.product.currencyCode} {parseFloat(weeklyPackage.product.price / 6).toFixed(2)}/day</Text>)
                    }
                </TouchableOpacity>
            </View>
            <Text style={[GlobalStyle.Manjari, {color: Colors.secondaryText, fontSize: 12, marginTop: 10, marginBottom: 10 }]}>No worries, you can cancel any time under the tariffs</Text>
            <Button onPress={() => onSelection()} title="CONTINUE" marginTop={10} width='90%' bgColor={Colors.mainGreen} titleColor={Colors.darkGreen} />
            <Loading loading={loading} />
        </View>
    )
}

export default LicenseScreen