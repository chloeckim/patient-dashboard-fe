import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider } from "../config/firebase"

export const logOut = async () => {
  signOut(auth)
    .then(() => {
      console.log("Singed out successfully")
    })
    .catch((error) => {
      console.error(error)
    })
}

export const signInWithGoogle = async () => {
  signInWithPopup(auth, googleProvider)
    .then(() => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result)
      console.log("User is signed in")
    })
    .catch((error) => {
      console.log("Error with signin", error)
    })
}
