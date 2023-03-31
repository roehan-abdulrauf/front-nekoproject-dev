import * as SecureStore from 'expo-secure-store';

const save = async (key, value) => {

    await SecureStore.setItemAsync(key, value)
     .then(()=>{
        alert('Vous êtes connectés')
     })
     .catch((error)=>{
        console.log(error);
     })
}


const getItem = async (key) => {

    let result = await SecureStore.getItemAsync(key);

    if(result){
        
        return result
    } else {
        alert('Invalid key');
    }
}



export {save, getItem }