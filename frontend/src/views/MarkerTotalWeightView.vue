<template>
  <main>
    <h1>Welcome to the Leaflet Region</h1>

    <form @submit.prevent="fetchShipmentsData">
      <label for="plz">Postleitzahl eingeben:</label>
      <input type="text" id="plz" v-model="plz" />
      <button type="submit">Abfrage ausführen</button>
    </form>

    <div v-if="shipments.length > 0" id="shipmentsContainer">
      <h3>Anzahl der Sendungen und Gesamtgewicht für PLZ {{ plz }}</h3>
      <table border="1" style="border: 1px solid red">
        <tr bgcolor="#f4eefa">
          <td><b>PLZ Name</b></td>
          <td><b>PLZ To</b></td>
          <td><b>Anzahl der Sendungen</b></td>
          <td><b>Gesamtgewicht</b></td>
        </tr>
        <tr v-for="shipment in shipments" :key="shipment.Postleitzahl">
          <td>{{ shipment.Region }}</td>
          <td>{{ shipment.Postleitzahl }}</td>
          <td>{{ shipment.Anzahl_der_Sendungen }}</td>
          <td>{{ shipment.Gesamtgewicht }}</td>
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
const plz = ref('')
const shipments = ref([])

const setupLeafletMap = () => {
  map.value = L.map('mapContainer').setView(germanyCenter, 6) // Adjust zoom level as needed
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map.value)
}

const fetchShipmentsData = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:3000/totalWeight?plz=${plz.value}`)
    const data = await response.json()
    shipments.value = data
    console.log('Shipment data:', data)
    // Clear existing markers
    map.value.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.value.removeLayer(layer)
      }
    })

    const bounds = L.latLngBounds()
    data.forEach((shipment) => {
      const { Latitude, Longitude, Region, Anzahl_der_Sendungen } = shipment
      if (Latitude && Longitude) {
        const lat = parseFloat(Latitude)
        const lng = parseFloat(Longitude)
        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = L.marker([lat, lng]).addTo(map.value).bindPopup(
            `<b>${Region}</b><br>Anzahl der Sendungen: ${Anzahl_der_Sendungen}<br>Gesamtgewicht: ${shipment.Gesamtgewicht}`
          )
          bounds.extend(marker.getLatLng())
        }
      }
    })
    if (!bounds.isValid()) {
      map.value.fitBounds(bounds)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
  console.log('Map initialized:', map.value)
}

onMounted(() => {
  setupLeafletMap()
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
