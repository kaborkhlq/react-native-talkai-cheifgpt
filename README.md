<div style="width:100%">
    <div style="width:50%;">
        <div align="center">
       <a> <img align="center" width="180" height="180" alt="CometChat" src="./screenshots/logo.webp"> </a>  
        </div>    
    </div>    
</div>

</br></br>
> **Note**

Version 1 Talk AI - Chat & Art Creator

## About This APP
Welcome to our amazing AI-powered chat app, featuring an advanced Talk AI chatbot and ChatGPT functionality. Our app utilizes state-of-the-art artificial intelligence (AI) technology to provide you with an exceptional conversational experience.

Our AI chatbot employs natural language processing and machine learning algorithms to engage in intelligent and human-like conversations. Chat with our AI chatbot and explore its vast knowledge base, as it assists you with information, recommendations, problem-solving, and more. Experience the future of communication with our AI chatbot, where your queries are met with prompt and accurate responses.

Powered by ChatGPT, our app takes conversational AI to the next level. ChatGPT is an advanced language model that understands context, generates coherent responses, and engages in meaningful discussions. Immerse yourself in captivating conversations with ChatGPT, where you can delve into various topics, seek advice, brainstorm ideas, and even enjoy entertaining interactions.

The Talk AI app assistant gives you the ability to download and use your own data to train our model. You can submit your text data such as documents, emails, messages or any other information and our AI chat will learn from this data. This will allow the AI to better understand your context, offer more accurate and personalised responses, and easily perceive your unique manner of communication.

Our chat with AI based on your data can become your personal assistant who understands your preferences and is able to offer personalised recommendations, advice and solutions to problems. For example, if you are a professional in a certain field, you can train our AI chat based on your expertise and use it as an assistant when advising clients or solving complex problems.

How can the image generator be used?

Content creation and design: AI-assisted image generation can be used to create new and original visual content such as illustrations, book covers, posters, promotional material and more. Using AI, unique and attractive graphic elements can be created.

Gaming industry: AI-assisted image generation can be used to create game characters, environments, textures, animations and special effects. This helps game developers create more realistic and immersive visual worlds.

Advertising and marketing: AI image generation can be used to create personalised advertising materials, banners, logos and other elements of marketing strategy. This allows the visual impact to be increased and the attention of the audience to be captured.

Medicine and science: In medicine, AI image generation can be used to create visualisations of medical data, analyse images, create 3D models and simulations. In scientific research, it can help in creating visualisations and data processing to better understand and visualise complex phenomena.

Creative Arts: Image generation using AI can be used for creative purposes, digital art creation and graphic experiments. Using Talk AI, unique and aesthetically pleasing compositions, stylisations and effects can be generated.

In addition to the AI chatbot and ChatGPT, our app offers a range of exciting features. You can harness the power of AI to create unique avatars, generate stunning artwork from text descriptions, and explore the realms of AI-assisted creativity. Unleash your imagination and watch as our app transforms your words into visually captivating masterpieces.

Experience the convenience of having an AI chatbot at your fingertips, as well as the limitless possibilities of engaging with ChatGPT. Our app is a must-have for anyone seeking intelligent conversations, AI-powered assistance, and innovative tools for artistic expression.

Don't miss out on the opportunity to explore the world of Talk AI chat, interact with our advanced chatbot, and unlock your creativity with ChatGPT. Join our app today and embark on a journey where AI meets human-like conversation and artistic inspiration!
##

<br/><br/>

# CometChat Kitchen Sink Sample App (React Native)

[![Platform](https://img.shields.io/badge/Platform-ReactNative-brightgreen)](#)
![GitHub repo size](https://img.shields.io/github/repo-size/DevWizard0000/react-native-talkai-cheifgpt)
![GitHub contributors](https://img.shields.io/github/contributors/DevWizard0000/react-native-talkai-cheifgpt)
![GitHub stars](https://img.shields.io/github/stars/DevWizard0000/react-native-talkai-cheifgpt?style=social)
![Twitter Follow](https://img.shields.io/twitter/follow/cometchat?style=social)
</br></br>

<div style="width:100%">
    <div style="width:50%; display:inline-block">
        <div align="center">
          <img align="left" alt="Main" src="./Screenshots/main.png">    
        </div>    
    </div>    
</div>

</br></br>

CometChat Kitchen Sink Sample App (built using **CometChat UIKit**) is a fully functional real-time messaging app capable of private (one-on-one), group messaging, voice & video calling.

## Features

- Login
- Private(1-1) & Group conversations
- Voice & video calling & conferencing
- Rich Media Attachments
- Typing Indicators
- Text, Media and Custom messages
- Read receipts
- Online Presence Indicators
- Message History
- Users & Friends List
- Groups List
- Search by users and groups
- Conversations List
- Threaded Conversations

## Extensions

[Thumbnail Generation](https://prodocs.cometchat.com/docs/extensions-thumbnail-generation) | [Link Preview](https://prodocs.cometchat.com/docs/extensions-link-preview) | [Rich Media Preview](https://prodocs.cometchat.com/docs/extensions-rich-media-preview) | [Smart Reply](https://prodocs.cometchat.com/docs/extensions-smart-reply)| [Emojis](https://prodocs.cometchat.com/docs/extensions-emojis) | [Polls](https://prodocs.cometchat.com/docs/extensions-polls) | [Reactions](https://prodocs.cometchat.com/docs/extensions-reactions) | [Stickers](https://prodocs.cometchat.com/docs/extensions-stickers)

<hr/>

| <div align="left"><span>**Note:**<span style="font-weight:500"> Support for Expo CLI based apps.</span> </span></div>                                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| If you are using Expo CLI to build a React Native app, the calling component will not work as our calling component needs native-level changes.However, you can create a React Native app using React Native CLI or use the 'expo eject' command to convert your app from an expo-managed workflow to a bare workflow. |

---

# Installation

1. Simply clone the project from this project. After cloning the repository:

# Setting up the sample app

- Obtain your `APP_ID`, `AUTH_KEY` and `REGION` from [CometChat-Pro Dashboard](https://app.cometchat.com/)

- Open the project.

- Run `cd CometChatWorkspace/src`.

- Modify `APP_ID` and `AUTH_KEY` and `REGION` with your own (update the `CONSTS.js` file).

- Hit `yarn add` to install the packages.

- Run `cd ios` then run `pod install` to install the pods. Once pods are installed run `cd ..` to go back to the root folder.

- Run the app on iOS using `npx react-native run-ios` & on Android using `npx react-native run-android`.

- Select demo users or enter the **UID** at the time of login once the app is launched.

Build and run the Sample App.

| <div align="left"><span>**Note:**<span style="font-weight:500"> error:0308010C:digital envelope routines</span> </span></div>                                                                                                                                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| If you are using node 17 and above, You may come accross this error code. To solve this please set <b>NODE_OPTIONS</b> with <b>openssl-legacy-provider</b>. Execute below command in terminal<br /> `export NODE_OPTIONS=--openssl-legacy-provider` then `react-native start`.   |

| <div align="left"><span>**Note:**<span style="font-weight:500"> generating release APK.</span> </span></div>                                                                                                                                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Setting the below line in android/build.gradle `true` or `false` will determine whether to generate multiple APKs for different CPU architectures or a single APK bundle that works on all devices despite the CPU you're running it on but at the cost of APK bundle size. Default value is `true`<br/> `def enableSeparateBuildPerCPUArchitecture = true` |

# Learn more about UI-Kit

Learn more about how to integrate [UI Kit](https://github.com/cometchat-pro/cometchat-pro-react-native-ui-kit/tree/v3) inside your app.

# Troubleshooting

- To read the full documentation on UI Kit integration visit our [Documentation](https://prodocs.cometchat.com/v3.0-beta/docs/react-native-ui-kit) .

- Facing any issues while integrating or installing the UI Kit please <a href="https://app.cometchat.com/"> connect with us via real time support present in CometChat Dashboard.</a>.

# Contact 📪

Contact us via real time support present in [CometChat Dashboard](https://app.cometchat.com/).
