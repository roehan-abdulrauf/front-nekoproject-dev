import axios from "axios";
import IP_ADRESS from "./env";

export const updatePseudoUser = (pseudoUpdate, token) => {

    let message = "";
    
    axios.put(`http://${IP_ADRESS}:5000/api/users/me/update`,{
                pseudo: pseudoUpdate,
                
            },{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
             .then((res)=>{
                console.log(res);
                console.log("Pseudo modifié.");
                return message = "Pseudo modifié."
            })
             .catch((e) => {
                console.log(e);
                console.log(e.data);
                console.log("Modif pseudo echouée.");
            })
}