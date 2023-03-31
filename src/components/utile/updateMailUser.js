import axios from "axios";
import IP_ADRESS from "./env";

export const updateMailUser = (mailUpdate, token) => {

    let message = "";

    axios.put(`http://${IP_ADRESS}:5000/api/users/me/update`,{
                mail: mailUpdate,
                
            },{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
             .then((res)=>{
                console.log("Email modifié."); 
                return message = "Email modifié.";
            })
             .catch((e) => {
                console.log(e);
                console.log(e.data);
                console.log("Modif email echouée.");
            })
}