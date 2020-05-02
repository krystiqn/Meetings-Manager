<template>
    <v-container>

            <div class="text-center">
                <v-btn router to="/meetings" color="lime lighten-4" class="ma-2">Explore Meetings</v-btn>
                <v-btn router to="createMeeting" color="lime lighten-4" class="ma-2">Organize Meeting</v-btn>
                <v-btn router to="/reviews" color="lime lighten-4" class="ma-2">View Reviews</v-btn>
                <v-btn router to="createReview" color="lime lighten-4" class="ma-2">Create Review</v-btn>
            </div>

        <v-layout>
            <v-flex xs12 class="loadingCircle">
                <v-progress-circular indeterminate color="lime" :width="7" :size="70" v-if="loading">

                </v-progress-circular>
            </v-flex>
        </v-layout>
        <v-layout row wrap class="mt-2" v-if="!loading">
            <v-flex xs12>
                <v-carousel style="cursor:pointer">
                    <v-carousel-item
                            v-for="meeting in meetings"
                            :key="meeting.id"
                            :src="meeting.imageUrl"
                            reverse-transition="fade-transition"
                            transition="fade-transition"
                            @click.native="onLoadMeeting(meeting.id)">
                        <div class="title">
                            {{meeting.title}}
                        </div>
                    </v-carousel-item>
                </v-carousel>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        computed: {
            meetings: function () {
                return this.$store.getters.featuredMeetings
            },
            loading: function () {
                return this.$store.getters.loading
            }

        },
        methods: {
            onLoadMeeting(id) {
                this.$router.push('/meetings/' + id);

            }
        }
    }
</script>

<style scoped>
    .title {
        text-align: center;
        bottom: 50px;
        background-color: rgba(0, 0, 0, 0.3);
        color: white;
        font-size: 2em;
        padding: 20px;
        text-align: center;
    }

    .loadingCircle {
        text-align: center;
    }
</style>
