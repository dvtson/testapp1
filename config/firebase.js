import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC6g2dPMSfZCXNvxptZDi295UOcemZtoZI",
  authDomain: "fir-rlos.firebaseapp.com",
  projectId: "fir-rlos",
  storageBucket: "fir-rlos.firebasestorage.app",
  messagingSenderId: "1047895061493",
  appId: "1:1047895061493:web:f5d34a1fd9560cc93a26bc"
};

const app = initializeApp(firebaseConfig);

// Sửa lỗi Firestore addDoc quay vòng tròn vô tận trên React Native Expo bằng cách bật Long Polling
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export const storage = getStorage(app);
export const auth = getAuth(app);
