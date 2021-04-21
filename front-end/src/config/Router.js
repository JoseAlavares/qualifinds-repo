import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from "../views/Home/Home";
import Login from "../views/Login/Login";
import AuthenticatedRoute from "./AuthenticatedRoute";
import ListUser from "../views/ListUser/ListUser";
import EditUser from "../views/EditUser/EditUser";
import CreateUser from "../views/CreateUser/CreateUser";
import Profile from "../views/Profile/Profile";
import Page404 from "../views/Page404/Page404";
import ListTodo from "../views/ListTodo/ListTodo";

function Router() {	
    return (
	    <Switch>			
			<AuthenticatedRoute path="/profile/:id" component={Profile}/>
			<AuthenticatedRoute path="/edit-user" component={EditUser}/>			
			<AuthenticatedRoute path="/home" component={Home}/>
			<AuthenticatedRoute exact path="/list-user" component={ListUser}/>
			<AuthenticatedRoute exact path="/todo" component={ListTodo}/>
			<AuthenticatedRoute exact path="/" component={Home}/>
	    	<Route exact path="/login" component={Login}/>
			<Route exact path="/register" component={CreateUser}/>			
			<Route component={Page404}/>			
        </Switch>
    );
}

export default Router;