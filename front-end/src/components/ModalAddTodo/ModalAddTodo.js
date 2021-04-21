import React, { useEffect } from "react";
import { 
    MDBContainer, 
    MDBBtn, 
    MDBModal, 
    MDBModalBody, 
    MDBModalHeader, 
    MDBModalFooter,
    MDBInput,
} from "mdbreact";
import {listTodoState, todos} from '../../stores/ListTodo.store'
import {useRecoilState} from 'recoil'
import {addTodo} from '../../services/todo.service'
import { toast } from "react-toastify";

const ModalAddTodo = () => {
    const [_listTodoState, setListTodoState] = useRecoilState(listTodoState)
    const [_todos, setTodos] = useRecoilState(todos)

    const saveTodo = async () => {
        let errors = []
        if(!_listTodoState.name) errors.push('El campo nombre no puede estar vacio')
        if(!_listTodoState.title) errors.push('El campo titulo no puede estar vacio')

        if(errors.length) {
            toast.error(errors.join('<br>'))
            return
        }

        const result = await addTodo(_listTodoState.name, _listTodoState.title)

        if(result.error) {
            toast.error(result.message)
            return
        }
        
        let tmp = [..._todos, result]

        setTodos(tmp)
        setListTodoState({..._listTodoState, addModal: false})
    }

    const handleInput = evt => {
        const value = evt.target.value
        setListTodoState({
            ..._listTodoState,
            [evt.target.name]: value
        })
    }

    const handleModal = () => {
        setListTodoState({..._listTodoState, addModal: false})
    }

    useEffect(() => {
        if(_listTodoState.addModal) {
            console.log('render')
            setListTodoState({
                ..._listTodoState,
                name: "",
                title: ""
            })
        }
    }, [_listTodoState.addModal])

    return (
        <MDBContainer>
            <MDBModal isOpen={_listTodoState.addModal} toggle={handleModal}>
                <MDBModalHeader toggle={handleModal}>Agregar TODO</MDBModalHeader>
                <MDBModalBody>
                    <MDBInput 
                        className="p-2"
                        label="*Nombre"
                        name="name"                                             
                        type="text"
                        onChange={handleInput}
                        value={_listTodoState.name}/>

                    <MDBInput 
                        className="p-2"
                        label="*Titulo"
                        name="title"                                             
                        type="text"
                        onChange={handleInput}
                        value={_listTodoState.title}/>
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color="secondary" onClick={() => handleModal()}>Close</MDBBtn>
                    <MDBBtn color="primary" onClick={() => saveTodo()}>Guardar</MDBBtn>
                </MDBModalFooter>
            </MDBModal>
        </MDBContainer>
    );
};

export default ModalAddTodo;