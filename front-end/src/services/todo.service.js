import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_DOMAIN;
const API_KEY = process.env.REACT_APP_API_KEY;
const HEADERS = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${window.sessionStorage.getItem('jwt')}`
}

export async function changeComplete(id) {
    try {
        const result = await axios({
            method: 'PUT',
            url: `${BACKEND_URL}/api/todo/${id}`,
            headers: HEADERS,
        })

        const {data: {data}} = result
        return {data: data}
    } catch(err) {
        console.error(err.message)
        return {
            error: true,
            message: 'Error in the request'
        }
    }
}

export async function getTodos(id) {
    try {
        const result = await axios({
            method: 'GET',
            url: `${BACKEND_URL}/api/todo`,
            headers: HEADERS,            
        })

        const {data: {data}} = result
        return data
    } catch (err) {
        console.error(err.message)
        return {
            error: true,
            message: 'Error in the request'
        }
    }
}

export async function addTodo(name, title) {
    try {
        const result = await axios({
            method: 'POST',
            url: `${BACKEND_URL}/api/todo`,
            headers: HEADERS,
            data: {
                name: name,
                title: title
            }
        })

        const {data: {data}} = result
        return data
    } catch (err) {
        console.error(err.message)
        return {
            error: true,
            message: 'Error in the request'
        }
    }
}

export async function editTodo(id, name, title) {
    try {
        const result = await axios({
            method: 'PUT',
            url: `${BACKEND_URL}/api/todo`,
            headers: HEADERS,
            data: {
                id: id,
                name: name,
                title: title
            }
        })
        
        const {data: {data}} = result
        return data
    } catch (err) {
        console.error(err.message)
        return {
            error: true,
            message: 'Error in the request'
        }
    }
}

export async function deleteTodo(id) {
    try {
        const result = await axios({
            method: 'DELETE',
            url: `${BACKEND_URL}/api/todo/${id}`,
            headers: HEADERS,
        })
        
        const {data} = result
        return data
    } catch (err) {
        console.error(err.message)
        return {
            error: true,
            message: 'Error in the request'
        }
    }
} 