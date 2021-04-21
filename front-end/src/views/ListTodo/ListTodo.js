import React, { Fragment, useEffect, useState } from 'react';
import {
    MDBDataTableV5,  
    MDBCard, 
    MDBCardBody, 
    MDBCardHeader, 
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBBadge,
    MDBBtn
} from 'mdbreact';
import {todos, listTodoState} from '../../stores/ListTodo.store';
import {useRecoilState} from 'recoil';
import ButtonActions from '../../components/ButtonActions/ButtonActions'
import ModalAddTodo from '../../components/ModalAddTodo/ModalAddTodo'
import ModalEditTodo from '../../components/ModalEditTodo/ModalEditTodo'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify';

//Components
import Navbar from "../../components/Navbar/Navbar";

const BACKEND_URL = `${process.env.REACT_APP_DOMAIN}`;

const CompletedBadge = ({completed}) => {
    let color = "success"
    let text = "Completado"
    
    if(!completed) {
        color = "warning"
        text = "Incompleto"
    }

    return (<MDBBadge pill color={color}>{text}</MDBBadge>)
}

const ListTodo = (props) => {
    const [_todos, setTodos] = useRecoilState(todos)
    const [_listTodoState, setListTodoState] = useRecoilState(listTodoState)
    const [gridStructure, setGridStructure] = useState({});
    const columns = [{
            "label": "#",
            "field": "#",
            "sort": "asc"
        },
        {
            'label': 'id',
            'field': '_id',
            'sort': 'asc'
        },
        {
            'label': 'Nombre',
            'field': 'name',
            'sort': 'asc'
        },
        {
            'label': 'Titulo',
            'field': 'title',
            'sort': 'asc'
        },
        {
            'label': 'Estatus',
            'field': 'completed',
            'sort': 'asc'
        },
        {
            'label': 'Acciones',
            'field': 'actions'
    }];

    const generateStructure = (data) => {    
        data = data.map((item, index) => {
            return {
                "#": ++index,
                "_id": item._id,
                "name": item.name,
                "title": item.title,                    
                "completed": <CompletedBadge completed={item.completed}/>,        
                "actions": <ButtonActions id={item._id} completed={item.completed}/>
            };
        });
        
        return {
            columns: columns,
            rows: data
        };
    };

    const openModalAddTodo = () => {
        setListTodoState({..._listTodoState, addModal: !_listTodoState.addModal})
    }

    useEffect(() => {
        console.log('render')
        const data = generateStructure(_todos)
        setGridStructure(data)
    }, [_todos,]);
    
    const location = props.location.pathname;
    return(
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
            <MDBContainer>                
                <MDBRow style={{"paddingTop": "10px"}}>                    
                    <ModalEditTodo/>
                    <ModalAddTodo/>                    
                    <MDBCol md="12">
                        <MDBCard narrow>
                            <MDBCardHeader 
                                className="view view-cascade gradient-card-header blue-gradient d-flex justify-content-between align-items-center py-2 mx-4 mb-3">
                                <h3 style={{"color": "white"}}>Lista TODO´s</h3>
                            </MDBCardHeader>
                            <MDBCardBody cascade>
                                <MDBBtn onClick={() => openModalAddTodo()} size="sm" color="primary">+ Agregar</MDBBtn>
                                <MDBDataTableV5 responsive
                                    hover 
                                    entriesOptions={[5, 20, 25]} 
                                    entries={5} 
                                    pagesAmount={4} 
                                    data={gridStructure}/>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </Fragment>
    );
};

export default ListTodo;