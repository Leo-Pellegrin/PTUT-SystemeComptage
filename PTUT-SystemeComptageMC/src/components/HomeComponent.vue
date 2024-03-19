<template>
  <v-container fluid class="">
    <!-- First row -->
    <v-row no-gutters class="d-flex justify-space-evenly">

      <!-- Occupation globale -->
      <v-col cols="3">
        <v-sheet class="fill-heigh text-center" color="#F8F0E5" rounded="xl" :elevation="8">
          <p class="mx-auto pt-5 text-h6 text-#102C59">Occupation globale</p>
          <p class="mx-auto text-h3 mt-5 font-weight-bold">{{ occupationGlobale }}</p>
          <p class="pb-5 text-h6">personnes</p>
        </v-sheet>
      </v-col>

      <!-- Occupation bibliothèque -->
      <v-col cols="3">
        <v-sheet class="fill-heigh text-center" color="#F8F0E5" rounded="xl" :elevation="8">
          <p class="mx-auto pt-5 text-h6">Occupation bibliothèque</p>
          <p class="mx-auto text-h3 mt-5 font-weight-bold">{{ occupationBibliotheque }}</p>
          <p class="pb-5 text-h6">personnes</p>
        </v-sheet>
      </v-col>

      <!-- Occupation salles de travail -->
      <v-col cols="3">
        <v-sheet class=" fill-heigh text-center" color="#F8F0E5" rounded="xl" :elevation="8">
          <p class="mx-auto pt-5 mx-5 text-h6 overflow-auto">Occupations des salles de travail</p>
          <p class="mx-auto text-h3 mt-5 font-weight-bold">{{ occupationSalles }}</p>
          <p class="pb-5 text-h6">personnes</p>
        </v-sheet>
      </v-col>

      <!-- TODO : Carte Maison Campus -->
      <!-- <v-col class="ml-16">
        <v-sheet class="pa-10 ma-2 fill-height" color="#F8F0E5" rounded="xl" :elevation="8">
          Carte Maison Campus
        </v-sheet>
      </v-col> -->
    </v-row>

    <!-- Second Row -->
    <v-row no-gutters class="d-flex justify-space-evenly mt-10">

      <!-- Moyenne occupation sur la journée -->
      <v-col class="mx-10">
        <v-sheet class="fill-height" color="#F8F0E5" rounded="xl" :elevation="8">
          <div class="d-flex justify-center align-center fill-height">
            <!-- <AvgBarChart :chartdata="AvgPresencechartData" /> -->
            <div id="chart" class="mt-2">
              <apexchart width="1600" height="300" type="bar" :options="BarChartOptions" :series="AvgPresencechartData">
              </apexchart>
            </div>
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- Third Row -->
    <v-row no-gutters class="d-flex justify-space-evenly mt-10">

      <!-- Stats sur le mois/semaine -->
      <v-col class="mx-10">
        <v-sheet class="fill-height" color="#F8F0E5" rounded="xl" :elevation="8">
          <div class="d-flex justify-center align-center fill-height">
            <!-- <AvgBarChart :chartdata="AvgPresence" /> -->
            <div id="chart" class="mt-2">
              <apexchart width="1600" height="300" type="bar" :options="BarChartOptions" :series="AvgPresence">
              </apexchart>
            </div>
          </div>
        </v-sheet>
      </v-col>

    </v-row>

  </v-container>
</template>


<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const BarChartOptions = {
  chart: {
    id: "vuechart-example",
    type: "bar",
  },
  grid: {
    show: false,

  },
  xaxis: {
    categories: ['8h-9h', '9h-10h', '10h-11h', '11h-12h', '12h-13h', '13h-14h', '14h-15h', '15h-16h', '16h-17h', '17h-18h'],
  },
  responsive: [
    {
      breakpoint: 1650,
      options: {
        chart: {
          width: "1400",
          height: "300",
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
        },
      },
    },
    {
      breakpoint: 1450,
      options: {
        chart: {
          width: "1200",
          height: "300"
        },
      },
    },
    {
      breakpoint: 1250,
      options: {
        chart: {
          width: "1000",
          height: "300"
        },
      },
    },
    {
      breakpoint: 1050,
      options: {
        chart: {
          width: "800",
          height: "300"
        },
      },
    }
  ],
}

const AvgPresencechartData = ref([
  {
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    backgroundColor: '#0F2C59',
    name: 'Occupation'
  }
])

const AvgPresence = ref([
  {
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    backgroundColor: '#265073',
    name: 'Occupation globale'
  },
  {
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    backgroundColor: '#2D9596',
    name: 'Occupation bibliothèque'
  },
  {
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    backgroundColor: '#9AD0C2',
    name: 'Occupation salles de travail'
  }
])


const occupationGlobale = ref(0);
const occupationBibliotheque = ref(0);
const occupationSalles = ref(0);

const TimeRange = [{ start: '08:00', end: '09:00' }, { start: '09:00', end: '10:00' }, { start: '10:00', end: '11:00' }, { start: '11:00', end: '12:00' }, { start: '12:00', end: '13:00' }, { start: '13:00', end: '14:00' }, { start: '14:00', end: '15:00' }, { start: '15:00', end: '16:00' }, { start: '16:00', end: '17:00' }, { start: '17:00', end: '18:00' }]

onMounted(() => {
  getDataFromApi();
})

async function getDataFromApi() {
  const currentDate = new Date();

  // Set midnightDate to the current day at 00:00
  const midnightDate = new Date(currentDate);
  midnightDate.setHours(0, 0, 0, 0);

  // Set endOfDayDate to the next day at 00:00
  const endOfDayDate = new Date(currentDate);
  endOfDayDate.setDate(endOfDayDate.getDate() + 1); // Move to the next day
  endOfDayDate.setHours(0, 0, 0, 0); // Set time to 00:00

  // Formater les dates pour les envoyer à l'API
  let firstHourFormatted = midnightDate.toISOString(); // Convert to ISO string
  let lastHourFormatted = endOfDayDate.toISOString(); // Convert to ISO string

  firstHourFormatted = firstHourFormatted.slice(0, -9) + '.000Z';
  lastHourFormatted = lastHourFormatted.slice(0, -9) + '.000Z';

  await axios
    .get('http://localhost:8080/etablissement/2/passage/periode?dateDebut=' + firstHourFormatted + '&dateFin=' + lastHourFormatted)
    .then((response) => {

      const dataByRoom = {};
      response.data.forEach((passage) => {
        const room = passage.nomsalle;
        const date = new Date(passage.datepassage);
        const nbpersonne = passage.nbpersonne;

        if (!dataByRoom[room]) {
          dataByRoom[room] = [];
        }

        dataByRoom[room].push({ date, nbpersonne });

        // Calculer l'occupation moyenne par tranche horaire
        const passageDate = new Date(passage.datepassage);
        const passageHour = passageDate.getHours();


        // On itère sur chaque tranche horaire pour vérifier si le passage est dans cette tranche
        TimeRange.forEach((time) => {
          const startTime = time.start.split(':');
          const endTime = time.end.split(':');

          if (passageHour >= startTime[0] && passageHour < endTime[0]) {
            AvgPresencechartData.value[0].data[TimeRange.indexOf(time)] += passage.nbpersonne;
            AvgPresence.value[0].data[TimeRange.indexOf(time)] += passage.nbpersonne;
            if (passage.nomsalle === 'Bibliothèque') {
              AvgPresence.value[1].data[TimeRange.indexOf(time)] += passage.nbpersonne;
            } else {
              AvgPresence.value[2].data[TimeRange.indexOf(time)] += passage.nbpersonne;
            }
          }
        });
      });
      // Find the last date for each room
      const lastDataByRoom = {};

      for (const room in dataByRoom) {
        const dataForRoom = dataByRoom[room];
        const lastDataForRoom = dataForRoom[dataForRoom.length - 1]; // Last element in the array
        lastDataByRoom[room] = lastDataForRoom;
        if (room == 'Bibliothèque') {
          occupationBibliotheque.value = dataForRoom[0].nbpersonne
        } else {
          occupationSalles.value += dataForRoom[0].nbpersonne
        }
        occupationGlobale.value += dataForRoom[0].nbpersonne
      }


      console.log(AvgPresencechartData.value[0].data)
    })
}
</script>

<style scoped>
.inlinerow {
  min-width: 100%;
}

.customlineheight {
  line-height: 1;
}

.text-h6,
.text-h3 {
  color: #102C59;
}
</style>