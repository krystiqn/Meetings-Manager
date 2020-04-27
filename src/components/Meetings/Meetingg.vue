<template>
    <v-container>
        <v-layout row wrap v-if="loading">
            <v-flex xs12 class ="loadingCircle">
                <v-progress-circular indeterminate color="lime" :width="7" :size="70" v-if="loading">

                </v-progress-circular>
            </v-flex>
        </v-layout>
        <v-layout row wrap v-else>
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h3>{{meeting.title}}</h3>
                    </v-card-title>
                    <v-img
                            class="white--text align-end"
                            height="200px"
                            :src="meeting.imageUrl"
                    >
                    </v-img>
                    <v-card-text>
                        <div>{{meeting.date | date}} - {{meeting.location}}</div>
                        <div>
                            <app-edit-meeting-date-dialog
                                    :meeting="meeting"
                                    v-if="userIsCreator">

                            </app-edit-meeting-date-dialog>
                            <app-edit-meeting-time-dialog
                                    :meeting="meeting"
                                    v-if="userIsCreator">

                            </app-edit-meeting-time-dialog>
                        </div>
                        <div>{{meeting.description}}</div>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <template v-if ="userIsCreator">
                            <app-edit-meeting-details-dialog :meeting="meeting"></app-edit-meeting-details-dialog>
                        </template>
                    </v-card-actions>
                    <v-card-actions>
                        <app-meeting-register-dialog :meetingId ="meeting.id" v-if = "userIsAuthenticated && !userIsCreator" class = "registration"
                        ></app-meeting-register-dialog>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    export default{
        props: ['id'],
        computed: {
            meeting: function () {
                return this.$store.getters.loadedMeeting(this.id)
            },
            userIsAuthenticated () {
                return this.$store.getters.user !== null && this.$store.getters.user !== undefined
            },
            userIsCreator(){
                if (!this.userIsAuthenticated){
                    return false
                }
                return this.$store.getters.user.id === this.meeting.creatorID
            },
            loading: function() {
                return this.$store.getters.loading
            }
        }
    }
</script>
<style>
    .registration{
        text-align: center;
    }
</style>
