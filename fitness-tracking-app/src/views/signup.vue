<template>
    <div class = "signup">
<h1>{{ formTitle }}</h1>

<div v-if="isSignUp">

<form>
    <label for="firstname"> First Name: </label>
    <input type="text" id="firstname" v-model="firstname" required>
    <label for="lastname"> Label Name: </label>
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
<form>
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