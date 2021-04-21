import {atom, selector} from 'recoil'
import {getTodos} from '../services/todo.service'

export const listTodoState = atom({
    key: 'listTodoState',
    default: {
        idTodo: null,
        addModal: false,
        editModal: false,
        name: "",
        title: ""
    }
})

export const todos = atom({
    key: 'todosState',
    default: selector({
        key: 'todos',
        get: async ({get}) => {
            const result = await getTodos()
    
            if(result.error) {
                throw new Error('Error in the todos')
            }
            
            return result
        }
    })
})

/*export const todos = selector({
    key: 'todos',
    get: async ({get}) => {
        const currentState = get(todosState)
        const result = await getTodos()

        if(result.error) {
            throw new Error('Error in the todos')
        }
        
        return result
    },
    set:({set}, newValue) => {
        set(todos, newValue)
    }
})*/