<template>
  <main>
    <h1>Welcome to the Leaflet Region</h1>

    <form @submit.prevent="fetchShipmentsData">
      <label for="plz">Postleitzahl eingeben:</label>
      <input type="text" id="plz" v-model="plz" />
      <button type="submit">Abfrage ausführen</button>
    </form>

    <div v-if="shipments.length > 0" id="shipmentsContainer">
      <h3>Anzahl der Sendungen für PLZ {{ plz }}</h3>
      <table border="1" style="border:1px solid red; empty-cells:hide;">
        <tr bgcolor="#f4eefa">
          <td><b>PLZ Name</b></td>
          <td><b>PLZ To</b></td>
          <td><b>Anzahl der Sendungen</b></td>
        </tr>
        <tr v-for="shipment in shipments" :key="shipment.Postleitzahl">
          <td>{{ shipment.Region }}</td>
          <td>{{ shipment.Postleitzahl }}</td>
          <td>{{ shipment.Anzahl_der_Sendungen }}</td>
        </tr>
      </table>
    </div>

    <div id="container">
      <div id="mapContainer"></div>
    </div>
  </main>
</template>

<script setup>
import 'leaflet/dist/leaflet.css'
import { onMounted, ref } from 'vue'
import L from 'leaflet'

const germanyCenter = [51.1657, 10.4515] // Center of Germany
const map = ref(null)
const plz = ref('')
const shipments = ref([])

const setupLeafletMap = () => {
  map.value = L.map('mapContainer').setView(germanyCenter, 6) // Zoom level adjusted for visibility
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map.value)
}

const fetchShipmentsData = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:3000/shipments?plz=${plz.value}`)
    const data = await response.json()
    shipments.value = data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(() => {
  setupLeafletMap()
})
</script>

<style scoped>
#mapContainer {
  margin: 0;
  width: 100vw;
  height: 90vh;
  margin-top: 3vh;
}
</style>
