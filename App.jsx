import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import 'react-native-url-polyfill/auto';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';

import Store from './redux/store';

import IntroScreen from './screens/intro.screen';
import SignUpScreen from './screens/auth/signup.screen';
import SignInScreen from './screens/auth/signin.screen';

import HomeScreen from './screens/home/index.screen';
import LicenseScreen from './screens/home/license.screen';

import ChartAIScreen from './screens/home/openai/chatai.screen';
import WriterAIScreen from './screens/home/openai/writerai.screen';
import WriterAIHomeScreen from './screens/home/openai/writerai.home.screen';
import PromptScreen from './screens/home/openai/prompt.screen';
import PromptDetailScreen from './screens/home/openai/prompt.detail.screen';

import AppMetrica from "react-native-appmetrica-next";

import {  useFonts, Manjari_400Regular as Manjari, Manjari_700Bold as ManjariBold } from '@expo-google-fonts/manjari';

import ProfileScreen from './screens/home/profile.screen';
import ImageView from './screens/home/image.view';
import Config from './redux/config';

const Stack = createStackNavigator();
import useColors from './assets/values/colors';
import { useEffect } from 'react';

const App = () =>  {
  const [Colors, GetColors] = useColors();
  const [fontsLoaded] = useFonts({Manjari, ManjariBold});
  useEffect(() => { 
    GetColors();
    AppMetrica.activate({
      apiKey: Config.AppMetrica_API_KEY,
      sessionTimeout: 120,
      firstActivationAsUpdate: true,
    });
  }, [])

  return (
    <Provider store={Store}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Introduction">
            {/* <Stack.Screen name="Splash" options={{ headerShown: false }} component={SplashScreen} /> */}
            <Stack.Screen name="Introduction" options={{ headerShown: false }} component={IntroScreen} />

            <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
            <Stack.Screen name="SignIn" options={{ headerShown: false }} component={SignInScreen} />

            <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
            <Stack.Screen name="License" options={{ headerShown: false }} component={LicenseScreen} />

            <Stack.Screen name="ChatAI" options={{ headerShown: false }} component={ChartAIScreen} />
            <Stack.Screen name="WriterAI" options={{ headerShown: false }} component={WriterAIScreen} />
            <Stack.Screen name="WriterAIHome" options={{ headerShown: false }} component={WriterAIHomeScreen} />
            <Stack.Screen name="PromptAI" options={{ headerShown: false }} component={PromptScreen} />
            <Stack.Screen name="PromptAIDetail" options={{ headerShown: false }} component={PromptDetailScreen} />

            <Stack.Screen name="ImageView" options={{ headerShown: false }} component={ImageView} />
            <Stack.Screen name="Profile" options={{ headerShown: false }} component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        
        <StatusBar backgroundColor={Colors.background} />
      </PaperProvider>
    </Provider>
  );
}

export default App;
