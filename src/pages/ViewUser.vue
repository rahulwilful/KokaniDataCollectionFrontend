<template>
  <div
    class="container"
    style="
      max-width: 1240px !important;
      background-color: aliceblue;
      padding-bottom: 100px;
    "
  >
    <button
      type="button"
      class="btn btn-primary"
      style="margin: 15px"
      @click="handleBack"
    >
      Back
    </button>
    <card class="my-3">
      <form>
        <h2 class="h3 mb-3 fw-normal">View User</h2>

        <div class="row">
          <div class="col-md-6">
            <label for="name" class="form-label">Name</label>
            <input
              type="text"
              class="form-control mb-3"
              id="name"
              tabindex="1"
              v-model="name"
              placeholder="Enter User Name"
              autofocus
              disabled
            />

            <label for="status" class="form-label">Status</label>
            <input
              type="text"
              class="form-control mb-3"
              tabindex="8"
              id="status"
              v-model="status"
              disabled
              placeholder="Enter User Password"
            />
          </div>
          <div class="col-md-6">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control mb-3"
              tabindex="2"
              id="email"
              v-model="email"
              disabled
              placeholder="Enter Email Address"
            />

            <label for="whatsapp_no" class="form-label">WhatsApp Number</label>
            <input
              type="number"
              class="form-control mb-3"
              id="whatsapp_no"
              v-model="whatsapp_no"
              tabindex="4"
              disabled
              placeholder="Enter WhatsApp Number"
            />
          </div>
        </div>
      </form>
    </card>
  </div>
</template>
<script>
import axiosClient from "../axiosClient.js";

export default {
  name: "view_user",
  data() {
    return {
      name: "",
      email: "",
      whatsapp_no: "",
      roleType: "1",
      joining_date: "",
      department: "1",
      approved: false,
      roles: [],
      departments: [],
    };
  },
  computed: {
    status() {
      return this.approved ? "Approved" : "Disapproved";
    },
  },
  async created() {
    try {
      await this.checkAuthorization();
      await this.fetchUserData();
      //await this.fetchRoleDeptData();
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    handleBack() {
      this.$router.go(-1);
    },
    notifyVue(verticalAlign, horizontalAlign, message, NotificationType) {
      const color = NotificationType;
      this.$notifications.notify({
        message: `<span>${message}</span>`,
        icon: "nc-icon nc-check-2",
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        type: color,
      });
    },
    async checkAuthorization() {
      const auth = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      await axiosClient.get(`user/getCurrent`, auth);
    },
    async fetchUserData() {
      const userId = this.$route.params.id;
      const response = await axiosClient.get(`user/get/${userId}`);

      if (response.data.message === "User Not Found") {
        this.notifyVue("top", "center", response.data.message, "danger");
        this.$router.push("/users");
        return;
      }

      const {
        name,
        email,
        whatsapp_no,
        roleType,
        joining_date,
        department,
        approved,
      } = response.data.data[0];
      Object.assign(this, {
        name,
        email,
        whatsapp_no,
        roleType,
        joining_date,
        department,
        approved,
      });
    },
    async fetchRoleDeptData() {
      const roleResponse = await axiosClient.get(`role/getall`).catch((err) => {
        console.log(err);
        //this.$router.push("/dashboard");
      });
      this.roles = roleResponse.data.data;

      const deptResponse = await axiosClient
        .get(`department/getall`)
        .catch((err) => {
          console.log(err);
          this.$router.push("/dashboard");
        });
      this.departments = deptResponse.data.data;
      return;
    },
  },
};
</script>
