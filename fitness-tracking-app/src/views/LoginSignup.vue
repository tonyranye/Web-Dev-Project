<template>
    <div class = "signup">
<h1>{{ formTitle }}</h1>

<div v-if="isSignUp">

<form @submit.prevent="handleSubmit">

    <label for="firstname"> First Name: </label>
    <input type="text" id="firstname" v-model="firstname" required>
    <label for="lastname"> Last Name: </label>
    <input type="text" id="lastname" v-model="lastname" required>
    <label for="username">Username:</label>
    <input type="text" id="username" v-model="username" required>
    <label for="password"> Password:</label>
    <input type="password" id="password" v-model="password" required>
    <button type= "submit"> Sign up</button>
    <button type="button" @click="toggleForm">Already have an account? Log in</button>
</form>

</div>

<div v-else>
<form @submit.prevent="handleSubmit">
    <label for="username">Username:</label>
    <input type="text" id="username" v-model="username" required>
    <label for="password"> Password:</label>
    <input type="password" id="password" v-model="password" required>
    <button type= "submit"> Log in</button>
    <button type="button" @click="toggleForm">Don't have an account? Sign up</button>
</form>

</div>

    </div>
</template>

<script>
import { supabase } from '@/lib/supabase';
import Navbar from '../components/navbar.vue'

export default{
    data(){
        return{
            isSignUp: true,
            email: '',
            password: '',
            firstname: '',
            lastname: '',
        }
    },
    methods: {
        toggleForm(){
            this.isSignUp = !this.isSignUp;
        },
        async handleSubmit(){
            if(this.isSignUp){
                // Handle sign up logic
                console.log('Signing up...');

                const {data, error} = await supabase.auth.signUp({
                    email: this.email,
                    password: this.password,
                });

                if (error) {
                    console.error('Error signing up:', error.message);
                    return;
                }

                const user = data.user;

                // create profile row
                await superbase.from('profiles').insert({
                    id: user.id,
                    first_name: this.firstname,
                    last_name: this.lastname,
                    email: this.email
                })
                this.$router.push('/profile')
            } else {
                // Handle log in logic
                console.log('Logging in...');

                const {data, error} = await supabase.auth.signInWithPassword({
                    email: this.email,
                    password: this.password,
                })

                if(error){
                    console.error('Error logging in:', error.message);
                }

                this.$router.push('/profile')
            }
        }
    },
    computed: {
        formTitle(){
            return this.isSignUp ? 'Sign Up' : 'Log In';
        }

    }
}

</script>




<style>
</style>