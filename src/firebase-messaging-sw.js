importScripts('https://www.gstatic.com/firebasejs/7.4.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.4.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyCujHg9GtN8Uxi-JcCN8zggvXlfNQRKc04",
    authDomain: "push-notification-test2-56dac.firebaseapp.com",
    projectId: "push-notification-test2-56dac",
    storageBucket: "push-notification-test2-56dac.appspot.com",
    messagingSenderId: "1004369687552",
    appId: "1:1004369687552:web:a6cc20625e05520a37d4e5"
});

const messaging = firebase.messaging();