<template>
  <main>
    <div id="container">
      <div id="mapContainer"></div>
    </div>
  </main>
</template>

<script setup>
import 'leaflet/dist/leaflet.css'
import { onMounted, ref } from 'vue'
import L from 'leaflet'

const center = ref([37.7749, -122.4194])
const map = ref(null)

const setupLeafletMap = () => {
  map.value = L.map('mapContainer').setView(center.value, 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map.value)
}

const addMarkers = async () => {
  try {
    const response = await fetch('http://127.0.0.1:3306/data')
    const data = await response.json()
    data.forEach(region => {
      const marker = L.marker([region.Latitude, region.Longitude]).addTo(map.value)
      marker.bindPopup(`<b>${region.Region}</b><br>Durchschnittsgewicht: ${region.Durchschnittsgewicht.toFixed(2)} kg`).openPopup()
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
  margin:0;
  width: 100vw;
  height: 90vh;
  margin-top:3vh;
}
</style>
