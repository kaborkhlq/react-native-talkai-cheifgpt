import FirebaseApp from '@react-native-firebase/app';
import FireStore from '@react-native-firebase/firestore';
import Config from '../config';
import  { Configuration, OpenAIApi } from 'openai'; 
import axios from 'axios';
import KEYS from '../keys';

const configuration = new Configuration({
	apiKey: Config.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

export const OpenAIChat = (message) => dispatch => {
    dispatch({ type: KEYS.OpenAIChat_REQUEST, paylaod: message })
    openai.createCompletion({
        model: "text-davinci-003",
        // messages: [{ role: "user", content: message }],
        prompt: message,
        temperature: 0.5,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: ["You:"],
    })
    .then(response => {
        var text = response.data.choices[0].text;
        text = text.replace(/\n/g, '');
        var prompt = JSON.parse(response.config.data).prompt;
        dispatch({
            type: KEYS.OpenAIChat_SUCCESS,
            payload: text,
            config: prompt
        })
    })
    .catch(error => {
        dispatch({ type: KEYS.OpenAIChat_FAILURE })
    })
}

export const OpenAIWriter = (category, message) => dispatch => {
    dispatch({ type: KEYS.OpenAIWriter_REQUEST })
    openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "assistant", content: `Please Create ${category} with this information. ${message}` }],
    })
    .then(response => {
        var text = response.data.choices[0].message.content;
        dispatch({
            type: KEYS.OpenAIWriter_SUCCESS,
            payload: text
        })
    })
    .catch(error => {
        dispatch({ type: KEYS.OpenAIWriter_FAILURE })
    })
}

export const OpenAIPrompt = (prompt, n, size, index) => {
    return new Promise(async (resolve, reject) => {
        const header = { 'Content-Type': 'application/json' };
        axios.post('https://stablediffusionapi.com/api/v3/text2img', {
            "key": Config.STABLE_API_KEY,
            "prompt": prompt,
            "negative_prompt": null,
            "width": size,
            "height": size,
            "samples": "1",
            "num_inference_steps": "20",
            "seed": null,
            "guidance_scale": 7.5,
            "safety_checker": "yes",
            "multi_lingual": "no",
            "panorama": "no",
            "self_attention": "no",
            "upscale": "no",
            "embeddings_model": "embeddings_model_id",
            "webhook": null,
            "track_id": null
        }, header).then(result => {
            resolve({
                prompt: prompt,
                index: index,
                images: result.data
            });
        }).catch(error =>{
            console.log(error);
            reject(error);
        })
    });
    
}

export const OpenAIQueuedPrompt = (id) => {
    return new Promise(async (resolve, reject) => {
        const header = { 'Content-Type': 'application/json' };
        axios.post('https://stablediffusionapi.com/api/v4/dreambooth/fetch', {
            "key": Config.STABLE_API_KEY,
            "request_id": id
        }, header).then(result => {
            resolve(result.data);
        }).catch(error =>{
            reject(error);
        })
    });
    
}

export const GetImagePrompt = () => {
    return new Promise(async (resolve, reject) => {
        if(!FirebaseApp.apps.length) FirebaseApp.initializeApp(Config.firebaseConfig);
        
        FireStore().collection('Prompts').doc('Writer').get().then(result => {
            resolve(result);
        }).catch(error => {
            reject(error);
        });
    });
}

export const GetWriterPrompt = () => {
    return new Promise(async (resolve, reject) => {
        if(!FirebaseApp.apps.length) FirebaseApp.initializeApp(Config.firebaseConfig);
        
        FireStore().collection('Prompts').doc('Image').get().then(result => {
            console.log(result);
            resolve(result);
        }).catch(error => {
            reject(error);
        });
    });
}

export const GetFavouritesPrompt = (uid) => {
    return new Promise(async (resolve, reject) => {
        if(!FirebaseApp.apps.length) FirebaseApp.initializeApp(Config.firebaseConfig);
        
        FireStore().collection('Favorites').doc(uid).get().then(result => {
            resolve(result);
        }).catch(error => {
            reject(error);
        });
    });
}

export const AddFavoritePrompt = (uid, prompt, url) => {
    return new Promise(async (resolve, reject) => {
        if(!FirebaseApp.apps.length) FirebaseApp.initializeApp(Config.firebaseConfig);
        
        FireStore().collection('Favorites').doc(uid).update(prompt, url).then(result => {
            resolve(result);
        }).catch(error => {
            reject(error);
        });
    });
}