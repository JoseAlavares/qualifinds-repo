import React, { Fragment, useState } from "react";
import {
    MDBContainer,
    MDBCol, 
    MDBRow,
    MDBCard,
    MDBCardImage,
    MDBCardText,
    MDBCardTitle,
    MDBCardBody,
    MDBIcon
} from "mdbreact";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserForm from "../../components/UserForm/UserForm";
import Navbar from "../../components/Navbar/Navbar";
import { createUser } from '../../services/users.service';
import { createUserState } from '../../stores/CreateUser.store'
import {useRecoilState} from 'recoil';
import {createUserService} from '../../services/users.service'

import { validateEmail, confirmPassword } from "../../utils/utils";

const CreateUser = (props) => {
    const [_createUserState, setCreateUserState] = useRecoilState(createUserState);    
    const configNotify = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };

    const handleInput = (event) => {
        const value = event.target.value;
        setCreateUserState({
            ..._createUserState,
            [event.target.name]: value
        });
    };

    const handleSubmit = async () => {
        let errors = [];
        if(!_createUserState.name) errors.push("El campo del nombre no puede estar vacio");
        if(!_createUserState.email) errors.push("El campo de email no puede estar vacio");
        if(!validateEmail(_createUserState.email)) errors.push("El formato del correo no es correcto");
        if(!_createUserState.password) errors.push("El campo de contraseña no puede estar vacio");
        if(!_createUserState.confirm_password) errors.push("El campo de confirmación de contraseña no puede estar vacio");
        if(_createUserState.password && _createUserState.password.length <= 4) errors.push("La contraseña debe ser mayor a 4 caracteres");
        if(
            (_createUserState.password && _createUserState.confirm_password) &&
            !confirmPassword(_createUserState.password, _createUserState.confirm_password)
        ) {
            errors.push("Las contraseñas no coinciden");
        }

        if(errors.length) {
            for(let i=0; i<errors.length; i++) {
                toast.error(errors[i], configNotify);
            }

            return;
        }
                
        setCreateUserState({
            ..._createUserState,
            loading: true,
            disableBtn: true,
            btnTxt: ""
        })
        
        const {name, email, password} = _createUserState;
        const result = await createUserService(name, email, password)
        if(result.error) {            
            setCreateUserState({
                ..._createUserState,
                loading: false,
                disableBtn: false,
                btnTxt: "Registrarse"
            })
            toast.error(result.message);
            return;
        }

        toast.success(
            "La cuenta fue creada correctamente, seras redirigido a el inicio de sesion", 
            configNotify
        );
        
        setTimeout(() => {
            props.history.push("/home");
        }, 3000);
    }
    
    const location = props.location.pathname;

    return (
        <Fragment>
            <Navbar
                location={location}/>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                />

            <MDBContainer style={{paddingTop: "5px"}} className="profile-card">
                <MDBRow>
                    <UserForm
                        columnSize={"8"}
                        formName={"Registrar cuenta"}
                        name={_createUserState.name}
                        email={_createUserState.email}
                        handleInput={handleInput}
                        handleSubmit={handleSubmit}
                        buttonTxt={_createUserState.btnTxt}
                        loading={_createUserState.loading}
                        disableBtn={_createUserState.disableBtn}/>
                    <MDBCol md="4" style={{paddingTop: "5px"}}>
                        <MDBCard className="profile-card">
                            <MDBCardImage 
                                className="img-fluid" 
                                src="https://icon-library.com/images/icon-programmer/icon-programmer-14.jpg" 
                                waves />
                            <MDBCardBody>
                                <MDBCardTitle>Perfil de usuario</MDBCardTitle>
                                <MDBCardText>
                                    <MDBIcon 
                                        icon="user" 
                                        size="3x" 
                                        className="amber-text pr-3"/>
                                        Nombre: {_createUserState.name || "n/a"}
                                    <br/>
                                    <MDBIcon 
                                        icon="envelope" 
                                        size="3x" 
                                        className="amber-text pr-3"/>
                                        Correo: {_createUserState.email || "n/a"}                                
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </Fragment>
    );
};

export default CreateUser;