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
            username: '',
            password: '',
            firstname: '',
            lastname: '',
        }
    },
    methods: {
        toggleForm(){
            this.isSignUp = !this.isSignUp;
        },
        handleSubmit(){
            if(this.isSignUp){
                // Handle sign up logic
                console.log('Signing up...');
                supabase.auth.signUp({
                    email: this.username,
                    password: this.password,
                    options: {
                        data: {
                            first_name: this.firstname,
                            last_name: this.lastname,
                        }
                    }
                }).then(({ user, error }) => {
                    if (error) {
                        console.error('Error signing up:', error.message);
                    } else {
                        console.log('User signed up:', user);
                        // Optionally, you can redirect the user to the homepage or profile page
                        this.$router.push('/profile')
                    }
                });

            } else {
                // Handle log in logic
                console.log('Logging in...');
                supabase.auth.signInWithPassword({
                    email: this.username,
                    password: this.password,
                }).then(({user, error}) => {
                    if(error){
                        console.error('Error logging in:', error.message);
                    } else{
                        console.log('User logged in:', user);
                        // Optionally, you can redirect the user to the homepage or profile page
                        this.$router.push('/profile')
                    }
                    }
                );
                

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




<style></style>