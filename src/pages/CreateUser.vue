<style>
.custom-disabled {
  background-color: #f1fad9; /* Light green color for disabled options */
}

.green-button {
  background-color: #84b30e; /* Green background color */
  border-color: #84b30e; /* Green border color */
  color: #fff; /* White text color */
  height: 45px;
}

.green-button:hover {
  background-color: #6a940e; /* Darker green background color on hover */
  border-color: #6a940e; /* Darker green border color on hover */
}

.gradient-button {
  background: linear-gradient(
    45deg,
    #fbb428,
    #ff7e23
  ); /* Yellow-orange gradient background */
  color: red; /* Red text color */
  border: none; /* Remove default button border */
  border-radius: 20px; /* Border radius */
}

.gradient-button:hover {
  background: linear-gradient(
    45deg,
    #e89e00,
    #d23b00
  ); /* Darker yellow-orange gradient background on hover */
  border: none; /* Remove default button border on hover */
}
</style>
<template>
  <div class="container">
    <div class="col-12" style="padding-bottom: 100px">
      <card class="my-3">
        <form class="my-10">
          <div class="row">
            <div class="col-md-12" style="text-align: center">
              <h2
                class="h3 mb-3 fw-normal"
                style="
                  margin: 0px !important;
                  font-family: sans-serif;
                  font-weight: 600;
                  color: #84b30e;
                "
              >
                Create User
              </h2>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <label for="name" class="form-label">Name</label>
              <input
                type="text"
                class="form-control mb-3 custom-disabled"
                id="name"
                tabindex="1"
                v-model="name"
                placeholder="Enter User Name"
                autofocus
              />

              <label for="password" class="form-label">Password</label>
              <input
                type="text"
                class="form-control mb-3 custom-disabled"
                tabindex="3"
                id="password"
                v-model="password"
                placeholder="Enter User Password"
                v-if="showPassword"
              />
              <input
                type="password"
                class="form-control mb-3 custom-disabled"
                tabindex="3"
                id="password"
                v-model="password"
                placeholder="Enter User Password"
                v-else
              />
              <div class="col-md-12" style="text-align-last: right">
                <button
                  type="button"
                  class="btn btn-light"
                  @click="toggleShow"
                  style="color: #84b30e; border-color: #84b30e"
                >
                  <span v-if="showPassword"
                    ><i class="fa fa-eye-slash"></i
                  ></span>
                  <span v-else><i class="fa fa-eye eye"></i></span>
                </button>
              </div>

              <button
                class="btn btn-primary my-3 gradient-button"
                type="button"
                tabindex="8"
                @click.prevent="handleSubmit"
              >
                <b>Create User >></b>
              </button>
            </div>
            <div class="col-md-6">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control mb-3 custom-disabled"
                tabindex="2"
                id="email"
                v-model="email"
                placeholder="Enter Email Address"
              />

              <label for="whatsapp_no" class="form-label"
                >WhatsApp Number</label
              >
              <input
                type="number"
                class="form-control mb-3 custom-disabled"
                id="whatsapp_no"
                v-model="whatsapp_no"
                tabindex="4"
                placeholder="Enter WhatsApp Number"
              />
            </div>
          </div>
        </form>
      </card>
    </div>
  </div>
</template>

<script>
import axiosClient from "../axiosClient.js";

export default {
  name: "create_user",
  data() {
    return {
      showPassword: false,
      user_name: "",
      user_roleType: "",
      name: "",
      email: "",
      whatsapp_no: "",
      password: "",

      type: ["", "info", "success", "warning", "danger"],
      notifications: {
        topCenter: false,
      },
      roles: [],
      departments: [],
    };
  },
  async created() {
    try {
      const response = await this.checkAuthorization();
    } catch (error) {
      console.error(error);
    }
  },

  methods: {
    toggleShow() {
      this.showPassword = !this.showPassword;
    },
    async checkAuthorization() {
      const auth = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      const response = await axiosClient
        .get(`user/getCurrent`, auth)
        .catch((err) => {
          console.log(err);
          if (err.response.status == 401) {
            this.$router.push("/login");
          }
        });
      return response;
    },
    async fetchRoleData() {
      const roleResponse = await axiosClient.get(`role/getall`).catch((err) => {
        console.log(err);
        //this.$router.push("/dashboard");
      });
      this.roles = roleResponse.data.data;
      return;
    },
    async fetchDeptData() {
      const deptResponse = await axiosClient
        .get(`department/getall`)
        .catch((err) => {
          console.log(err);
          this.$router.push("/dashboard");
        });
      this.departments = deptResponse.data.data;
      return;
    },

    async notifyVue(verticalAlign, horizontalAlign, message, NotificationType) {
      const color = NotificationType;

      await this.$notifications.notify({
        message: `<span>${message}</span>`,
        icon: "nc-icon nc-check-2",
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        type: color,
      });
    },

    async handleSubmit() {
      const user = {
        name: this.name,
        email: this.email,
        whatsapp_no: this.whatsapp_no,
        password: this.password,
      };

      const res_getcurrent = await this.checkAuthorization();

      if (res_getcurrent) {
        /* if (this.user_roleType == "admin" && this.roleType == "super_admin") {
          this.notifyVue(
            "top",
            "center",
            "You are not Authorized to Create Super Admin",
            "warning"
          );
          this.$router.push("/users");
        }  */
        const response = await axiosClient
          .post(`user/add`, user)
          .catch((err) => {
            alert(err.response.data.message);
            console.log("error", error);
          });
        if (response) {
          await this.notifyVue("top", "center", "User Created", "success");
          this.$router.push("/users");
        }
      }
    },
  },
};
</script>
