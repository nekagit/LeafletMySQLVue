<template>
  <main>
    <h1>Welcome to the Leaflet Average</h1>
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

const setupLeafletMap = () => {
  map.value = L.map('mapContainer').setView(germanyCenter, 6) // Zoom level adjusted for visibility
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map.value)
}

const addMarkers = async () => {
  try {
    const response = await fetch('http://127.0.0.1:3000/averageWeight')
    const data = await response.json()
    console.log('Fetched data:', data) // Check the structure of data fetched

    data.forEach((region) => {
      // Ensure Latitude and Longitude are valid
      if (region.Latitude !== undefined && region.Longitude !== undefined) {
        const marker = L.marker([region.Latitude, region.Longitude]).addTo(map.value)
        marker
          .bindPopup(
            `<b>${region.Region}</b><br>Durchschnittsgewicht: ${region.Durchschnittsgewicht.toFixed(2)} kg`
          )
          .openPopup()
      } else {
        console.warn(`Skipping marker for ${region.Region} due to missing Latitude or Longitude.`)
      }
    })
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(() => {
  setupLeafletMap()
  addMarkers()
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
