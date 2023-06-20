import KEYS from "../keys";

const initialState = {
    IS_REQUEST: false,
    IS_SUCCESS: false,
    IS_FAILURE: false,

    data: {
        credit: 0,
        email: "beautifulworld820.1@gmail.com",
        emailVerifed: true,
        phone: null,
        photo: "https://lh3.googleusercontent.com/a/AAcHTtfTRSl7yvTiJlAohzD66QBp_sNzOSpdzY8X3v8X=s96-c",
        uid: "nlbXrQ3DouQYzDlNhKfEZ0Rakad2",
        username: "Beautiful"
    },
    service: '',
}

export default function reducer (state = initialState, action) {
    switch(action.type) {
        case KEYS.SIGN_IN_REQUEST:
            return { ...state, IS_REQUEST: true, IS_SUCCESS: false, IS_FAILURE: false }
        case KEYS.SIGN_IN_SUCCESS:
            return { ...state, IS_REQUEST: false, IS_SUCCESS: true, IS_FAILURE: false, data: action.payload, service: action.service }
        case KEYS.SIGN_IN_FAILURE:
            return { ...state, IS_REQUEST: false, IS_SUCCESS: false, IS_FAILURE: true, data: action.payload }

        case KEYS.SIGN_UP_REQUEST:
            return { ...state, IS_REQUEST: true, IS_SUCCESS: false, IS_FAILURE: false, data: action.payload, service: action.service }
        case KEYS.SIGN_UP_SUCCESS:
            return { ...state, IS_REQUEST: false, IS_SUCCESS: true, IS_FAILURE: false }
        case KEYS.SIGN_UP_FAILURE:
            return { ...state, IS_REQUEST: false, IS_SUCCESS: false, IS_FAILURE: true, data: action.payload }

        case KEYS.SIGN_OUT_REQUEST:
            return { ...state, IS_REQUEST: true, IS_SUCCESS: false, IS_FAILURE: false }
        case KEYS.SIGN_OUT_SUCCESS:
            return { ...state, IS_REQUEST: false, IS_SUCCESS: true, IS_FAILURE: false, data: {}, service: '' }
        case KEYS.SIGN_OUT_FAILURE:
            return { ...state, IS_REQUEST: false, IS_SUCCESS: false, IS_FAILURE: true }

        case KEYS.UPDATE_CREDIT: 
            let t = state;
            t.data.credit = action.payload
            return t;
        default: 
            return state;
    }
}