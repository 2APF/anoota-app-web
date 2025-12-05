<template>
  <header class="dashboard-header">
    <div class="logo">NoCoin</div>

    <RouterLink :to="{ name: 'app.wallet.access' }" :scroll-behavior="{ behavior: 'smooth' }" class="logout-btn btn btn-danger">
    


       <span
        class="fas fa-sign-out-alt"></span> 
    </RouterLink>
  </header>
</template>

<style scoped>
.dashboard-header {
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #11121b;
  border-bottom: 1px solid #444;
  z-index: 100;
}



.logout-btn {
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
}
</style>