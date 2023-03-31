import axios from "axios";
import IP_ADRESS from "./env";

export const updateBioUser = (bioUpdate, token) => {

    let message = "";

    axios.put(`http://${IP_ADRESS}:5000/api/users/me/update`,{
                bio: bioUpdate,
                
            },{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
             .then((res)=>{
                
                console.log("Bio modifiée."); 
                return message = "Bio modifiée.";
            })
             .catch((e) => {
                console.log(e);
                console.log(e.data);
                console.log("Modif bio echouée.");
            })
}