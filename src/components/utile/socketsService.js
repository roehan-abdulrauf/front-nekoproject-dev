import { io } from "socket.io-client";
import IP_ADRESS from "./env";

const SOCKET_URL = `http://${IP_ADRESS}:5000`; 

class WSService {

    initializeSocket = async () => {

        try {
            // La connexion au serveur se fait ici
            this.socket = io(SOCKET_URL);
            // On affiche un message dans la console si la connexion au serveur est établie
            console.log("Initialisation des websockets");
 
            // on écoute l'évènement 'connection' émis par le serveur et on affiche un message dans la console
            this.socket.on('connection',(data)=>{
                console.log('socket connectées');
            })
            
            // on écoute l'évènement 'disconnect' et on affiche un message dans la console
            this.socket.on('disconnect',(data)=>{
                console.log('socket déconnectées');
            })

            this.socket.on('error',(data)=>{
                console.log('socket error',data);
            })

        } catch (error) {
            console.log("Erreur initialisation des websockets",error);
        }
    }

    emit(event,data = {}){
        this.socket.emit(event,data);
    }

    on(event,cb){
        this.socket.on(event,cb);
    }

    remove(listenerName){
        this.socket.removeListener(listenerName);
    }
    
}

const socketService = new WSService();

export default socketService;