<template>
  <section class="bg-secondary footer" style="bottom: 0; width: 100%;">
    <div class="container text-center">


      <div class="row justify-content-center">
        <div class="col-xl-4">
          <p class="mb-0 text-center"><a class="text-300 text-decoration-none footer-link">Todos os direitos
              reservados © JanjaTek, 2025</a>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';


const getRandomCoordinate = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// Simulação de Geolocalização
const simulateLocation = () => {


  const mockLatitude = getRandomCoordinate(-90, 90); // Latitude entre -90 e 90
  const mockLongitude = getRandomCoordinate(-180, 180); // Longitude entre -180 e 180

  // Sobrescrevendo a geolocalização padrão
  navigator.geolocation.getCurrentPosition = (success: PositionCallback) => {
    const position: any = {
      coords: {
        latitude: mockLatitude,
        longitude: mockLongitude,
        accuracy: 100,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };
    success(position);
  };
  // console.log(mockLatitude, mockLongitude)
};

onMounted(() => {
  simulateLocation();
});
</script>

<style scoped>
.footer {
  

  background: #121a36;
  border-top: 1px solid #444;
  bottom: 0;
  width: 100%;
  z-index: 100;
}


</style>