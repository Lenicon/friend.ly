import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {auth, firestore as db, storage } from "../config/firebase";
import {
    serverTimestamp,
    collection,
    getDoc,
    addDoc,
    arrayUnion, 
    updateDoc, 
    deleteDoc, 
    doc, 
    setDoc,
    query,
    where,
    getDocs,
    orderBy,
    limit
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";

// create user
export const createUserAsync = async(creds)=>{
    try {
        const user = {
            username: creds.username,
            fname: creds.fname,
            lname: creds.lname,
            block: creds.block,
            uscID: creds.uscID,
            email: creds.email,
            desc: creds.desc,
            tags: creds.tags,
            uProfile: creds.uProfile,
            profile: creds.profileImage,
            isAdmin: false,
            createdAt: serverTimestamp(),
        }
        return await setDoc(doc(db, "users", creds.uid), user);
    } catch (error) {
        console.log(error);
    }
}

// update user
export const updateUserAsync = async(updatedUser, profileImage) => {
    try {
        const creds = auth.currentUser;
        const userDoc = doc(db, "users", creds.uid);
        // update the profile image if not null
        if (profileImage) {
            const location = `/images/users/${creds.uid}/profile/`;
            const urls = await uploadFiles([profileImage], location);
            if (urls.length > 0){
                updatedUser.profile = urls[0];
                await updateProfile(creds, {
                    photoURL: urls[0].url,
                    displayName: updatedUser.username,
                });
            }
        }
        
        await updateDoc(userDoc, updatedUser);
        const snapshot = await getDoc(userDoc);
        return getSnapshotData(snapshot);
    
    } catch (error) {
        console.log(error)
    }
}

// delete user

// get all users
export const getUsersAsync = async (user) => {
    if (!user) return;
    try {
        const snapshots = await getDocs(
            query(collection(db, "users"), where("email","!=", user.email))
        );
        const users = snapshots.docs.map((item)=> getSnapshotData(item));
        return users;
    } catch (error) {
        console.log(error)
    }
}

// get user
export const getUserAsync = async (id) => {
    try {
        const userDoc = doc(db, "users", id);
        const snapshot = await getDoc(userDoc);
        return getSnapshotData(snapshot);
    } catch (error) {
        console.log(error);
    }
};

// conversations
export const createConversationAsync = async(userId, friendId)=>{
    try {
        
        const conv = {
            members: [userId, friendId],
            last: {message: "", createdAt: null},
            createdAt: serverTimestamp()
        };

        const convDoc = await addDoc(collection(db, "conversations"), conv)
        let result = null;
        const convId = convDoc.id;
        if (convId){
            // get friend infos
            const userDoc = doc(db, "users", friendId);
            const user_res = await getDoc(userDoc);
            const user_data = getSnapshotData(user_res);
            console.log("bruh",user_data);

            const res_conv = await getDoc(convDoc);
            if(res_conv){
                result = {
                    ...res_conv.data(),
                    id: convId,
                    friend: {
                        id: user_data.id,
                        username: user_data.username,
                        fname: user_data.fname,
                        lname: user_data.lname,
                        profile: user_data.profile,
                        uProfile: user_data.uProfile,
                        desc: user_data.desc,
                        tags: user_data.tags,
                    }
                }
            }
        }
        
        // return convo w contact infos
        return result;
    } catch (error) {
        console.log(error)
    }
}

// Messages

export const createMessageAsync = async(message, images)=>{
    try {
        if (images.length > 0){
            // upload images first
            const location = `/images/messages/${message.conversationId}/`;
            const urls = await uploadFiles(images, location);
            if(urls.length > 0){
                message.images = arrayUnion(...urls);
            } else {
                message.images = arrayUnion();
            }
        }

        const newMessage = {
            ...message, createdAt: serverTimestamp()
        }

        const msgDoc = await addDoc(collection(db, "messages"), newMessage);
        const messageId = msgDoc.id;
        if (messageId){
            const msg_res = await getDoc(msgDoc);
            const msg = getSnapshotData(msg_res);
            // update conversation last message
            const convDoc = doc(db, "conversations", msg.conversationId);
            await updateDoc(convDoc, {
                last: {
                    message: msg.message,
                    createdAt: msg.createdAt
                },
            });
            return msg;
        }
    } catch (error) {
        console.log(error)
    }
}

export const getMsgQueryByConversationId = (convId)=>{
    return query(
        collection(db, "messages"),
        where("conversationId", "==", convId),
        limit(20)
    );
}

export const getConversationsQueryByUser = (userId)=>{
    return query(
        collection(db, "conversations"),
        where("members", "array-contains", userId),
        limit(10)
    );
}

// helper functions

const uploadFiles = async(files, location)=>{
    let filesUrls = [];
    for (const item of files){
        const storageRef = ref(storage, `${location}${item.filename}`);
        const uploadTask = await uploadBytes(storageRef, item.file);
        const downloadURL = await getDownloadURL(uploadTask.ref);
    
        filesUrls.push({
            origin: item.origin,
            filename: item.filename,
            url: downloadURL
        });
    }
    return filesUrls;
}

export const getSnapshotData = (snapshot) => {
    if(!snapshot.exists) return undefined;
    const data = snapshot.data();
    return {...data, id:snapshot.id};
}