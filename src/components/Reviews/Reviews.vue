<template>
    <v-container>
        <v-layout row wrap v-for="review in reviews" :key="review.id" class="mb-3">
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>

                <v-card color="lime lighten-4 mb-5">
                    <v-card-title>{{review.title}}</v-card-title>
                    <v-card-subtitle>{{review.location}}</v-card-subtitle>
                    <v-card-text>{{ review.description }}</v-card-text>
                    <v-rating :value="review.rating" x-large></v-rating>
                    <v-card-text class="text--primary">
                        <div>{{review.date | date}}</div>
                    </v-card-text>
                </v-card>

            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {

        computed: {
            reviews() {
                return this.$store.getters.loadedReviews
            }
        }
    }
</script>

<style scoped>

</style>
