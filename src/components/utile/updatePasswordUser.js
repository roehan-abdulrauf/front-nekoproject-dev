import axios from "axios";
import IP_ADRESS from "./env";
import { useAuth } from "./AuthContext";

export const updatePasswordUser = (passwordUpdate, token) => {

    
    let message = "";

    axios.put(`http://${IP_ADRESS}:5000/api/users/me/update`,{
                password: passwordUpdate,
                
            },{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
             .then((res)=>{
                console.log(res);
                console.log("Mot de passe modifié."); 
                return message = "Mot de passe modifié."
            })
             .catch((e) => {
                console.log(e);
                console.log(e.data);
                console.log("Modif mot de passe echouée.");
                return e.response.data.message;
            })
}