import axios from "axios";
import IP_ADRESS from "./env";

export const updatePhotoUser = (photoUpdate, token) => {

    let message = "";

    axios.put(`http://${IP_ADRESS}:5000/api/users/me/update`, {
        image: photoUpdate,

    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((res) => {
            console.log("Email modifié.");
            return message = "image modifié.";
        })
        .catch((e) => {
            console.log(e);
            console.log(e.data);
            console.log("Modif image echouée.");
        })
}