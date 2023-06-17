import * as SecureStore from 'expo-secure-store';
import { useState } from 'react'

const useColors = () =>{
    const [colors, setColors] = useState({
        mainGreen:  '#23DB77',
        bgDark:     '#464646',
        bgLight:    '#DBE8E1',
        secondaryText: '#B1B8B4',
        darkGreen:  '#254A34',
        background: '#545454',
        input2: '#DBE8E1',
        input3: '#DBE8E1'
    });

    const getColors = () =>{
        SecureStore.getItemAsync('theme').then(result => {
            if(result !== undefined && result !== null && result === 'light') {
                setColors({
                    mainGreen:  '#254A34',
                    bgDark:     '#DBE8E1',
                    bgLight:    '#254A34',
                    secondaryText: '#B1B8B4',
                    darkGreen:  '#254A34',
                    background: '#EEEFEF',
                    input2: '#CFCFCF',
                    input3: '#254A34'
                })
            }
        });
    }

    return [colors, getColors]
}

export default useColors;

// export default {
//     mainGreen:  mainGreen,
//     bgDark:     '#464646',
//     bgLight:    '#DBE8E1',
//     secondaryText: '#B1B8B4',
//     darkGreen:  '#254A34',
//     background: '#545454',
// }