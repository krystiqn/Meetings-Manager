<template>
    <v-dialog
            persistent
            v-model="meetingReminderVisibility"
            :max-width="meetingReminderWidth"
    >
        <div id="information-dialog-card">
            <h3 v-for="meeting in meetings" :key="meeting.index">Masz dziś spotkanie {{meeting.title}} o {{meeting.date}} w {{meeting.location}}</h3>
            <div class="row">
                <v-btn @click="closeMeetingReminder" class="teal--text font-weight-bold" rounded color="#EEEEEE" dark>OK
                </v-btn>
            </div>
        </div>
    </v-dialog>
</template>

<script>
    export default {
        name: 'MeetingReminder',
        props: {
            meetingReminderVisibility: Boolean,
            meetings: Array
        },
        methods: {
            closeMeetingReminder () {
                this.$emit('closeMeetingReminder', false)
            }
        },
        computed: {
            meetingReminderWidth () {
                if (this.$vuetify.breakpoint.xsOnly) {
                    return 60 + '%'
                } else {
                    return 50 + '%'
                }
            }
        }
    }
</script>

<style scoped>
    #information-dialog-card {
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 1rem;
        background: gray;
        overflow-y: hidden;
    }
    h3 {
        font-style: normal;
        font-weight: 500;
        text-align: center;
    }
    .row {
        margin-right: 0;
        margin-left: 0;
        margin-bottom: 0.5rem;
        flex-direction: row;
        align-content: center;
        justify-content: center;
        width: 100%;
        padding-top: 0.5rem;
        text-align: center;
        padding-bottom: 0.3rem;
    }
</style>
