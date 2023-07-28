import { Alert } from 'react-native';
import axios from 'axios';
import IP_ADRESS from '../components/utile/env';
import { useAuth } from '../components/utile/AuthContext';

const LogoutUser = ({ token }) => {
    const [user, setUser] = useAuth();
    const data = {};
    const getLogoutHandler = () => {
        return () => {
            Alert.alert(
                'Confirmation de déconnexion',
                'Vous êtes sur le point de vous déconnecter.',
                [
                    {
                        text: 'Annuler',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'Ok',
                        onPress: () => {
                            axios.put(`http://${IP_ADRESS}:5000/api/users/logout`, data, {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                }
                            }).then((res) => {
                                console.log(res);
                                console.log("Vous êtes bien déconnecté.");
                            })
                            setUser(null);
                            // Ici, vous devrez gérer le processus de déconnexion dans votre composant parent
                        },
                    },
                ],
                {
                    cancelable: true,
                    onDismiss: () =>
                        Alert.alert(
                            'Vous ne serez pas déconnecté.',
                        ),
                },
            );
        };
    };

    return getLogoutHandler();
}

export default LogoutUser;
