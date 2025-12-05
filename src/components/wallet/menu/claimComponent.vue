<template>
  <section class="bg-secondary">
    <div class="container text-center">

      <!-- <ul class="nav justify-content-center bottom pb-3 mb-3">
        <li class="nav-item"><a href="#" class="nav-link px-4">
            <p>API Docs</p>
          </a></li>
        <li class="nav-item">
          <RouterLink class="nav-link px-4" :to="{ name: 'app.home' }" :scroll-behavior="{ behavior: 'smooth' }">
            XFrente</RouterLink>
        </li>

        <li class="nav-item"><a href="#" class="nav-link px-4">Termos & Condições</a></li>
        <li class="nav-item"><a href="#" class="nav-link px-4">Políticas de Privacidade</a></li>
      </ul> -->


      <div class="row justify-content-center">
        <div class="col-xl-4">
          <p class="mb-0 text-center"><a class="text-300 text-decoration-none footer-link">Todos os direitos
              reservados © JanjaTek, 2024</a>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NavbarComponent from '@/components/NavbarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'


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
