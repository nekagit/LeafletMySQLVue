<template>
  <main class="container-fluid">
    <h1 class="text-center mt-4 mb-4">Welcome to the Leaflet Average</h1>
    <div id="mapContainer" class="card">
      <div class="card-body p-0">
        <div id="map" style="height: 600px;"></div>
      </div>
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
  map.value = L.map('map').setView(germanyCenter, 6) // Zoom level adjusted for visibility
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
    console.log('Fetched data:', data) 

    data.forEach((region) => {
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
  margin-top: 3vh;
}
</style>
