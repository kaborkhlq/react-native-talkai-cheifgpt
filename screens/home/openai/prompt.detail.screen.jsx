import {useState, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image, Dimensions, ScrollView, RefreshControl, ToastAndroid, PermissionsAndroid } from 'react-native';
import LottieView from 'lottie-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable'
import * as SecureStore from 'expo-secure-store';

import useLicenseModal from '../../../components/license.modal.jsx';
import Button from '../../../components/button.jsx'
import Loading from '../../../components/loading.jsx';
import { updateCredit } from '../../../redux/actions/auth.action';
import EditText from '../../../components/edittext';
import GlobalStyle from '../../../assets/values/global.style';
import useColors from '../../../assets/values/colors';
import { OpenAIPrompt, AddFavoritePrompt, OpenAIQueuedPrompt } from '../../../redux/actions/openai.action';
import blankImage from '../../../assets/drawables/prompt_template.png';
import BottomNavigator from '../../../components/bottom.navigator';
import Config from '../../../redux/config';
import useCustomerInfo from '../../../redux/useCustomerInfo';
const {width, height} = Dimensions.get('window');
import SelectDropdown from 'react-native-select-dropdown'
import Slider from '@react-native-community/slider';
import RNFetchBlob from 'rn-fetch-blob';
import MyImage from '../../../components/my.image.jsx'
import useTrackEvent from '../../../redux/useTrackEvent.jsx';

let settings = {
    prompt: "",
    negative_prompt: "",
    image_width: "512",
    image_height: "512",
    number_of_images: "1",
    num_inference_steps: "10",
    guidance_scale: 7.5,
    safety_checker: "yes",
    multi_lingual: "no",
    panorama: "no",
    self_attention: "no",
    upscale: "no"
};

const slideUp = {0: { bottom: -1 * height }, 1: {bottom: 0}};
const slideDown = {0: { bottom: 0 }, 1: {bottom: -1 * height}};

const PromptDetailScreen = (props) => {
    const [response, setTrack] = useTrackEvent();
    const [setPopup, LicenseModal] = useLicenseModal(props.navigation);
    const [customerInfo, getCustomerInfo] = useCustomerInfo();
    const [Colors, GetColors] = useColors()
    const _favorite = useRef(null);
    const [query, setQuery] = useState('');
    const [index, setIndex] = useState(0);
    const [images, setImages] = useState([
        // { prompt: 'balloon in the blue sky, flying birds0', url: "https://cdn.stablediffusionapi.com/generations/c1d008eb-103d-4507-a8fb-e8ef8454bb9d-0.png" },
        // { prompt: 'balloon in the blue sky, flying birds1', url: "https://cdn.stablediffusionapi.com/generations/c1d008eb-103d-4507-a8fb-e8ef8454bb9d-1.png" },
    ]);
    const dispatch = useDispatch();
    const [selected, setSelected] = useState([]);
    const [previewImage, setPreviewImage] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const AuthReducer = useSelector(state => state.AuthReducer);

    const [prompt, setPrompt] = useState('')
    const [negativePrompt, setNegativePrompt] = useState('')
    const [imgWidth, setImgWidth] = useState(512)
    const [imgHeight, setImageHeight] = useState(512)
    const [numberOfImages, setNumberOfImages] = useState(1)
    const [numberOfInferenceSteps, setNumberOfInferenceSteps] = useState(21)
    const [guidanceScale, setGuidanceScale] = useState(10);
    const [safetyChecker, setSafetyChecker] = useState(false);
    const [multiLingual, setMultiLingual] = useState(false);
    const [panorama, setPanorama] = useState(true);
    const [selfAttention, setSelfAttention] = useState(true);
    const [upScale, setUpScale] = useState(false)
    const [panelVisible, setPanelVisible] = useState(false);
    const _panel = useRef();

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
            height: width, 
            padding: 20, 
            backgroundColor: Colors.bgDark,
            marginTop: 20,
            position: 'relative'
        },
        toolPanel: {
            bottom: -1 * height, 
            position: 'absolute',
            width: width,
            height: height / 3 * 2,
            backgroundColor: Colors.toolBackground,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 20
        },
        line: {
            width: '100%',
            height: 1,
            borderStyle: 'solid',
            borderColor: Colors.bgLight,
            borderTopWidth: 1,
            marginTop: 10,
            marginBottom: 10,
        },
        containerStyle: {
            height: 40,
            backgroundColor:'transparent',
            borderRadius: 10, 
            borderStyle:'solid', 
            borderColor: Colors.bgLight, 
            borderWidth: 1, 
            width: '30%',
            paddingLeft: 10,
            paddingRight: 10,
            fontSize: 12, 
            color: Colors.bgLight
        },
        textStyle: {
            fontSize: 16, 
            color: Colors.bgLight
        },
        rowStyle: {backgroundColor: Colors.background, borderStyle: 'solid', borderBottomWidth: 1.5, borderColor: Colors.bgLight},

    });

    useEffect(() => { GetColors() }, [])

    useEffect(() => {
        const fetchData = async () => {
            if(props.route.params) {
                if(props.route.params.url) {
                    
                } else {
                    settings.prompt = props.route.params.query;
                    setPrompt(props.route.params.query)
                }
            }
            let timages = await SecureStore.getItemAsync('saved_images')
            if(timages !== null && timages !== undefined) {
                let t = JSON.parse(timages), t1;
                if(t.length > 5) t1 = t.slice(t.length - 6, t.length - 1)
                else t1 = t;
                setImages(t1)
                await SecureStore.setItemAsync('saved_images', JSON.stringify(t1))
            } else {
                onMagicShow()
            }
        }
        
        getCustomerInfo();
        fetchData();
        // setSelected(items => [ ...items, 1 ])
        // setIndex(1);
    }, [])

    useEffect(() => {
        const fectchData = async () =>{
            if(images.length > 0) {
                setPreviewImage({
                    prompt: images[images.length - 1].prompt,
                    url: images[images.length - 1].url
                })
                setIndex(images.length)
                await SecureStore.setItemAsync('saved_images', JSON.stringify(images));
            }
        }
        fectchData()
    }, [images])

    useEffect(() => {
        if(Object.keys(previewImage).length > 0) _favorite.current.reset()
    }, [previewImage])

    const generate = async (settings) => {
        setTrack('image_generation_started', AuthReducer.data)
        setRefreshing(true);
        let result = await OpenAIPrompt(settings);
        if(result.images.status === 'success') {
            for(let i = 0 ; i < result.images.output.length ; i++) {
                AddFavoritePrompt(AuthReducer.data.uid, `${result.images.meta.prompt}-${i}`, result.images.output[i]);
                setImages(images => [ ...images, {
                    prompt: `${result.images.meta.prompt}-${i}`,
                    url: result.images.output[i]
                }]);
            }
            _panel.current.animate(slideDown);
            setRefreshing(false);
        } else if(result.images.status === "processing") {
            let interval = setInterval((prompt) => {
                OpenAIQueuedPrompt(result.images.id).then(rresult => {
                    if(rresult.status === 'success') {
                        clearInterval(interval)
                        setRefreshing(false);
                        for(let i = 0 ; i < rresult.output.length ; i++) {
                            AddFavoritePrompt(AuthReducer.data.uid, `${prompt}-${i}`, rresult.output[i]);
                            setImages(images => [ ...images, {
                                prompt: `${prompt}-${i}`,
                                url: rresult.output[i]
                            }]);
                        }
                        _panel.current.animate(slideDown);
                    }
                }).catch(error => {
                    console.log(error)
                })
            }, 5000, settings.prompt)
        }
    }
    
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
        let image_URL = previewImage.url;
        let ext = getExtention(image_URL);
        ext = '.' + ext[0];
        const { config, fs } = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir;
        let options = {
            fileCache: true,
            addAndroidDownloads: { useDownloadManager: true, notification: true, path: PictureDir + `/${previewImage.prompt}` + ext, description: 'Image' },
        };
        config(options)
            .fetch('GET', image_URL)
            .then(res => {
                _favorite.current.play()
        });
    };
    const getExtention = filename => {
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
    };

    const onMagicShow = () => {
        setPanelVisible(e => !e)
        if(panelVisible) {
            _panel.current.animate(slideDown);
        } else {
            _panel.current.animate(slideUp);
        } 
    }

    const proceedGenerate = () => {
        if(prompt === '') {
            ToastAndroid.show('Please input Prompt!', ToastAndroid.SHORT)
        } else if(parseInt(imgWidth) > 1024 || parseInt(imgWidth) === 0) {
            ToastAndroid.show('Please input image width correctly!', ToastAndroid.SHORT)
        } else if(parseInt(imgHeight) > 1024 || parseInt(imgHeight) === 0) {
            ToastAndroid.show('Please input image height correctly!', ToastAndroid.SHORT)
        } else {
            settings = {
                prompt: `${prompt}`,
                negative_prompt: `${negativePrompt}`,
                image_width: `${imgWidth}`,
                image_height: `${imgHeight}`,
                number_of_images: `${numberOfImages}`,
                num_inference_steps: `${numberOfInferenceSteps}`,
                guidance_scale: `${guidanceScale}`,
                safety_checker: safetyChecker ? "yes" : "no",
                multi_lingual: multiLingual ? "yes" : "no",
                panorama: panorama ? "yes" : "no",
                self_attention: selfAttention ? "yes" : "no",
                upscale: upScale ? "yes" : "no",
            };
            generate(settings)
        }
    }
    
    const generateImage = () => {
        if(customerInfo !== null) {
            if(customerInfo.activeSubscriptions.length === 0) {
                if(AuthReducer.data.credit === 0) {
                    setPopup(true);
                } else if(AuthReducer.data.credit > 0) {
                    dispatch(updateCredit(AuthReducer.data.uid, AuthReducer.data.credit - 1))
                    proceedGenerate()
                } else {
                    proceedGenerate()
                }
            }
        }
    }

    const onFullScreen = (item, uri) => {
        props.navigation.push('ImageView', { prompt: item, uri: uri })
    }


    return (
        <View style={[{backgroundColor: Colors.background}, GlobalStyle.container, GlobalStyle.column_center]}>
            <View style={[GlobalStyle.row, { justifyContent: 'space-between', alignItems: 'center', width: '90%', paddingLeft: 10, paddingRight: 10 }]}>
                <TouchableOpacity onPress={() => props.navigation.pop()}>
                    <Image tintColor={Colors.bgLight} source={require('../../../assets/drawables/ic_back.png')} style={[styles.icon]} />
                </TouchableOpacity>
                <Text style={[GlobalStyle.ManjariBold, styles.title]}>Talk AI Prompts</Text>
                <View style={[GlobalStyle.row, GlobalStyle.column_center, GlobalStyle.row_center]}>
                    <FontAwesome5 style={{marginRight: 10}} name="coins" size={24} color={Colors.bgLight} />
                    <Text style={[GlobalStyle.ManjariBold, styles.title]}>{AuthReducer.data.credit}</Text>
                </View>
            </View>
            <View style={[GlobalStyle.row_center, GlobalStyle.column_center, styles.preview]}>
                { Object.keys(previewImage).length > 0 && (
                    <TouchableOpacity onPress={() => onFullScreen(previewImage.prompt, previewImage.uri)}>
                        <Image style={{ width: width / 1.1, height: width / 1.1, resizeMode: 'stretch', borderRadius: 10 }} source={{ uri: previewImage.url }} />
                    </TouchableOpacity>
                ) }
                { Object.keys(previewImage).length > 0 && (
                    <TouchableOpacity onPress={handleDownload} style={{justifyContent: 'center', alignItems:'center', width: 50, height: 50, overflow: 'hidden', position: 'absolute', top: 10, right: 10, backgroundColor: Colors.bgLight, borderRadius: 100}}>
                        <LottieView
                            ref={_favorite}
                            style={{width: 80, borderRadius: 100, backgroundColor: Colors.bgDark }}
                            source={require('../../../assets/82387-download.json')}
                            loop={false}
                            autoPlay={false}
                        />
                    </TouchableOpacity>
                ) }
                <Text>{}</Text>
            </View>
            <View style={[GlobalStyle.row, GlobalStyle.row_center, GlobalStyle.column_center, { marginBottom: 20, marginTop: 20 }]}>
                { images.map((item, key, array) => <View key={key} style={[styles.round, key === index - 1 && styles.green]}></View>) }
            </View>
            <ScrollView horizontal={true} style={[styles.scrollContainer]} >
            {
                images.map((item, key, array) => 
                    <TouchableOpacity key={key} onPress={() => { setIndex(key + 1); setPreviewImage({prompt: item.prompt, url: item.url})} }>
                        <MyImage style={styles.scrollItem} uri={item.url} />
                        {/* <Image style={[styles.scrollItem]} source={{uri: item.url}} /> */}
                    </TouchableOpacity>
                )
            }
            </ScrollView>
            <BottomNavigator onMagicShow={onMagicShow} active="PromptAI" navigation={props.navigation} />
            <Animatable.View ref={_panel} easing="ease-in-out" style={[styles.toolPanel]} duration={1000}>
                <View style={[GlobalStyle.row, {justifyContent: 'flex-end', width: '100%'}]}>
                    <TouchableOpacity onPress={onMagicShow}>
                        <AntDesign name="close" size={24} color={Colors.bgLight} />
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 18}]}>Prompt</Text>
                    <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 14}]}>Text prompt with description of the things you want in the image to be generated.</Text>
                    <EditText textStyle={{fontSize: 12}} value={prompt} onChange={(e) => setPrompt(e)} erase={false} style={{marginTop: 10, width: '100%'}}  placeholder="Enter Your Prompt" />
                    <View style={[styles.line]}></View>

                    <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 18}]}>Negative Prompt</Text>
                    <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 14}]}>Items you don't want in the image.</Text>
                    <EditText textStyle={{fontSize: 12}} value={negativePrompt} onChange={(e) => setNegativePrompt(e)} erase={false} style={{marginTop: 10, width: '100%'}}  placeholder="Enter Your Negative Prompt" />
                    <View style={[styles.line]}></View>

                    <View style={[GlobalStyle.row, {justifyContent: 'space-between'}, GlobalStyle.column_center]}>
                        <View style={{width: '70%'}}>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 18}]}>Width</Text>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 14}]}>Max Width: 1024x1024.</Text>
                        </View>
                        <SelectDropdown
                            data={[256, 512, 1024]}
                            onSelect={(selectedItem, index) => { setImgWidth(selectedItem) }}
                            defaultValue={256}
                            buttonStyle={[styles.containerStyle]}
                            rowStyle={[styles.rowStyle]}
                            rowTextStyle={[GlobalStyle.Manjari, styles.textStyle]}
                            buttonTextStyle={[GlobalStyle.Manjari, styles.textStyle]}
                            renderDropdownIcon={() => (<AntDesign name="down" size={12} color={Colors.bgLight} />)}
                            dropdownIconPosition="right"
                        />
                    </View>
                    {/* <EditText inputMode="Number" textStyle={{fontSize: 12}} value={imgWidth} onChange={(e) => setImgWidth(e)} erase={false} style={{marginTop: 10, width: '100%'}}  placeholder="Enter Your Image Width" /> */}
                    <View style={[styles.line]}></View>                   

                    <View style={[GlobalStyle.row, {justifyContent: 'space-between'}, GlobalStyle.column_center]}>
                        <View style={{width: '70%'}}>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 18}]}>Height</Text>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 14}]}>Max Height: 1024x1024.</Text>
                        </View>
                        <SelectDropdown
                            data={[256, 512, 1024]}
                            onSelect={(selectedItem, index) => { setImageHeight(selectedItem) }}
                            defaultValue={256}
                            buttonStyle={[styles.containerStyle]}
                            rowStyle={[styles.rowStyle]}
                            rowTextStyle={[GlobalStyle.Manjari, styles.textStyle]}
                            buttonTextStyle={[GlobalStyle.Manjari, styles.textStyle]}
                            renderDropdownIcon={() => (<AntDesign name="down" size={12} color={Colors.bgLight} />)}
                            dropdownIconPosition="right"
                        />
                    {/* <EditText inputMode="Number" textStyle={{fontSize: 12}} value={imgHeight} onChange={(e) => setImageHeight(e)} erase={false} style={{marginTop: 10, width: '100%'}}  placeholder="Enter Your Image Height" /> */}
                    </View>
                    <View style={[styles.line]}></View>

                    <View style={[GlobalStyle.row, {justifyContent: 'space-between'}, GlobalStyle.column_center]}>
                        <View style={{width: '70%'}}>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 18}]}>Number Of Images</Text>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 14}]}>The maximum value is 4.</Text>
                        </View>
                        <SelectDropdown
                            data={[1,2,3,4]}
                            onSelect={(selectedItem, index) => { setNumberOfImages(selectedItem) }}
                            defaultValue={1}
                            buttonStyle={[styles.containerStyle]}
                            rowStyle={[styles.rowStyle]}
                            rowTextStyle={[GlobalStyle.Manjari, styles.textStyle]}
                            buttonTextStyle={[GlobalStyle.Manjari, styles.textStyle]}
                            renderDropdownIcon={() => (<AntDesign name="down" size={12} color={Colors.bgLight} />)}
                            dropdownIconPosition="right"
                        />
                    </View>
                    <View style={[styles.line]}></View>

                    <View style={[GlobalStyle.row, {justifyContent: 'space-between'}, GlobalStyle.column_center]}>
                        <View style={{width: '70%'}}>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 18}]}>Number Of Inference Steps</Text>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 14}]}>Number of denoising steps. Available values: 21, 31, 41, 51.</Text>
                        </View>
                        <SelectDropdown
                            data={[21,31,41,51]}
                            onSelect={(selectedItem, index) => { setNumberOfInferenceSteps(selectedItem) }}
                            defaultValue={21}
                            buttonStyle={[styles.containerStyle]}
                            rowStyle={[styles.rowStyle]}
                            rowTextStyle={[GlobalStyle.Manjari, styles.textStyle]}
                            buttonTextStyle={[GlobalStyle.Manjari, styles.textStyle]}
                            renderDropdownIcon={() => (<AntDesign name="down" size={12} color={Colors.bgLight} />)}
                            dropdownIconPosition="right"
                        />
                    </View>
                    <View style={[styles.line]}></View>

                    <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 18}]}>Guidance Scale</Text>
                    <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 14}]}>Scale for classifier-free guidance (minimum: 1; maximum: 20).</Text>
                    <Slider
                        style={{width: '100%', height: 40}}
                        minimumValue={1}
                        onValueChange={(e) => setGuidanceScale(e)}
                        maximumValue={20}
                        minimumTrackTintColor={Colors.bgLight}
                        maximumTrackTintColor={Colors.bgLight}
                    />
                    <View style={[styles.line]}></View>

                    <View style={[GlobalStyle.row, {justifyContent: 'space-between'}, GlobalStyle.column_center]}>
                        <View style={{width: '80%'}}>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 18}]}>Safety Checker</Text>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 14}]}>A checker for NSFW images. If such an image is detected, it will be replaced by a blank image.</Text>
                        </View>
                        <Switch onValueChange={(e) => setSafetyChecker(e)} value={safetyChecker} />
                    </View>
                    <View style={[styles.line]}></View>

                    <View style={[GlobalStyle.row, {justifyContent: 'space-between'}, GlobalStyle.column_center]}>
                        <View style={{width: '80%'}}>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 18}]}>Multi Lingual</Text>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 14}]}>Allow multi lingual prompt to generate images. Use "no" for the default English.</Text>
                        </View>
                        <Switch onValueChange={(e) => setMultiLingual(e)} value={multiLingual} />
                    </View>
                    <View style={[styles.line]}></View>

                    <View style={[GlobalStyle.row, {justifyContent: 'space-between'}, GlobalStyle.column_center]}>
                        <View style={{width: '80%'}}>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 18}]}>Panorama</Text>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 14}]}>Set this parameter to "yes" to generate a panorama image.</Text>
                        </View>
                        <Switch onValueChange={(e) => setPanorama(e)} value={panorama} />
                    </View>
                    <View style={[styles.line]}></View>

                    <View style={[GlobalStyle.row, {justifyContent: 'space-between'}, GlobalStyle.column_center]}>
                        <View style={{width: '80%'}}>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 18}]}>Self Attention</Text>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 14}]}>If you want a high quality image, set this parameter to "yes". In this case the image generation will take more time.</Text>
                        </View>
                        <Switch onValueChange={(e) => setSelfAttention(e)} value={selfAttention} />
                    </View>
                    <View style={[styles.line]}></View>

                    <View style={[GlobalStyle.row, {justifyContent: 'space-between'}, GlobalStyle.column_center]}>
                        <View style={{width: '80%'}}>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 18}]}>Upscale</Text>
                            <Text style={[GlobalStyle.Manjari, {color: Colors.bgLight, fontSize: 14}]}>Set this parameter to "yes" if you want to upscale the given image resolution two times (2x). If the requested resolution is 512 x 512 px, the generated image will be 1024 x 1024 px.</Text>
                        </View>
                        <Switch onValueChange={(e) => setUpScale(e)} value={upScale} />
                    </View>    
                </ScrollView>
                <Button onPress={generateImage} title="GENERATE IMAGES" marginTop={10} width='100%' bgColor={Colors.mainGreen} titleColor={Colors.darkGreen} />
            </Animatable.View>
            <Loading loading={refreshing} />
            {LicenseModal}
        </View>
    )
}

export default PromptDetailScreen;