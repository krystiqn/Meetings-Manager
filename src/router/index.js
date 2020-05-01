import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../components/home'
import Meetings from '../components/Meetings/Meeting'
import CreateMeeting from '../components/Meetings/CreateMeeting'
import Reviews from '../components/Reviews/Reviews'
import CreateReview from '../components/Reviews/CreateReview'
import Profile from '../components/User/Profile'
import Signup from '../components/User/Signup'
import Signin from '../components/User/Signin'
import Meetingg from '../components/Meetings/Meetingg'
import AuthGuard from './auth-guard'
import Map from '../components/Map/map'




Vue.use(VueRouter)




export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: home
    },
    {
      path: '/meetings',
      name: 'Meeting',
      component: Meetings
    },
    {
      path: '/reviews',
      name: 'Reviews',
      component: Reviews
    },
    {
      path: '/createMeeting',
      name: 'CreateMeeting',
      component: CreateMeeting,
      beforeEnter: AuthGuard
    },
    {
      path: '/createReview',
      name: 'CreateReview',
      component: CreateReview,
      beforeEnter: AuthGuard
    },
    {
      path: '/meetings/:id',
      name: 'Meetings',
      props: true,
      component: Meetingg
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: AuthGuard
    },
    {
      path: '/signup',
      name: 'Sign up',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Sign in',
      component: Signin
    },
    {
    path: '/map',
    name: 'Map',
    component: Map
  },
  ],
  mode: 'history'
})
