<template>
  <div class="form-signin w-100 m-auto">
    <form
      class="my-10"
      @submit.prevent="handleSubmit"
      style="padding-bottom: 177px; text-align: center"
    >
      <!-- <img src="img/expogroup_logo.png" style="width: 380px" alt="" /> -->
      <h1 class="h3 mb-3 fw-normal">Please Sign In</h1>

      <div class="form-floating">
        <input
          type="email"
          class="form-control"
          placeholder="name@example.com"
          v-model="email"
        />
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating">
        <input
          type="password"
          class="form-control"
          placeholder="Password"
          v-model="password"
        />
        <label for="floatingPassword">Password</label>
      </div>

      <button :class="`btn btn-primary w-100 py-2`" type="submit">
        Sign in
      </button>
    </form>
    <button
      type="button"
      class="btn btn-primary my-2"
      @click.prevent="superadmin"
    >
      Super Admin
    </button>
  </div>
</template>

<script>
import axiosClient from "../axiosClient.js";

export default {
  name: "login",

  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async notifyVue(verticalAlign, horizontalAlign, message, NotificationType) {
      const color = NotificationType;
      this.$notifications.notify({
        message: `<span>${message}</span>`,
        icon: "nc-icon nc-check-2",
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        type: color,
      });
    },
    async handleSubmit() {
      const currentDate = new Date().toISOString().split("T")[0];

      const loginRestrictionDate = new Date("2024-05-20")
        .toISOString()
        .split("T")[0];

      if (currentDate <= loginRestrictionDate) {
        console.log("Login allowed");
        const data = {
          email: this.email,
          password: this.password,
        };

        const response = await axiosClient
          .post(`user/login`, data)
          .catch((err) => {
            console.log(err.response.status);
            if (err.response.status == 404) {
              this.notifyVue(
                "top",
                "center",
                "User Deleted! Contact Admin",
                "danger"
              );
            }
            if (err.response.status == 402) {
              this.notifyVue(
                "top",
                "center",
                "User Disabled! Contact Admin",
                "danger"
              );
            }
            if (err.response.status == 401) {
              this.notifyVue(
                "top",
                "center",
                "Login Denined! Wrong Credentials",
                "warning"
              );
            }
            if (err.response.status == 500) {
              this.notifyVue(
                "top",
                "center",
                "Something Went Wrong!",
                "danger"
              );
            }
          });
        if (response) {
          if (response.status == 200) {
            localStorage.setItem("token", response.data.token);
            const token = localStorage.getItem("token");
            //console.log(token);
            if (token) {
              this.notifyVue("top", "center", "Login Successfull", "success");
              this.$router.push("/dashboard");
            }
          }
        }
      } else {
        console.log(
          "Login restricted. Please try again after the specified date."
        );
        this.notifyVue(
          "top",
          "center",
          "Login Denined! Contant System Admin",
          "warning"
        );
      }
    },

    superadmin() {
      this.email = "admin@gmail.com";
      this.password = "123456";
    },

    admin() {
      this.email = "admin@gmail.com";
      this.password = "12345";
    },

    da() {
      this.email = "deo@gmail.com";
      this.password = "12345";
    },

    qa() {
      this.email = "qa@gmail.com";
      this.password = "12345";
    },
  },
};
</script>

<style scoped></style>
