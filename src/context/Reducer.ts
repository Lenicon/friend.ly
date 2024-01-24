
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
                    uProfile: action.payload.auth.uProfile,
                    desc: action.payload.auth.desc,
                    tags: action.payload.auth.tags
                },
                user: action.payload.user
            };
        case "UPDATE_USER":
            return {
                ...state,
                auth: {
                    profile: action.payload.profile?.url,
                    fname: action.payload.fname,
                    lname: action.payload.lname,
                },
                user: {
                    profile: action.payload.profile,
                    fname: action.payload.fname,
                    lname: action.payload.lname
                },
            };
        case "LOAD_USERS":
            return{
                ...state,
                users: action.payload
            };
        case "LOAD_CHATS":
            return{
                ...state,
                chats: action.payload
            };
        case "SET_CURRENT_CHAT":
            return{
                ...state,
                currentChat: action.payload
            };
        case "LOGOUT":
            return {
                ...state,
                auth: null,
                user: null
            };
        default: return state;
    }
}