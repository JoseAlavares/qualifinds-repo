import React from "react";
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
import {editTodo} from '../../services/todo.service'
import { toast } from "react-toastify";

const ModalEditTodo = () => {
    const [_listTodoState, setListTodoState] = useRecoilState(listTodoState)
    const [_todos, setTodos] = useRecoilState(todos)

    const updateTodo = async () => {
        let errors = []
        if(!_listTodoState.name) errors.push('El campo nombre no puede estar vacio')
        if(!_listTodoState.title) errors.push('El campo titulo no puede estar vacio')

        if(errors.length) {
            toast.error(errors.join('<br>'))
            return
        }

        const result = await editTodo(_listTodoState.idTodo, _listTodoState.name, _listTodoState.title)

        if(result.error) {
            toast.error(result.message)
            return
        }
        
        let tmp = _todos
        const {idTodo, name, title} = _listTodoState

        setTodos(tmp.map(t => {
            if(t._id === idTodo) {
                return {_id: idTodo, name: name, title:title, completed: t.completed}
            }

            return t
        }))
        setListTodoState({..._listTodoState, editModal: false})   
        toast.success('Datos actualizados')  
    }

    const handleInput = evt => {
        const value = evt.target.value
        setListTodoState({
            ..._listTodoState,
            [evt.target.name]: value
        })
    }

    const handleModal = () => {
        setListTodoState({..._listTodoState, editModal: false})
    }

    return (
        <MDBContainer>
            <MDBModal isOpen={_listTodoState.editModal} toggle={handleModal}>
                <MDBModalHeader toggle={handleModal}>Editar TODO</MDBModalHeader>
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
                    <MDBBtn color="primary" onClick={() => updateTodo()}>Guardar</MDBBtn>
                </MDBModalFooter>
            </MDBModal>
        </MDBContainer>
    );
};

export default ModalEditTodo;