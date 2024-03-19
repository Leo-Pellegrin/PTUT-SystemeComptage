<template>
    <v-container fluid>
        <!-- Bar de paramètres -->
        <v-row no-gutters class="mt-4">
            <v-sheet class="d-flex align-center w-100 mt-10" color="#F8F0E5" rounded="xl" :elevation="8">
                <v-btn class="justify-start text-body-1 ma-5" color="#DAC0A3" rounded="xl"
                    v-on:click="dialogSalle = true">
                    <p>Sélection Salle</p>
                    <v-icon size="x-large" class="ml-2" icon="mdi-menu-down" color="#0F2C59"></v-icon>
                </v-btn>
                <v-dialog v-model="dialogSalle" max-width="400px" transition="dialog-top-transition">
                    <v-card color="#F8F0E5">
                        <v-card-title>Sélection Salles</v-card-title>
                        <v-card-text color="#DAC0A3">
                            <v-checkbox v-model="selectAll" @change="selectAllItems"
                                :label="selectAll ? 'Désélectionner tout' : 'Sélectionner tout'" class="mb-n3">
                            </v-checkbox>
                            <v-divider :thickness="2"></v-divider>
                            <v-checkbox v-for="(item, index) in salles" :key="index" v-model="selectedSalles"
                                @change="selectDatachart" :label="item.name" :value="item.name">
                            </v-checkbox>
                        </v-card-text>
                    </v-card>
                </v-dialog>


                <v-btn class="justify-start text-body-1 ma-5" color="#DAC0A3" rounded="xl"
                    v-on:click="dialogDate = true">
                    <p>Sélection Date</p>
                    <v-icon size="x-large" class="ml-2" icon="mdi-menu-down" color="#0F2C59"></v-icon>
                </v-btn>
                <v-dialog v-model="dialogDate" max-width="400px" transition="dialog-top-transition">
                    <v-sheet color="#F8F0E5" class="d-flex justify-center">
                        <v-col>
                            <p class="text-h5 font-weight-bold text-center mb-3">Sélection des dates</p>
                            <v-date-picker style="border: 1px solid #102C59" class="mx-auto my-5" :hide-header=true
                                color="#102C59" bg-color="#F8F0E5" v-model="selectedDates" multiple="range"
                                @update:model-value="selectedDateRange()"></v-date-picker>

                            <div class="d-flex justify-center">
                                <v-btn
                                    v-on:click="selectedDates = []; firstDate = undefined; lastDate = undefined; getDataFromApi()"
                                    :elevation="5" color="#102C59">Réinitialiser</v-btn>
                            </div>
                        </v-col>
                    </v-sheet>
                </v-dialog>

                <v-spacer></v-spacer>

                <v-btn class="justify-start text-body-1 ma-5" color="#DAC0A3" rounded="xl"
                    v-on:click="dialogExport = true">
                    <p>Exportation</p>
                </v-btn>
                <v-dialog v-model="dialogExport" max-width="400px" transition="dialog-top-transition">
                    <v-card>
                        <v-card-title>Exportation</v-card-title>
                    </v-card>
                </v-dialog>
            </v-sheet>
        </v-row>

        <!-- Visualisation graph -->
        <v-row no-gutters>
            <v-sheet class="d-flex justify-center w-100 mt-10" color="#F8F0E5" rounded="xl" :elevation="8">
                <div id="chart" class="mt-2">
                    <apexchart width="1600" height="500" type="area" :options="AreaChartOptions"
                        :series="AreaChartDataSelected"></apexchart>
                </div>
            </v-sheet>
        </v-row>

        <!-- Moyenne par salle -->
        <v-row no-gutters>
            <v-sheet class="w-100 mt-10" color="#F8F0E5" rounded="xl" :elevation="8">
                <!-- Titre -->
                <div class="text-h5 font-weight-bold text-center mb-3">
                    <p class="text-left ml-7 mt-5"> {{ titleBarChart }}</p>
                </div>

                <!-- Graphique -->
                <div id="chart" class="d-flex justify-center ">
                    <apexchart width="1600" height="200" type="bar" :options="BarChartOptions" :series="BarChartData">
                    </apexchart>
                </div>
            </v-sheet>
        </v-row>
    </v-container>
</template>

<script setup>
// Import
import { ref, computed, onMounted } from 'vue';
import axios from 'axios'
import moment from 'moment';

// Dialog variables
const dialogSalle = ref(false);
const dialogDate = ref(false);
const dialogExport = ref(false);

// Variables pour les dates sélectionnées
const selectedDates = ref([]);

// Titre du graphique en bar en fonction des dates sélectionnées
const titleBarChart = computed(() => {
    const startDate = firstDate.value ? moment(firstDate.value).format("YYYY-MM-DD") : undefined;
    const endDate = lastDate.value ? moment(lastDate.value).format("YYYY-MM-DD") : undefined;
    let dateRange;

    if (startDate && endDate) {
        if (startDate === endDate) {
            dateRange = ` du ${formatDateTitle(startDate)}`;
        } else {
            dateRange = ` du ${formatDateTitle(startDate)} au ${formatDateTitle(endDate)}`;
        }
    } else {
        dateRange = "";
    }

    return `Moyenne par salle${dateRange}`;
})

// Variables pour les dates sélectionnées
const firstDate = ref('');
const lastDate = ref('');

const colors = ['#496989', '#58A399', '#A8CD9F', '#E2F4C5']
// Options pour graph en ligne
const AreaChartOptions = {
    chart: {
        id: "areacharthistorique",
        type: "area",
    },
    xaxis: {
        type: 'datetime',
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0,
            opacityTo: 0,
            stops: [0, 100]
        }
    },
    responsive: [
        {
            breakpoint: 1650,
            options: {
                chart: {
                    width: "1400",
                    height: "300"
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
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: 'smooth'
    },

}

// Options pour graph en bar
const BarChartOptions = {
    chart: {
        id: "barcharthistorique",
        type: "bar",
        dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
        },
    },
    xaxis: {
        categories: ["Bibliothèque", "Salle 1", "salle2", "salle3", "salle4", "salle5", "salle6", "salle7", "salle8", "salle9"],
    },
    responsive: [
        {
            breakpoint: 1650,
            options: {
                chart: {
                    width: "1400",
                    height: "300"
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
    dataLabels: {
        enabled: true,
    },
}

// Calcule la moyenne de chaque jour pour le graph en bar
const BarChartData = ref([
    {
        name: "Moyenne par salle",
        backgroundColor: colors[Math.random() * colors.length - 1 | 0],
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
]);

let AreaChartData = ref([]);

let AreaChartDataSelected = ref([])

// Variables pour les salles
const salles = ref([
    {
        name: 'Bibliothèque',
        value: 'biblio',
    },
    {
        name: 'Salle 1',
        value: 'salle1',
    },
    {
        name: 'Salle 2',
        value: 'salle2',
    },
    {
        name: 'Salle 3',
        value: 'salle3',
    },
    {
        name: 'Salle 4',
        value: 'salle4',
    },
    {
        name: 'Salle 5',
        value: 'salle5',
    },
    {
        name: 'Salle 6',
        value: 'salle6',
    },
    {
        name: 'Salle 7',
        value: 'salle7',
    },
    {
        name: 'Salle 8',
        value: 'salle8',
    },
    {
        name: 'Salle 9',
        value: 'salle9',
    },
]);

// Variables pour les salles sélectionnées
const selectedSalles = ref([]);
const selectAll = ref(false);

// Callback pour sélectionner les salles dans le dialog checkbox
function selectDatachart() {
    if (selectedSalles.value.length > 0) {
        if (AreaChartDataSelected.value.length > 0) {
            AreaChartDataSelected.value = [];
        }

        AreaChartData.value.forEach((salle) => {
            if (selectedSalles.value.includes(salle.name)) {
                AreaChartDataSelected.value.push(salle);
            }
        });
    }
    else {
        AreaChartDataSelected.value = [];
    }
}

// Callback pour sélectionner toutes les salles dans le dialog checkbox
function selectAllItems() {
    if (selectAll.value) {
        AreaChartDataSelected.value = []
        AreaChartDataSelected.value = AreaChartData.value

    }
    else {
        selectedSalles.value = [];
        AreaChartDataSelected.value = [];
    }
    console.log("selectedSalles", AreaChartDataSelected.value)
}

// Callback pour sélectionner les dates dans le datepicker
async function selectedDateRange() {
    firstDate.value = selectedDates.value[0];
    lastDate.value = selectedDates.value[selectedDates.value.length - 1];

    getDataFromApi();
}

// Fonction pour récupérer les données de l'API
async function getDataFromApi() {
    if (firstDate.value && lastDate.value) {
        // Mettre dates dans le bon format tel que 2024-02-10T16:56:05.368Z
        let firstDateFormatted = moment(firstDate.value).format();
        let lastDateFormatted = moment(lastDate.value).format();

        if (firstDateFormatted == lastDateFormatted) {
            lastDateFormatted = moment(lastDate.value).add(1, 'days').format();
        }

        firstDateFormatted = firstDateFormatted.slice(0, -6) + '0Z';
        lastDateFormatted = lastDateFormatted.slice(0, -6) + '0Z';

        await axios
            .get('http://localhost:8080/etablissement/2/passage/periode?dateDebut=' + firstDateFormatted + '&dateFin=' + lastDateFormatted)
            .then((response) => {

                AreaChartData.value = [];
                AreaChartDataSelected.value = [];
                BarChartData.value = [{
                    name: "Moyenne par salle",
                    backgroundColor: colors[Math.random() * colors.length - 1 | 0],
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                }];
                const datasalles = getUniqueSalleNames(response.data);


                datasalles.forEach((salle) => {
                    let AreaData = {
                        name: salle,
                        data: [],
                        backgroundColor: colors[Math.random() * colors.length - 1 | 0]
                    }

                    let somme = 0;

                    response.data.forEach((passage) => {
                        if (passage.nomsalle === salle) {
                            AreaData.data.push({ x: new Date(passage.datepassage).getTime(), y: passage.nbpersonne });
                            somme += passage.nbpersonne;
                        }
                    });

                    AreaChartData.value.push(AreaData);

                    addValueToBarChart(salle, somme, AreaData.data.length);
                })


                if (selectedSalles.value.length > 0) {
                    // Gérer les categories pour le graph en ligne en fonction des dates
                    selectDatachart();
                }
                else {
                    AreaChartDataSelected.value = AreaChartData.value;
                    // Gérer les categories pour le graph en ligne en fonction des dates
                }


                // const datasalles = getUniqueSalleNames(response.data);

                // formatDataChart(datasalles, response);  
            })
    }
    else {
        // Afficher les données de la semaine actuelle
        let currentMoment = moment();

        // Define the start of the week (considering Monday as the first day)
        let startOfWeek = currentMoment.startOf('isoWeek').toISOString();
        let endOfWeek = currentMoment.endOf('isoWeek').toISOString();

        await axios
            .get('http://localhost:8080/etablissement/2/passage/periode?dateDebut=' + startOfWeek + '&dateFin=' + endOfWeek)
            .then((response) => {
                // Récupérer les noms de salle uniques
                AreaChartData.value = [];
                AreaChartDataSelected.value = [];

                BarChartData.value = [{
                    name: "Moyenne par salle",
                    backgroundColor: colors[Math.random() * colors.length - 1 | 0],
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                }];

                const datasalles = getUniqueSalleNames(response.data);

                datasalles.forEach((salle) => {
                    let AreaData = {
                        name: salle,
                        data: [],
                        backgroundColor: colors[Math.random() * colors.length - 1 | 0]
                    }

                    let somme = 0;

                    response.data.forEach((passage) => {
                        if (passage.nomsalle === salle) {
                            AreaData.data.push({ x: new Date(passage.datepassage).getTime(), y: passage.nbpersonne });
                            somme += passage.nbpersonne;
                        }
                    });

                    addValueToBarChart(salle, somme, AreaData.data.length);
                    AreaChartData.value.push(AreaData);

                })


                if (selectedSalles.value.length > 0) {
                    // Gérer les categories pour le graph en ligne en fonction des dates
                    selectDatachart();
                }
                else {
                    AreaChartDataSelected.value = AreaChartData.value;
                    // Gérer les categories pour le graph en ligne en fonction des dates
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
}

// Récupérer les données de l'API au montage
onMounted(() => {
    getDataFromApi();
})

// Tableau pour les noms des mois
const monthNames = ["Janv.", "Fév.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];

// Fonction pour formater la date
function formatDateTitle(datestring) {
    let date = new Date(datestring);

    // Récupérer le nom du mois et le jour
    const month = monthNames[date.getMonth()];
    const day = date.getDate();

    // Formater l'année
    const year = date.getFullYear();

    // Retourner la date formatée
    return `${day} ${month} ${year}`;
}

function getUniqueSalleNames(data) {
    const uniqueSalleNames = new Set();

    data.forEach(passage => {
        uniqueSalleNames.add(passage.nomsalle);
    });

    return Array.from(uniqueSalleNames); // Convertir l'ensemble en tableau pour faciliter l'utilisation
}

function addValueToBarChart(salle, somme, length) {
    switch (salle) {
        case 'Bibliothèque':
            BarChartData.value[0].data[0] = (Math.round((somme / length) * 10 / 10))
            break;
        case 'Salle 1':
            BarChartData.value[0].data[1] = (Math.round((somme / length) * 10 / 10))
            break;
        case 'Salle 2':
            BarChartData.value[0].data[2] = (Math.round((somme / length) * 10 / 10))
            break;
        case 'Salle 3':
            BarChartData.value[0].data[3] = (Math.round((somme / length) * 10 / 10))
            break;
        case 'Salle 4':
            BarChartData.value[0].data[4] = (Math.round((somme / length) * 10 / 10))
            break;
        case 'Salle 5':
            BarChartData.value[0].data[5] = (Math.round((somme / length) * 10 / 10))
            break;
        case 'Salle 6':
            BarChartData.value[0].data[6] = (Math.round((somme / length) * 10 / 10))
            break;
        case 'Salle 7':
            BarChartData.value[0].data[7] = (Math.round((somme / length) * 10 / 10))
            break;
        case 'Salle 8':
            BarChartData.value[0].data[8] = (Math.round((somme / length) * 10 / 10))
            break;
        case 'Salle 9':
            BarChartData.value[0].data[9] = (Math.round((somme / length) * 10 / 10))
            break;
    }
}

</script>

<style scoped>
/* Supprimer la marge horizontale pour centrer les feuilles */
.v-sheet {
    margin-left: 0;
    margin-right: 0;
}

p {
    color: #102C59;
}
</style>
