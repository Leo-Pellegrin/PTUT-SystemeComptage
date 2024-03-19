<template>
  <div>
    <v-app-bar color="#0F2C59" :elevation="3">
      <v-app-bar-title>
        <p class="text-h4" v-on:click="$router.push({ path: '/' })">MC Count</p>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn variant="plain" size="x-large" v-on:click="$router.push({ path: '/historique' })">Historique</v-btn>

      <!-- <v-btn icon v-on:click="handleAccountClick()" v-if="connected">
        <v-icon  size="x-large">mdi-account-circle</v-icon>
      </v-btn> -->

      <v-btn variant="plain" size="x-large" v-on:click="openDialogConnect()">Se connecter</v-btn>
      <!-- <v-btn v-else variant="plain" size="x-large" v-on:click="$router.push({path: '/account'})">Se connecter</v-btn> -->
    </v-app-bar>
  </div>

  <v-dialog v-model="dialogConnect" max-width="400px" transition="dialog-top-transition">
    <v-card color="#F8F0E5">
      <div class="d-flex justify-center">
        <v-card-title class="font-weight-bold">Connexion</v-card-title>
      </div>
      <v-card-text color="#DAC0A3">
        <v-form validate-on="submit lazy">
          <v-text-field v-model="email" label="Email" :rules="emailrules" required></v-text-field>
          <v-text-field v-model="password" label="Mot de passe" required :rules="passwordrules"
            :type="show1 ? 'text' : 'password'" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show1 = !show1"></v-text-field>
          <div class="d-flex justify-center">
            <v-btn class="mt-2" type="submit">Submit</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

// Gérer la connexion du user avec token
// const token = localStorage.getItem('token')
// const connected = ref(false);

const show1 = ref(false);

// Dialog pour se connecter
const dialogConnect = ref(false);

// Data pour se connecter
const email = ref('');
const password = ref('');

function openDialogConnect() {
  console.log("test")
  dialogConnect.value = true;
}

// function handleAccountClick() {
//   let data = {
//     id: 25,     
//   };
//   this.$router.push({
//     name: "account", //use name for router push
//     params: { data }
//   });

// In component account
//   mounted() {
//   let data = this.$route.params.data;
//   console.log("data is", data);
// }

// async function submit(event){
//   // Implémenter la connexion
// }

const emailrules = [
  (v) => !!v || 'Email is required',
  (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
];

const passwordrules = [
  (v) => !!v || 'Password is required',
];

</script>

<style scoped>
.text-h4 {
  color: white;
}
</style>