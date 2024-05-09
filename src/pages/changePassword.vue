<template>
  <div>
    <h1>Change Passowrd {{ userId }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    userId: "";
  },
  async created() {
    this.userId = this.$route.params.id;
  },
};
</script>
