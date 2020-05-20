import Vue from 'vue'
import App from './App.vue'
import * as firebase from 'firebase'
import vuetify from './plugins/vuetify';
import router from './router'
import {store} from './store'
import DateFilter from './filter/date'
import AlertCmp from './components/shared/alert.vue'
import EditMeetingDetailsDialog from "./components/Meetings/Edit/EditMeetingDetailsDialog"
import EditMeetingDateDialog from "./components/Meetings/Edit/EditMeetingDateDialog";
import EditMeetingTimeDialog from "./components/Meetings/Edit/EditMeetingTimeDialog";
import RegisterDialog from "./components/Meetings/registration/RegisterDialog";
import * as VueGoogleMaps from "vue3-google-maps"


Vue.config.productionTip = false
Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-meeting-details-dialog', EditMeetingDetailsDialog)
Vue.component('app-edit-meeting-date-dialog', EditMeetingDateDialog)
Vue.component('app-edit-meeting-time-dialog', EditMeetingTimeDialog)
Vue.component('app-meeting-register-dialog', RegisterDialog)

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBgXIx-n0nMHD6c5sXSl4b3V2QD6BX0MfI",
    libraries: "places",
    v: 3.38
  }
})

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({

      apiKey: 'AIzaSyBMmrQxbK94voaSDs9nKoDLAFR7J7QrW8k',
      authDomain: 'proba-c6835.firebaseapp.com',
      databaseURL: 'https://proba-c6835.firebaseio.com',
      projectId: 'proba-c6835',
      storageBucket: 'proba-c6835.appspot.com',
    })
    firebase.auth().onAuthStateChanged((user)=> {
      if (user){
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
      }
    })
    this.$store.dispatch('loadMeetings')
    this.$store.dispatch('loadReviews')
  }
}).$mount('#app')



