import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loadedMeetings: [],
        loadedReviews: [],
        user: null,
        loading: false,
        error: null,
    },
    mutations: {
        registerUserForMeeting(state, payload) {
            const id = payload.id
            if (state.user.registeredMeetings.findIndex(meeting => meeting.id === id) >= 0) {
                return
            }
            state.user.registeredMeetings.push(id)
            state.user.fbKeys[id] = payload.fbKey
        },
        unregisterUserFromMeeting(state, payload) {
            const registeredMeetings = state.user.registeredMeetings
            registeredMeetings.splice(registeredMeetings.findIndex(meeting => meeting.id === payload), 1)
            Reflect.deleteProperty(state.user.fbKeys, payload)
        },
        setLoadedMeeting(state, payload) {
            state.loadedMeetings = payload
        },
        createMeeting(state, payload) {
            state.loadedMeetings.push(payload)
        },
        setUser(state, payload) {
            state.user = payload
        },
        setLoading(state, payload) {
            state.loading = payload
        },
        setError(state, payload) {
            state.error = payload
        },
        clearError(state) {
            state.error = null
        },
        setCreatedMeetingKey(state, payload) {
            state.createdMeetingKey = payload
        },
        updateMeeting(state, payload) {
            const meeting = state.loadedMeetings.find(meeting => {
                return meeting.id === payload.id
            })
            if (payload.title) {
                meeting.title = payload.title
            }
            if (payload.description) {
                meeting.description = payload.description
            }
            if (payload.date) {
                meeting.date = payload.date
            }
        },
        createReview(state, payload) {
            state.loadedReviews.push(payload)
        },
        setLoadedReview(state, payload) {
            state.loadedReviews = payload
        },
        setCreatedReviewKey(state, payload) {
            state.createdReviewKey = payload
        }
    },
    actions: {
        registerUserForMeeting({commit, getters}, payload) {
            commit('setLoading', true)
            const user = getters.user;
            firebase.database().ref('/users/' + user.id).child('/registrations')
                .push(payload)
                .then(data => {
                    commit('setLoading', false)
                    commit('registerUserForMeeting', {id: payload, fbKey: data.key})
                })
                .catch(error => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        unregisterUserFromMeeting({commit, getters}, payload) {
            commit('setLoading', true)
            const user = getters.user
            if (!user.fbKeys) {
                return
            }
            const fbKey = user.fbKeys[payload]
            firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
                .remove()
                .then(() => {
                    commit('setLoading', false)
                    commit('unregisterUserFromMeeting', payload)
                })
                .catch(error => {
                    console.log(error)
                    commit('setLoading')
                })
        },
        loadMeetings({commit}) {
            commit('setLoading', true)
            firebase.database().ref('meetings').once('value')
                .then((data) => {
                    const meetings = []
                    const obj = data.val()
                    for (let key in obj) {
                        meetings.push({
                            id: key,
                            title: obj[key].title,
                            description: obj[key].description,
                            imageUrl: obj[key].imageUrl,
                            date: obj[key].date,
                            location: obj[key].location,
                            creatorID: obj[key].creatorID
                        })
                    }
                    commit('setLoadedMeeting', meetings)
                    commit('setLoading', false)
                })
                .catch((error) => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        createMeeting({commit, getters}, payload) {
            const meeting = {
                title: payload.title,
                location: payload.location,
                description: payload.description,
                date: payload.date.toISOString(),
                creatorID: getters.user.id,
                createdMeetingKey: '',
            }
            let imageUrl
            let key
            firebase.database().ref('meetings').push(meeting)
                .then((data) => {
                    const key = data.key
                    return key
                })
                .then(key => {
                    const filename = payload.image.name
                    const ext = filename.slice(filename.lastIndexOf('.'))
                    commit('setCreatedMeetingKey', key)
                    return firebase.storage().ref('meetings/' + key + '.' + ext).put(payload.image)
                })
                .then(fileData => {
                    let fullPath = fileData.metadata.fullPath
                    return firebase.storage().ref(fullPath).getDownloadURL()
                })
                .then(URL => {
                    imageUrl = URL
                    key = getters.createdMeetingKey
                    return firebase.database().ref('meetings').child(key).update({imageUrl: imageUrl})
                })
                .then(() => {
                    commit('createMeeting', {
                        ...meeting,
                        imageUrl: imageUrl,
                        id: key
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
            //reach out to firebase and store it
        },
        updateMeetingData({commit}, payload) {
            commit('setLoading', true)
            const updateObj = {}
            if (payload.title) {
                updateObj.title = payload.title
            }
            if (payload.description) {
                updateObj.description = payload.description
            }
            if (payload.date) {
                updateObj.date = payload.date
            }
            firebase.database().ref('meetings').child(payload.id).update(updateObj)
                .then(() => {
                    commit('updateMeeting', payload)
                    commit('setLoading', false)
                })
                .catch(error => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        loadReviews({commit}) {
            commit('setLoading', true)
            firebase.database().ref('reviews').once('value')
                .then((data) => {
                    const reviews = []
                    const obj = data.val()
                    for (let key in obj) {
                        reviews.push({
                            id: key,
                            title: obj[key].title,
                            description: obj[key].description,
                            rating: obj[key].rating,
                            date: obj[key].date,
                            location: obj[key].location,
                            creatorID: obj[key].creatorID,
                        })
                    }
                    commit('setLoadedReview', reviews)
                    commit('setLoading', false)
                })
                .catch((error) => {
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        createReview({commit, getters}, payload) {
            const review = {
                title: payload.title,
                location: payload.location,
                description: payload.description,
                rating: payload.rating,
                date: payload.date.toISOString(),
                creatorID: getters.user.id,
                createdReviewKey: '',
            }

            let key
            firebase.database().ref('reviews').push(review)
                .then((data) => {
                    const key = data.key
                    return key
                })
                .then(key => {
                    //const filename = payload.image.name
                    //const ext = filename.slice(filename.lastIndexOf('.'))
                    commit('setCreatedReviewKey', key)
                    //return firebase.storage().ref('meetings/' + key + '.' + ext).put(payload.image)
                })

                .then(() => {
                    commit('createReview', {
                        ...review,

                        id: key
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
            //reach out to firebase and store it
        },
        signUserUp({commit}, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(
                    user => {
                        commit('setLoading', false)
                        const newUser = {
                            id: user.user.uid,
                            registeredMeetings: [],
                            fbKeys: {}
                        }
                        commit('setUser', newUser)
                    }
                )
                .catch(
                    error => {
                        commit('setLoading', false)
                        commit('setError', error)
                        console.log(error)
                    }
                )
        },
        signUserIn({commit}, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
                .then(
                    user => {
                        commit('setLoading', false)
                        const newUser = {
                            id: user.user.uid,
                            registeredMeetings: [],
                            fbKeys: {}
                        }
                        commit('setUser', newUser)
                    }
                )
                .catch(
                    error => {
                        commit('setLoading', false)
                        commit('setError', error)
                        console.log(error)
                    }
                )
        },
        autoSignIn({commit}, payload) {
            commit('setUser', {
                id: payload.uid,
                registeredMeetings: [],
                fbKeys: {}
            })
        },
        fetchUserData({commit, getters}) {
            commit('setLoading', true)
            firebase.database().ref('/users/' + getters.user.id + '/registrations/').once('value')
                .then(data => {
                    const values = data.val()
                    let registeredMeetings = []
                    let swappedPairs = {}
                    for (let key in values) {
                        registeredMeetings.push(values[key])
                        swappedPairs[values[key]] = key
                    }
                    const updatedUser = {
                        id: getters.user.id,
                        registeredMeetings: registeredMeetings,
                        fbKeys: swappedPairs
                    }
                    commit('setLoading', false)
                    commit('setUser', updatedUser)
                })
                .catch(error => {
                        console.log(error)
                        commit('setLoading', false)
                    }
                )
        },
        logout({commit}) {
            firebase.auth().signOut()
            commit('setUser', null)
        },
        clearError({commit}) {
            commit('clearError')
        }
    },
    getters: {
        loadedMeetings(state) {
            return state.loadedMeetings.sort((meetingA, meetingB) => {
                return meetingA.date > meetingB.date
            })
        },
        featuredMeetings(state, getters) {
            return getters.loadedMeetings.slice(0, 5)
        },
        loadedMeeting(state) {
            return (meetingId) => {
                return state.loadedMeetings.find((meeting) => {
                    return meeting.id == meetingId
                })
            }
        },
        user(state) {
            return state.user
        },
        loading(state) {
            return state.loading
        },
        error(state) {
            return state.error
        },
        createdMeetingKey(state) {
            return state.createdMeetingKey
        },
        loadedReviews(state) {
            return state.loadedReviews.sort((reviewA, reviewB) => {
                return reviewA.date > reviewB.date
            })
        },
        loadedReview(state) {
            return (reviewId) => {
                return state.loadedReviews.find((review) => {
                    return review.id == reviewId
                })
            }
        },
        createdReviewKey(state) {
            return state.createdReviewKey
        }

    }
})
