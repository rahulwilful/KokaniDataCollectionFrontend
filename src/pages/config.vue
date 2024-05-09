<template>
  <div class="container">
    <div class="row">
      <div class="col-md-10 offset-md-1">
        <div class="card my-3">
          <div class="card-body">
            <h4>Configuration:</h4>
            <router-link to="/config/add/events">Add Events</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddEvents",
};
</script>
