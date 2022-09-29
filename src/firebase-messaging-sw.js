importScripts('https://www.gstatic.com/firebasejs/7.4.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.4.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyCnKvln5itnrBj62POCPHxshAN_Vmd0zds",
    authDomain: "fashionlogicanotification.firebaseapp.com",
    projectId: "fashionlogicanotification",
    storageBucket: "fashionlogicanotification.appspot.com",
    messagingSenderId: "99855572145",
    appId: "1:99855572145:web:7548c189d61b3bcc92d690",
    measurementId: "G-RQF97ZK7R1"
});

const messaging = firebase.messaging();