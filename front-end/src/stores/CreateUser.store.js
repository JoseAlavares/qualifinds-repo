import {atom } from 'recoil';

export const createUserState = atom({
    key: 'createUserState',
    default: {
        loading: false,
        disableBtn: false,
        btnTxt: "Registrarse",
        name: "",
        email: "",
        password: "",
        confirm_password: ""        
    }
})