import React, { Fragment } from 'react';
import {changeComplete, deleteTodo} from '../../services/todo.service';
import {todos, listTodoState} from '../../stores/ListTodo.store'
import {toast} from 'react-toastify'
import { useRecoilState,  } from 'recoil'
import { MDBBtn } from 'mdbreact'

const ButtonActions = ({id, completed}) => {
    console.log(id)
    const [_todos, setTodos] = useRecoilState(todos)
    const [_listTodoState, setListTodoState] = useRecoilState(listTodoState)
    //useEffect(() => {}, [_todos])
    const configNotify = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };

    const changeCompleteTodo = async () => {
        const result = await changeComplete(id)

        if(result.error) {
            console.error(result.message)
            toast.error('Ocurrio un error en la petición')
            return
        }

        setTodos(_todos.map(todo => {
            if(todo._id === id) {
                return {...todo, completed: true}
            }

            return todo
        }))

        toast.success('Tarea completada')
    }

    const eraseTodo = async () => {
        const result = await deleteTodo(id)
        if(result.error) {
            console.error(result.message)
            toast.error('Ocurrio un error en la petición')
            return
        }

        setTodos(_todos.filter(todo => {
            if(todo._id !== id) {
                return todo
            }
        }))

        toast.success('Tarea eliminada')
    }

    const setIdTodo = () => {        
        const todoTmp = _todos.find(t => t._id === id)
        
        setListTodoState({
            ..._listTodoState,
            idTodo: id,
            editModal: true,
            name: todoTmp.name,
            title: todoTmp.title
        })
    }

    return (
        <Fragment>
            {!completed && 
                <MDBBtn 
                    size="sm"
                    key={1} 
                    color="success" 
                    onClick={changeCompleteTodo}>
                    Completar
                </MDBBtn>
            }
            <MDBBtn 
                size="sm"
                key={2} 
                color="primary"
                onClick={setIdTodo}>
                Editar
            </MDBBtn>
            <MDBBtn 
                size="sm"
                key={3} 
                color="danger"
                onClick={eraseTodo}>
                Eliminar
            </MDBBtn>
        </Fragment>
    )
}

export default ButtonActions