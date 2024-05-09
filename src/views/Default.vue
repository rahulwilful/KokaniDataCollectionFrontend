<template>
  <div>
    <!-- <navbar /> -->
    <main style="background-color: #f2f2f2">
      <router-view />
    </main>
    <!-- <Footer /> -->
  </div>
</template>

<script>
import Footer from "../components/Footer.vue";
import Navbar from "../components/Navbar.vue";
export default {
  components: { Footer, Navbar },
  name: "App",
};
</script>
