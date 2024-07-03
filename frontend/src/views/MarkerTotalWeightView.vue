<template>
  <main class="container-fluid">
    <h1 class="text-center mt-4 mb-4">Welcome to the Leaflet Region</h1>

    <form @submit.prevent="fetchShipmentsData" class="mb-4">
      <div class="input-group">
        <label for="plz" class="input-group-text">Postleitzahl eingeben:</label>
        <input type="text" id="plz" v-model="plz" class="form-control" />
        <button type="submit" class="btn btn-primary">Abfrage ausführen</button>
      </div>
    </form>

    <div v-if="shipments.length > 0" id="shipmentsContainer" class="card">
      <div class="card-body p-0">
        <h3 class="card-header">Anzahl der Sendungen und Gesamtgewicht für PLZ {{ plz }}</h3>
        <table class="table table-bordered table-striped mb-0">
          <thead>
            <tr>
              <th scope="col">PLZ Name</th>
              <th scope="col">PLZ To</th>
              <th scope="col">Anzahl der Sendungen</th>
              <th scope="col">Gesamtgewicht</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="shipment in shipments" :key="shipment.Postleitzahl">
              <td>{{ shipment.Region }}</td>
              <td>{{ shipment.Postleitzahl }}</td>
              <td>{{ shipment.Anzahl_der_Sendungen }}</td>
              <td>{{ shipment.Gesamtgewicht }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div id="mapContainer" class="card">
      <div class="card-body p-0">
        <div id="map" style="height: 500px;"></div>
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
const plz = ref('')
const shipments = ref([])

const setupLeafletMap = () => {
  map.value = L.map('map').setView(germanyCenter, 6)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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

    if (bounds.isValid()) {
      map.value.fitBounds(bounds)
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
  margin-top: 3vh;
}
</style>
