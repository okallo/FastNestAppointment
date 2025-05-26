import axios from "axios";

export async function registerUser(data: any) {
  return await axios.post('http://localhost:8000/api/users', data)
}