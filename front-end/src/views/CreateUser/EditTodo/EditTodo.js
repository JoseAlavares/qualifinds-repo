import React, { Fragment, useEffect } from "react";
import { 
    MDBContainer,
    MDBCol,
    MDBRow, 
    MDBCard, 
    MDBCardImage, 
    MDBCardTitle, 
    MDBCardText,
    MDBCardBody,
    MDBIcon,
    MDBBtn,
    MDBModal,
    MDBModalHeader,
    MDBModalBody,
    MDBModalFooter            
} from "mdbreact";
import UserForm from "../../components/UserForm/UserForm";
import Navbar from "../../components/Navbar/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import {editUserState, userInfoState} from '../../stores/EditUser.store';
import {useRecoilState} from 'recoil';
//import { confirmPassword } from "../../utils/utils";
//import {getUserInfo, editUser, deleteAccount} from '../../services/users.service';

const BACKEND_URL = `${process.env.REACT_APP_DOMAIN}`;

const EditTodo = (props) => {
    // const [_editUserState, setEditUserState] = useRecoilState(editUserState);
    // const [_userInfoState, setUserInfoState] = useRecoilState(userInfoState);    
    const configNotify = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };
    
    const token = window.sessionStorage.getItem("jwt");
    const user = JSON.parse(window.sessionStorage.getItem("user"));
    const location = props.location.pathname;
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }

    const getDataUser = async () => {
        const result = await getUserInfo(user.id)

        if(result.error) {
            console.error(result.message);
            return;
        }

        setUserInfoState({
            name: result.data.name,
            email: result.data.email
        });        
    };

    useEffect(() => {
        getDataUser();
    }, []);
        
    const handleInput = (event) => {
        const value = event.target.value;
        setUserInfoState({
            ..._userInfoState,
            [event.target.name]: value
        });
    };

    const handleSubmit = async () => {
        let errors = [];
        if(!_userInfoState.name) errors.push("El campo del nombre no puede estar vacio");
        if(!_userInfoState.email) errors.push("El campo de email no puede estar vacio");
        if(_userInfoState.password && !_userInfoState.confirm_password) errors.push("El campo de confirmación de contraseña no puede estar vacio");
        if(_userInfoState.confirm_password && !_userInfoState.password) errors.push("El campo contraseña no puede estar vacio");
        if(_userInfoState.password && _userInfoState.password.length <= 4) errors.push("La contraseña debe ser mayor a 4 caracteres");
        if(
            (_userInfoState.password && _userInfoState.confirm_password) &&
            !confirmPassword(_userInfoState.password, _userInfoState.confirm_password)
        ) {
            errors.push("Las contraseñas no coinciden");
        }

        if(errors.length) {
            for(let i=0; i<errors.length; i++) {
                toast.error(errors[i], configNotify);
            }

            return;
        }
        
        setEditUserState({
            btnTxt: "",
            loading: true,
            disableBtn: true
        })

        let formData = {
            id: user.id,
            name: _userInfoState.name,
            email: _userInfoState.email            
        };

        if(_userInfoState.password) {
            formData.password = _userInfoState.password;
        }

        const result = await editUser(formData);

        if(result.error) {
            setEditUserState({
                loading: false,
                btnTxt: "Registrarse",
                disableBtn: false,
            });
            toast.error(result.message, configNotify);
            return;
        }

        toast.success("Los datos fueron modificados correctamente", configNotify);
        setTimeout(() => {
            props.history.push("/list-user");
        }, 2000);        
    };

    const show = () => {
        setEditUserState({
            ..._editUserState,
            showModal: !_editUserState.showModal
        });
    };

    const handleAccount = async () => {        
        setEditUserState({
            btnTxt2: "",
            loading2: true
        });

        const result = await deleteAccount(user.id);

        if(result.error) {
            toast.error(
                "Ocurrio un error",
                configNotify
            );
            setEditUserState({
                ..._editUserState,
                btnTxt: "Eliminar cuenta",
                loading2: false
            })
            return;
        }

        toast.success(
            "La cuenta fue eliminada correctamente",
            configNotify
        );
        setTimeout(() => {
            window.sessionStorage.clear();
            props.history.push("/login");
        }, 3000);
        return;        
    };

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
                        formName={"Editar mis datos"}                
                        name={_userInfoState.name}
                        email={_userInfoState.email}
                        handleInput={handleInput}
                        handleSubmit={handleSubmit}
                        buttonTxt={_editUserState.btnTxt}
                        loading={_editUserState.loading}
                        disableBtn={_editUserState.disableBtn}/>
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
                                        Nombre: {_userInfoState.name || "n/a"}
                                    <br/>
                                    <MDBIcon 
                                        icon="envelope" 
                                        size="3x" 
                                        className="amber-text pr-3"/>
                                        Correo: {_userInfoState.email || "n/a"}                                
                                </MDBCardText>
                            </MDBCardBody>
                            <MDBBtn 
                                    color="danger"
                                    onClick={() => { setEditUserState({..._editUserState, showModal: true}) }}>
                                Eliminar cuenta
                            </MDBBtn>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
                {_editUserState.showModal &&                    
                    <MDBModal isOpen={_editUserState.showModal} toggle={show}>
                        <MDBModalHeader toggle={show}>Mensajes del sistema</MDBModalHeader>
                        <MDBModalBody>
                            ¿Estas seguro de eliminar tu cuenta?
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={show}>Cerrar</MDBBtn>
                            <MDBBtn color="secondary" onClick={handleAccount}>
                                {_editUserState.btnTxt2}
                                {_editUserState.loading2 &&
                                    <div className="spinner-border text-warning" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                }
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                }
            </MDBContainer>
        </Fragment>
    );
};

export default EditUser;