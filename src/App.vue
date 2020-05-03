<template>
  <v-app>

    <v-navigation-drawer fixed absolute temporary v-model="sideNav" color ="light-green lighten-3">
      <v-list nav dense>
        <v-list-item-group
                active-class="border" color="light-green darken-4">
          <v-list-item v-for="item in menuItems"
                       :key="item.title"
                       :to ="item.link">
            <v-list-item-action>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-item-action>
            <v-list-item-content>{{item.title}}</v-list-item-content>
          </v-list-item>
          <v-list-item v-if="userIsAuthenticated" @click ="onLogout">
            <v-list-item-action>
              <v-icon>mdi-application-export</v-icon>
            </v-list-item-action>
            <v-list-item-content>Logout</v-list-item-content>
          </v-list-item>

        </v-list-item-group>
      </v-list>


    </v-navigation-drawer>
    <div>
      <v-toolbar
              color ="lime darken-2"
              dense>
        <v-app-bar-nav-icon
                @click.stop ="sideNav = !sideNav"
                class="hidden-sm-and-up"
        ></v-app-bar-nav-icon>
        <v-toolbar-title>
          <router-link to="/" tag="span" style="cursor: pointer">Meetings Manager</router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-toolbar-items class="hidden-xs-only">
          <v-btn text v-for="item in menuItems" :key="item.title" :to ="item.link">
            <v-icon left dark>{{item.icon}}</v-icon>
            {{item.title}}
          </v-btn>
          <v-btn text v-if="userIsAuthenticated" @click ="onLogout">
            <v-icon left dark>mdi-application-export</v-icon>
            Logout
          </v-btn>
        </v-toolbar-items>

      </v-toolbar>
    </div>
    <main>
      <router-view></router-view>
      <MeetingReminder
              :meetings="meetings"
              :meetingReminderVisibility="meetingReminderVisibility"
              v-on:closeMeetingReminder="closeMeetingReminder"
      />
    </main>
  </v-app>
</template>

<script>
  import {mapState} from "vuex";
  import * as firebase from 'firebase'
  import MeetingReminder from "./components/Meetings/MeetingReminder";
  export default {
    name: 'App',

    components: {
      MeetingReminder
      //
    },

    data: () => ({
      meetings: [],
      meetingReminderVisibility: false,
      sideNav: false
    }),
    computed:{
      ...mapState(['user']),
      menuItems(){
        let menuItems = [
          {icon: 'mdi-face', title: 'Sign up', link: '/signup'},
          {icon: 'mdi-pen-plus', title: 'Sign in', link: '/signin'},
        ]
        if (this.userIsAuthenticated) {
          menuItems = [
            {icon: 'mdi-calendar', title: 'View meetings', link: '/meetings'},
            {icon: 'mdi-map-marker-outline', title: 'Organize meeting', link: '/createMeeting'},
            {icon: 'mdi-account', title: 'Profile', link: '/profile'},
            {icon: 'mdi-google-maps', title: 'Map', link: '/map'},
          ]
        }
        return menuItems
      },
      userIsAuthenticated(){
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      }
    },
    methods:{
      closeMeetingReminder (value) {
        this.meetingReminderVisibility = value
      },
      formatDate (date) {
        const d = date
        let month = '' + (d.getMonth() + 1)
        let day = '' + d.getDate()
        const year = d.getFullYear()

        if (month.length < 2) {
          month = '0' + month
        }
        if (day.length < 2) {
          day = '0' + day
        }
        return [year, month, day].join('-')
      },
      onLogout(){
        this.$store.dispatch('logout')
      }
    },
    watch: {
      user: {
        handler: function (value) {
          if (value.registeredMeetings.length > 0) {
            value.registeredMeetings.forEach(meeting => {
              firebase.database().ref('meetings').once('value')
                      .then((data)=>{
                        const today = this.formatDate(new Date())
                        const obj = data.val()
                        for(let key in obj){
                          if (meeting === key && obj[key].date.substring(0, 10) === today) {
                            this.meetings.push({
                              title: obj[key].title,
                              date: obj[key].date.substring(11, 16),
                              location: obj[key].location
                            })
                          }
                        }
                        this.meetingReminderVisibility = true
                      })
                      .catch((error)=>{
                        console.log(error)
                      })
            })
          }
        },
        deep: true
      }
    }
  };
</script>
