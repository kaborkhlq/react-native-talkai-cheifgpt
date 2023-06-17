import { StyleShee, Dimensions } from "react-native"; 
import { getStatusBarHeight } from 'react-native-status-bar-height';
import SharedPreferences  from 'react-native-shared-preferences';
import Colors from './colors';

const { width , height } = Dimensions.get('window');
const statusBarHeight = getStatusBarHeight();

export default {
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
    },
    column: {
        flexDirection: 'column'
    },
    row_center: {
        justifyContent: 'center'
    },
    column_center: {
        alignItems: 'center'
    },
    row_space_around: {
        justifyContent: 'space-around'
    },
    column_space_around: {
        alignItems: 'space-around'
    },

    underline: {
        textDecorationLine: 'underline'
    },

    Manjari: {
        fontFamily: 'Manjari',
    },
    ManjariBold: {
        fontFamily: 'ManjariBold'
    }
    
}