import axios from "axios";

export interface LoginObj {
    loginName: string,
    loginPwd: string,
}
export async function login(loginObj: LoginObj) {
    return await axios.post('/api/user/login', loginObj);
}

export async function whoAmI() {
    console.log('who', document.cookie);
    return await axios.get('/api/user/whoAmI');
}

export async function exit() {
    const res = await axios.get('/api/user/exit');
    console.log('who', document.cookie);
    return res;
}
