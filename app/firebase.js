import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDkiLbc10xshLybv2wp3lfVas6vmDFKIkI",
  authDomain: "my-hackathon-app-fa6aa.firebaseapp.com",
  projectId: "my-hackathon-app-fa6aa",
  storageBucket: "my-hackathon-app-fa6aa.firebasestorage.app",
  messagingSenderId: "240669791919",
  appId: "1:240669791919:web:43ff418c74fdd70ad6665a",
  measurementId: "G-H6JS9YTXBY"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)