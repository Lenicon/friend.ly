import { onAuthStateChanged } from "firebase/auth"
import { getUserAsync, getUsersAsync } from "../services/chatServices"
import {auth} from "../config/firebase";
import { logoutAsync } from "../services/authServices";

export const signIn = ({auth, user}) => {
    return {type: "LOGIN", payload: {auth, user}}
}

export const signOut = () => {
    return {type: "LOGOUT"}
}

export const updateProfile = (user) => {
    return {type: "UPDATE_USER", payload: user};
}

export const updateMatches = (user) => {
    return {type: "UPDATE_MATCHES", payload: user};
}

export const loadUsers = (users)=>{
    return {type: "LOAD_USERS", payload: users}
}

export const checkAuthUser = (dispatch) => {
    return onAuthStateChanged(auth, async(authUser)=>{
        if(authUser){
            const user_res = await getUserAsync(authUser.uid);
            const users_res = await getUsersAsync(authUser)
            if (user_res){
                dispatch(signIn({auth: authUser, user: user_res}))
            }
            if (users_res) {
                dispatch(loadUsers(users_res));
            }
        } else {
            // no user = logout
            await logoutAsync();
        }
    });
};