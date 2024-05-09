<template>
  <ul class="nav nav-mobile-menu">
    <li class="nav-item">
      <button
        type="button"
        class="btn btn-primary"
        @click.prevent="handleLogout"
      >
        Logout
      </button>
    </li>
  </ul>
</template>
<script>
export default {
  name: "mobile-menu",
  medthods: {
    handleLogout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>
<style></style>
