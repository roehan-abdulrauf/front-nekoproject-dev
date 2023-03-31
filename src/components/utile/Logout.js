import axios from "axios";
import IP_ADRESS from './env';

const data = {};
export const Logout = (token) => {
    axios.put(`http://${IP_ADRESS}:5000/api/users/logout`, data, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    },).then((res) => {
        console.log(res);
        console.log("Vous ètes bien deconnecté.");
    })
}