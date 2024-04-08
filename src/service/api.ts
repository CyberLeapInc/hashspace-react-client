import axios from "axios";

const ApiPrefix = 'https://api.test.hashspace.dev/'
const ApiPrefixProd = 'https://api.hashspace.com/';

const api = axios.create({
    baseURL: ApiPrefix,
})

export const startLogin = function (email: string, captcha: string) {
    return axios.post('/auth/login/start', {
        email,
        captcha
    })
}

export const getLoginCode = function (session_id: string) {
    return axios.post('', {
        session_id
    })
}