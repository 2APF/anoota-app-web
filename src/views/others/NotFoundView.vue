<template>
    <main class="main" id="top">
        <NavbarComponent />
        <section class="container-lg d-flex align-items-center justify-content-center mt-5 mb-5">
            <div class=" text-center">
                <h1 class="display-1 fw-bold text-danger mt-4">404</h1>
                <h2 class="display-6 fw-semi-bold">Página não encontrada!</h2>
                <p class="fs-4 text-muted">
                    Desculpe, mas a página que você está procurando não existe ou foi movida.
                </p>
                <div class="mt-4">

                    <RouterLink :to="{ name: 'app.home' }" :scroll-behavior="{ behavior: 'smooth' }" class="btn btn-primary btn-lg">
                        Voltar para a Página Inicial
      </RouterLink>
                   
                </div>
            </div>
        </section>

        <FooterComponent />
    </main>
</template>

<script setup lang="ts">
import NavbarComponent from '@/components/NavbarComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
</script>

<style scoped>
.error-404 {
     min-height: calc(100vh - 120px); 
    
    background: linear-gradient(135deg, #082d53, #010407);
    color: #333;
}

.error-404 h1 {
    font-size: 10rem;
}

.error-404 h2 {
    font-size: 2.5rem;
}

.error-404 p {
    font-size: 1.25rem;
}

.error-404 .btn {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
    border-radius: 0.5rem;
}
</style>
