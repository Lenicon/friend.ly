
export const Reducer = (state, action) => {
    switch(action.type){
        case "LOGIN":
            return {
                ...state,
                auth: {
                    id: action.payload.auth.uid,
                    username: action.payload.auth.displayName,
                    profile: action.payload.auth.photoURL,
                    email: action.payload.auth.email,
                    fname: action.payload.auth.fname,
                    lname: action.payload.auth.lname,
                    uscID: action.payload.auth.uscID,
                    admin: action.payload.auth.admin,
                },
                user: action.payload.user
            }
        case "UPDATE_USER":
            return {
                ...state,
                auth: {
                    profile: action.payload.auth.profile,
                    fname: action.payload.auth.fname,
                    lname: action.payload.auth.lname,
                },
                user: {
                    
                }
            }
        case "LOGOUT":
            return {
                ...state,
                auth: null,
                user: null
            }
        default: return state;
    }
}