<template>
  <card>
    <h4 slot="header" class="card-title">LoggedIn Profile</h4>
    <form>
      <div class="row">
        <div class="col-md-6">
          <base-input
            type="email"
            label="Email"
            placeholder="Email"
            v-model="email"
            disabled
          >
          </base-input>
        </div>
        <div class="col-md-6">
          <base-input
            type="text"
            label="Name"
            placeholder="Name"
            v-model="name"
            disabled
          >
          </base-input>
        </div>
      </div>

      <div class="row"></div>

      <div class="row">
        <div class="col-md-6">
          <base-input
            type="number"
            label="WhatsApp Number"
            placeholder="Last Name"
            v-model="whatsapp_no"
            disabled
          >
          </base-input>
        </div>
        <div class="col-md-6">
          <base-input
            type="text"
            label="Joining Date"
            placeholder="Enter Joining Date"
            v-model="joining_date"
            disabled
          >
          </base-input>
        </div>
      </div>
      <!-- <div class="text-center">
        <button
          type="submit"
          class="btn btn-info btn-fill float-right"
          @click.prevent="updateProfile"
        >
          Update Profile
        </button>
      </div> -->
      <div class="clearfix"></div>
    </form>
  </card>
</template>
<script>
import Card from "src/components/Cards/Card.vue";
import axiosClient from "src/axiosClient.js";

export default {
  components: {
    Card,
  },
  data() {
    return {
      name: "",
      email: "",
      whatsapp_no: "",
      roleType: "1",
      joining_date: "",
      department: "1",
      approved: false,
    };
  },
  computed: {
    status() {
      return this.approved ? "Approved" : "Disapproved";
    },
  },
  async created() {
    try {
      const userData = await this.fetchCurrentUserData();

      this.assignUserData(userData);
    } catch (error) {
      this.handleError(error);
    }
  },
  methods: {
    async fetchCurrentUserData() {
      const auth = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      const response = await axiosClient.get(`user/getCurrent`, auth);
      return response.data.user;
    },
    assignUserData(userData) {
      const { name, email, whatsapp_no, joining_date, approved } = userData;
      Object.assign(this, {
        name,
        email,
        whatsapp_no,
        joining_date,
        approved,
      });
    },
    handleError(error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        this.$router.push("/login");
      }
    },
  },
};
</script>
<style></style>
