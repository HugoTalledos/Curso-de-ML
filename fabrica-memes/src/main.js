import Vue from 'vue'
import App from './App.vue'
import { firestorePlugin } from 'vuefire'
import * as firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/storage'
import router from './router/index'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

 var firebaseConfig = {
    apiKey: "AIzaSyB0KNhVGp7KKQ1XzwAkXolE_oQHe9RgJlY",
    authDomain: "fabrica-memes-339c6.firebaseapp.com",
    databaseURL: "https://fabrica-memes-339c6.firebaseio.com",
    projectId: "fabrica-memes-339c6",
    storageBucket: "fabrica-memes-339c6.appspot.com",
    messagingSenderId: "531593141825",
    appId: "1:531593141825:web:d69ae0c2ef013ec89570c0",
    measurementId: "G-NHMSSLWMRS"
  };
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig)

  export const firestore = firebaseApp.firestore()
  export const storage = firebase.storage().ref('/images')

  Vue.use(firestorePlugin)

new Vue({
  render: h => h(App),
  router,
  vuetify,
  components: { App }
}).$mount('#app')
