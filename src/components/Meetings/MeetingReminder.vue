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
