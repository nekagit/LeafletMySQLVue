<template>
  <main>
    <h1>Welcome to the Leaflet Region</h1>

    <form @submit.prevent="fetchDistances">
      <label for="distance">Maximale Entfernung (in Metern):</label>
      <input type="text" id="distance" v-model="maxDistance" />
      <button type="submit">Suchen</button>
    </form>

    <div v-if="distances.length > 0" id="distancesContainer">
      <h3>Distanz zwischen PLZ weniger als {{ maxDistance }}m</h3>
      <table border="1" style="border: 1px solid red">
        <tr bgcolor="#f4eefa">
          <td><b>Distanz (m)</b></td>
          <td><b>PLZ Von</b></td>
          <td><b>PLZ Nach</b></td>
          <td><b>Koordinaten Von</b></td>
          <td><b>Koordinaten Nach</b></td>
        </tr>
        <tr v-for="distance in distances" :key="distance.PLZ_From + '-' + distance.PLZ_To">
          <td>{{ distance.Distance }}</td>
          <td>{{ distance.PLZ_From }}</td>
          <td>{{ distance.PLZ_To }}</td>
          <td>{{ distance.Coordinates_From }}</td>
          <td>{{ distance.Coordinates_To }}</td>
        </tr>
      </table>
    </div>

    <div id="mapContainer"></div>
  </main>
</template>

<script setup>
import 'leaflet/dist/leaflet.css'
import { onMounted, ref } from 'vue'
import L from 'leaflet'

const germanyCenter = [51.1657, 10.4515] // Center of Germany
const map = ref(null)
const maxDistance = ref('')
const distances = ref([])

const setupLeafletMap = () => {
  map.value = L.map('mapContainer').setView(germanyCenter, 6) // Adjust zoom level as needed
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map.value)
}

const fetchDistances = async () => {
  try {
    const response = await fetch(`http://localhost:3000/distance?distance=${maxDistance.value}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    distances.value = data
    console.log('Distance data:', data)

    // Clear existing markers
    map.value.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.value.removeLayer(layer)
      }
    })

    // Display markers or lines for each distance on the map
    for (let distance of data) {
      const { PLZ_From, PLZ_To, Distance } = distance
      const fromCoord = [distance.Longitude_From, distance.Latitude_From]
      const toCoord = [distance.Longitude_To, distance.Latitude_To]

      if (fromCoord && toCoord) {
        const line = L.polyline([fromCoord, toCoord], { color: 'blue' }).addTo(map.value)
        line.bindPopup(`Distanz: ${Distance} m`).openPopup()
      }
    }
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
