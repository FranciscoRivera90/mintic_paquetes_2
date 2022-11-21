// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCjuAI3zLQs1anwfwF1I2ZJaulgXGtoZFY",
    authDomain: "minticpaquetes.firebaseapp.com",
    projectId: "minticpaquetes",
    storageBucket: "minticpaquetes.appspot.com",
    messagingSenderId: "63668368769",
    appId: "1:63668368769:web:a9583ea28140eba9862480",
    measurementId: "G-D81RJ9ELZN"
});


// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();
