<template>
    <v-container fluid>
        <v-row no-gutters class="mt-10">
            <v-sheet class="d-flex align-center w-100 mt-10" color="#F8F0E5" rounded="xl" :elevation="8">
                <div class="flex-grow-1"> <!-- Utilisation de la classe flex-grow-1 -->
                    <p class="text-h5 font-weight-bold ma-3">Détails du profil</p>
                </div>

                <div class="d-flex mx-5">
                    <v-btn class="mr-5 text-none" flat color="#4a443f" variant="outlined"><v-icon
                            class="mr-1">mdi-account-plus-outline</v-icon>Inviter</v-btn>
                    <v-btn class="text-none" flat color="#4781de" variant="outlined"><v-icon
                            class="mr-1">mdi-plus</v-icon>Créer</v-btn>
                </div>
            </v-sheet>
        </v-row>

        <v-sheet class="mt-10" color="#F8F0E5" rounded="xl" :elevation="8">
            <v-row class="mt-10 d-flex justify-center">

                <v-col cols="6" class="mx-5">
                    <div>
                        <p>Informations générales</p>
                        <v-text-field v-model="email" label="Email" :rules="emailrules" clearable variant="outlined"
                            required placeholder="Entrez votre e-mail"></v-text-field>
                        <v-text-field v-model="password" label="Password" variant="outlined" readonly></v-text-field>
                        <v-btn>
                            Modifier le mot de passe
                        </v-btn>
                        <v-text-field v-model="Role" label="Role" readonly variant="outlined"></v-text-field>
                        <v-text-field v-model="etabalissement" label="Établissement" readonly
                            variant="outlined"></v-text-field>
                    </div>

                    <v-spacer></v-spacer>

                    <div>
                        <p>Préférences</p>
                        <v-select v-model="selectdateformat" label="Format de Date" :items="dateformats" required
                            variant="outlined"></v-select>
                        <v-select v-model="selectimeformat" label="Format de Date" :items="timeformat" required
                            variant="outlined"></v-select>
                    </div>


                </v-col>

            </v-row>
        </v-sheet>
    </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const email = ref('')
const password = ref('')
const Role = ref('')
const etabalissement = ref('')
const selectdateformat = ref('')
const selectimeformat = ref('')

onMounted(() => {
    getProfileData();
})

async function getProfileData() {
    return;
}

const dateformats = [
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'YYYY/MM/DD',
]

const timeformat = [
    'Jour',
    'Semaine',
    'Mois',
]

const emailrules = [
    (v) => !!v || 'L\'email est requis',
    (v) => /.+@.+\..+/.test(v) || 'L\'email doit être valide',
]
</script>

<style scoped></style>