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
    setDoc
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";

// create user
export const createUserAsync = async(creds)=>{
    try {
        const user = {
            username: creds.username,
            fname: creds.fname,
            lname: creds.lname,
            uscID: creds.uscID,
            email: creds.email,
            desc: "Gay people are cringe.",
            profile: "",
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