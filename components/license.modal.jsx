import { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { useRewardedAd } from 'react-native-google-mobile-ads';
import Loading from './loading';
import LottieView from 'lottie-react-native';
import Dialog, { DialogTitle, DialogContent, SlideAnimation } from 'react-native-popup-dialog';

import { updateCredit } from '../redux/actions/auth.action';
import GlobalStyle from '../assets/values/global.style';
import Config from '../redux/config';
import jellyLoading from '../assets/jelly-loading.json'
import { useDispatch, useSelector } from 'react-redux';

const adUnit = Config.Rewarded.AdUnitID;
const requestOptions = {};

const useLicenseModal = (navigation) => {
  const [slideAnimationDialog, setSlideAnimationDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isLoaded, isClosed, load, show, isEarnedReward, reward } = useRewardedAd(adUnit, requestOptions)
  const dispatch = useDispatch();
  const Auth = useSelector(state => state.AuthReducer)

  useEffect(() => {
    if(isEarnedReward) {
      setLoading(false);
      setSlideAnimationDialog(false)
      dispatch(updateCredit(Auth.data.uid, Auth.data.credit + 1))
    }
  }, [isEarnedReward])

  useEffect(() => {
    if(isLoaded) show();
  }, [isLoaded])

  const onOpenAds = () => {
    load();
    setLoading(true);
  }
  const onGoLicense = () => {
    setSlideAnimationDialog(false)
    navigation.push('License');
  }

  return [setSlideAnimationDialog, (
    <Dialog onDismiss={() => {!loading && setSlideAnimationDialog(false);}}
      onTouchOutside={() => {!loading && setSlideAnimationDialog(false);}}
      visible={slideAnimationDialog}
      dialogStyle={[styles.container]}
      dialogTitle={<DialogTitle textStyle={[GlobalStyle.ManjariBold, styles.title]} title="Ran out of credits" />}
      dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}>
      <DialogContent style={[GlobalStyle.column_center]}>
        <Text style={[GlobalStyle.ManjariBold, styles.label]}>Go to Talk AI Premium to have unlimited number of generations, NO Ads and other benefits</Text>
        <View style={[GlobalStyle.row, GlobalStyle.row_space_around, GlobalStyle.column_center]}>
          <View style={[styles.line]}></View>
          <Text style={[GlobalStyle.Manjari, styles.label, {marginHorizontal: 20,}]}>or</Text>
          <View style={[styles.line]}></View>
        </View>
        <Text style={[GlobalStyle.ManjariBold, styles.label]}>Watch and Ad right now to gain 1 credit</Text>
        <TouchableOpacity onPress={() => onGoLicense()} style={[styles.button, GlobalStyle.row, GlobalStyle.column_center]}>
          <FontAwesome5 name="crown" size={24} color="yellow" />
          <Text style={[GlobalStyle.ManjariBold, {marginLeft: 20, paddingTop: 5, color: 'white', fontSize: 20}]}>GET TALK AI PREMIUM</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onOpenAds()} style={[GlobalStyle.row, GlobalStyle.column_center, styles.button, {backgroundColor: 'white'}]}>
          <Text style={[GlobalStyle.ManjariBold, {fontSize: 20, paddingTop: 5}]}>Continue with Ads</Text>
          {
            loading && (<LottieView
              autoPlay
              style={{width: 50 }}
              source={jellyLoading}
          />)
          }
        </TouchableOpacity>
      </DialogContent>
    </Dialog>
  )];
};
export default useLicenseModal;
  
const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    width: '90%',
    alignItems: 'center'
  },
  buttonStyle: {
    minWidth: '100%',
    padding: 10,
    backgroundColor: '#f5821f',
    margin: 15,
  },
  buttonTextStyle: {
    color: 'white',
    textAlign: 'center',
  },
  titleStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 25
  },
  label: {
    fontSize: 18
  },
  line: {
    borderStyle: 'solid',
    borderColor: 'black',
    borderTopWidth: 1,
    width: '40%'
  },
  button: {
    width: '100%',
    borderRadius: 30,
    backgroundColor: 'gray',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 8,
    marginTop: 10,
  }
});
  