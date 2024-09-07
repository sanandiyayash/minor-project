import axios from 'axios';

// const API_URL = 'https://minor-project-backend-rfsf.onrender.com';
const API_URL = 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const register = async (userData) => {
    const response = await axiosInstance.post('/user/register', userData);
    return response;
};

export const login = async (userData) => {
    const response = await axiosInstance.post('/user/login', userData);
    return response;
};

export const logout = async () => {
    const response = await axiosInstance.post('/user/logout');
    return response;
};

export const home = async (token) => {
    const response = await axiosInstance.post('/user/p', {}, {
        headers: {
            authorization: `Bearer ${token}`
        },
        withCredentials: true
    });
    return response;
};

//invoice routes
export const allInvoice = async (token) => {
    const response = await axiosInstance.get('/invoice', {
        headers: {
            authorization: `Bearer ${token}`
        },
        withCredentials: true
    })
    return response
}
export const createInvoice = async (token, { ...formdata }) => {
    const response = await axiosInstance.post(`/invoice/create`, formdata, {
        headers: {
            authorization: `Bearer ${token}`
        },
        withCredentials: true
    })
    return response
}
export const getSingleInvoice = async (token, id) => {
    const response = await axiosInstance.get(`/invoice/${id}`, {
        headers: {
            authorization: `Bearer ${token}`
        },
        withCredentials: true
    })
    return response
}
export const deleteInvoice = async (token, id) => {
    const response = await axiosInstance.delete(`/invoice/${id}`, {
        headers: {
            authorization: `Bearer ${token}`
        },
        withCredentials: true
    })
    return response
}

//item route

export const getAllitems = async (token) => {
    const response = await axiosInstance.get('/items/allItems', {
        headers: {
            authorization: `Bearer ${token}`
        },
        withCredentials: true
    })
    return response
}
export const addItem = async (token, formData) => {
    const response = await axiosInstance.post('/items/add-new-item', formData, {
        headers: {
            authorization: `Bearer ${token}`
        },
        withCredentials: true
    })
    return response
}
export const editItemDetail = async (token, itemId) => {
    const response = await axiosInstance.get(`/items/${itemId}/edit`, {
        headers: {
            authorization: `Bearer ${token}`
        },
        withCredentials: true
    })
    return response
}
export const updataEditItem = async (token, itemId, formData) => {
    const response = await axiosInstance.put(`/items/${itemId}/edit`, formData, {
        headers: {
            authorization: `Bearer ${token}`
        },
        withCredentials: true
    })
    return response
}
export const deleteitem = async (token, itemId) => {
    const response = await axiosInstance.get(`/items/${itemId}/deleteItem`, {
        headers: {
            authorization: `Bearer ${token}`
        },
        withCredentials: true
    })
    return response
}