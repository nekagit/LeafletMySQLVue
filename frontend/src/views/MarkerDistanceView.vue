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
          <td>{{ distance.Distance.toFixed(2) }}</td>
          <td>{{ distance.PLZ_From }}</td>
          <td>{{ distance.PLZ_To }}</td>
          <td>{{ distance.Latitude_From.toFixed(4) }}, {{ distance.Longitude_From.toFixed(4) }}</td>
          <td>{{ distance.Latitude_To.toFixed(4) }}, {{ distance.Longitude_To.toFixed(4) }}</td>
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
const maxDistance = ref('') // Initial value for testing
const distances = ref([])

const setupLeafletMap = () => {
  map.value = L.map('mapContainer').setView(germanyCenter, 6)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map.value)
}

const fetchDistances = async () => {
  try {
    if (!maxDistance.value) {
      console.error('Max distance is not specified.')
      return
    }

    const response = await fetch(`http://localhost:3000/distance?distance=${maxDistance.value}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    distances.value = data
    console.log('Distance data:', data)

    updateMap(data)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const updateMap = (data) => {
  // Clear existing markers and polylines
  map.value.eachLayer((layer) => {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      map.value.removeLayer(layer)
    }
  })

  const bounds = L.latLngBounds()

  data.forEach((distance) => {
    const fromCoord = [distance.Latitude_From, distance.Longitude_From]
    const toCoord = [distance.Latitude_To, distance.Longitude_To]

    // Add markers
    const fromMarker = L.marker(fromCoord).addTo(map.value)
    const toMarker = L.marker(toCoord).addTo(map.value)

    // Add line
    const line = L.polyline([fromCoord, toCoord], { color: 'blue', weight: 2, opacity: 0.5 }).addTo(map.value)

    // Add popups
    fromMarker.bindPopup(`From: ${distance.PLZ_From}`)
    toMarker.bindPopup(`To: ${distance.PLZ_To}`)
    line.bindPopup(`Distance: ${distance.Distance.toFixed(2)} m`)

    // Extend bounds
    bounds.extend(fromCoord).extend(toCoord)
  })

  // Fit the map to the bounds
  if (bounds.isValid()) {
    map.value.fitBounds(bounds)
  }
}

onMounted(() => {
  setupLeafletMap()
  // Fetch distances on initial load, you may remove this if you prefer not to fetch on load
  if (maxDistance.value) {
    fetchDistances()
  }
})
</script>

<style scoped>
#mapContainer {
  margin: 0;
   width: 90vw;
  height: 90vh;
  margin-top: 3vh;
}
</style>
