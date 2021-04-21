import {
    atom,
    //selector
} from 'recoil';

export const loginState = atom({
    key: 'loginState',
    default: {
        user: "",
        password: "",
        loading: false,
        errorText: null,
        disableBtn: false,
        showErrors: false,
        showModal: false,
        modalText: ""
    }
});