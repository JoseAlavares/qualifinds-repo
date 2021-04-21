import {atom, selector } from 'recoil';
//import { getUserInfo } from '../services/users.service'

export const editUserState = atom({
    key: 'editUserState',
    default: {        
        loading: false,
        disableBtn: false,
        btnTxt: "Editar",
        showModal: false,
        btnTxt2: "Eliminar cuenta",
        loading2: false
    }
});

export const userInfoState = atom({
    key: 'userInfoState',
    default: {
        name: "",
        email: "",
        password: "",
        confirm_password: "",
    }
});