import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8081/api'
})

import { registerUserDto } from '../dto/register-user.dto';

export const registerUser = (body: registerUserDto) => {
  return instance.post('/user/register', body); 
}