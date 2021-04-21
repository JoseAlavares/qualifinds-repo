import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { MDBContainer, 
	MDBRow, 
	MDBCol, 
	MDBInput, 
	MDBBtn,
	MDBCard,
	MDBCardBody,
	MDBCardFooter
} from "mdbreact";
import "./Login.css";
import { login } from '../../services/users.service'
import { loginState } from '../../stores/Login.store'
import {useRecoilState} from 'recoil';

//Components
import ModalMessage from "../../components/ModalMessage/ModalMessage";
import Navbar from "../../components/Navbar/Navbar";

import { validateEmail } from "../../utils/utils";

const Login = (props) => {
	const [_loginState, setLoginState] = useRecoilState(loginState);
	const token = window.sessionStorage.getItem("jwt");

	if(token) {			
		props.history.push("/home");		
	}

	const changeUser = (event) => {
		const value = event.target.value;
		setLoginState({..._loginState, user: value})
	};

	const changePassword = (event) => {
		const value = event.target.value;
		//setPassword(value);
		setLoginState({..._loginState, password: value})
	};
	
	const handleLogin = async (e) => {
		e.preventDefault();		
		let errors = [];

		if(!_loginState.user) errors.push(<p key={1} style={{"color": "red"}}>El campo correo no puede estar vacio</p>);
		if(!_loginState.password) errors.push(<p key={2} style={{"color": "red"}}>El campo contraseña no puede estar vacio</p>);			
		if(!validateEmail(_loginState.user)) errors.push(<p key={1} style={{"color": "red"}}>El formato del correo no es valido</p>);
		if(_loginState.password.length <= 4 && _loginState.password) errors.push(<p key={1} style={{"color": "red"}}>La longitud de la contraseña debe ser mayo a 4 caracteres</p>);

		if(errors.length > 0){			
			setLoginState({..._loginState, errorText: errors, showErrors: true});
			setTimeout(() => {
				setLoginState({..._loginState, showErrors: false});
			}, 3500);
		
			return;
		}
		
		setLoginState({..._loginState, loading: true, disableBtn: true});

		const result = await login(_loginState.user, _loginState.password);

		if(result.error) {			
			setLoginState({
				..._loginState,
				showModal: true,
				modalText: result.message,
				loading: false,
				user: "",
				password: ""
			})
			return;
		}
		console.log(result)
		window.sessionStorage.setItem("jwt", result.data.token);
		window.sessionStorage.setItem("user", JSON.stringify(result.data));
		props.history.push("/home");
	}

	const show = () =>{
		setLoginState({
			..._loginState,
			showModal: !_loginState.showModal
		})
	};

	const location = props.location.pathname;

	return (
		<Fragment>
			<Navbar
				location={location}/>
			<MDBContainer>
				<MDBRow>  				
					<MDBCard id="login-form">
						<MDBCardBody>
						<MDBCol md="12" lg="12">    				
		      				<form>
		        				<p className="h5 text-center mb-4">Sign in</p>
		        				<div className="grey-text">
		          					<MDBInput
									  	value={_loginState.user}
		          						name="user"
		          						onChange={changeUser}
		          						label="Type your email" 
		          						icon="envelope" 
		          						group type="text" 
		          						validate error="wrong"
		            					success="right" />
		          					<MDBInput
									  	value={_loginState.password}
		          						name="password"
		          						onChange={changePassword}
		          						label="Type your password" 
		          						icon="lock" 
		          						group type="password" 
		          						validate />
		        				</div>
		        				<div className="text-center">
		          					<MDBBtn
		          						onClick={handleLogin}
		          						disabled={_loginState.disableBtn}
		          						type={"button"}>
		          						Login
	          						</MDBBtn>
		        				</div>
		      				</form>      				
						</MDBCol>
					</MDBCardBody>
					<MDBCardFooter>
						<Link to="/register">Registrarse</Link>
						<br/>						
						<center>
							{_loginState.loading &&
								<div className="spinner-grow text-success" role="status">
		        					<span className="sr-only">Loading...</span>
		      					</div>
	      					}
      					</center>
      					<div id="errors">
      						{_loginState.showErrors &&
      							_loginState.errorText
      						}
      					</div>
					</MDBCardFooter>
				</MDBCard>
			</MDBRow>
			<ModalMessage
				showModal={_loginState.showModal}
				message={_loginState.modalText}
				show={show}
				/>
		</MDBContainer>
	</Fragment>		
	);
};

export default Login;