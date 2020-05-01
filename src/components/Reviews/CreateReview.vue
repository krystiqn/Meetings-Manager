<template>
    <v-container>
        <v-layout>
            <v-flex xs12 sm6 offset-sm3>
                <h3>Create Review</h3>
            </v-flex>
        </v-layout>

        <v-layout row>
            <v-flex s12 mt-10>
                <form @submit.prevent="onCreateReview">
                    <v-layout row>
                        <v-flex s12 sm6 offset-sm3>
                            <v-text-field name="title" label="Title" id="title" v-model="title"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field name="location" label="Location" id="location"
                                          v-model="location"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-textarea name="description" label="Review text" id="description"
                                        v-model="description"></v-textarea>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-rating name="rating" label="Rating" id="rating" v-model="rating" x-large></v-rating>
                        </v-flex>
                    </v-layout>

                    <v-layout row class="mb-8">
                        <v-flex xs12 sm6 offset-sm3>
                            <p></p>
                            <v-btn :disabled="!formIsValid" type="submit" margin="">
                                Create review
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </form>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import moment from 'moment'

    export default {
        data() {
            return {
                title: '',
                location: '',
                description: '',
                rating: 0,
                date: new Date(),
                time: new Date()
            }
        },
        created: function () {
            const dateTime = moment()
            this.date = dateTime.format('YYYY-MM-DD')
            this.time = dateTime.format('HH:mm')
        },
        computed: {
            formIsValid() {
                return this.title !== '' &&
                    this.location !== '' &&
                    this.description !== '' &&
                    this.rating != 0
            },
            submittableDateTime() {
                const date = new Date(this.date)
                if (typeof this.time === 'string') {
                    const hours = this.time.match(/^(\d+)/)[1]
                    const minutes = this.time.match(/:(\d+)/)[1]
                    date.setHours(hours)
                    date.setMinutes(minutes)
                } else {
                    date.setHours(this.time.getHours())
                    date.setMinutes(this.time.getMinutes())
                }
                return date
            }
        },

        methods: {
            onCreateReview() {
                if (!this.formIsValid) {
                    return
                }

                const reviewData = {
                    title: this.title,
                    location: this.location,
                    description: this.description,
                    rating: this.rating,
                    date: this.submittableDateTime
                }
                this.$store.dispatch('createReview', reviewData)
                this.$router.push('/reviews')
            }
        }
    }
</script>


<style scoped>
    h3 {
        text-align: center;
    }
</style>

