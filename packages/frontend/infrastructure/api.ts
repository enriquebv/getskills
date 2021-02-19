import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/api`
})

import { registerUserDto } from '../dto/register-user.dto';

export const registerUser = (body: registerUserDto) => {
  return instance.post('/user/register', body);
}

export const testPetition = () => {
  instance.get('/user/')
}