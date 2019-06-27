import axios from 'axios'

const instance = axios.create({
    baseURL:'https://burger-builder-de672.firebaseio.com/'
})

export default instance