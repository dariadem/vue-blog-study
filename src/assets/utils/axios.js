import axios from 'axios'

// create default axios config
export const http = axios.create({
	baseURL: 'https://jsonplaceholder.typicode.com/',
	headers: {
		"Content-type": "application/json; charset=UTF-8"
	}
})