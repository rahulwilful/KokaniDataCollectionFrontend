<template>
  <div class="container">
    <div class="col-12" style="padding-bottom: 100px">
      <card class="my-3">
        <form class="my-10" @submit.prevent="handleSubmit">
          <h1 class="h3 mb-3 fw-normal">Edit User</h1>

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

              <label for="whatsapp_no" class="form-label"
                >WhatsApp Number</label
              >
              <input
                type="number"
                class="form-control mb-3"
                id="whatsapp_no"
                v-model="whatsapp_no"
                tabindex="4"
                placeholder="Enter WhatsApp Number"
              />
            </div>
          </div>
          <div class="border d-flex justify-content-center">
            <button
              class="btn btn-primary py-2 px-4"
              type="submit"
              tabindex="8"
            >
              Edit User
            </button>
          </div>
        </form>
      </card>
    </div>
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
      user_id: "",
      roles: [],
      departments: [],
    };
  },
  async created() {
    const res_getcurrent = await this.checkAuthorization();
    if (res_getcurrent) {
      const userId = this.$route.params.id;
      this.user_id = this.$route.params.id;
      const response = await axiosClient
        .get(`user/get/${userId}`)
        .catch((err) => {
          this.notifyVue("top", "center", err.response.data.message, "danger");
        });

      if (response) {
        if (response.data.message == "User Not Found") {
          this.notifyVue("top", "center", response.data.message, "danger");
          this.$router.push("/users");
        } else {
          console.log(response.data.data[0]);
          this.name = response.data.data[0].name;
          this.email = response.data.data[0].email;
          this.whatsapp_no = response.data.data[0].whatsapp_no;
          this.roleType = response.data.data[0].roleType;
          this.joining_date = response.data.data[0].joining_date;
          this.department = response.data.data[0].department;
          this.linkUIEnable = response.data.data[0].linkUIEnable;
          this.userUIEnable = response.data.data[0].userUIEnable;
          this.roleUIEnable = response.data.data[0].roleUIEnable;
          this.qaUIEnable = response.data.data[0].qaUIEnable;
          this.daUIEnable = response.data.data[0].daUIEnable;
          this.retriveUIEnable = response.data.data[0].retriveUIEnable;
          this.departmentUIEnable = response.data.data[0].departmentUIEnable;
          this.CRMUIEnable = response.data.data[0].CRMUIEnable;
        }
      }
    }
  },
  methods: {
    async checkAuthorization() {
      const auth = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      const res_getcurrent = await axiosClient
        .get(`user/getCurrent`, auth)
        .catch((err) => {
          console.log(err);
          if (err.response.status == 401) {
            this.notifyVue("top", "center", "User Not Authorized", "danger");
            this.$router.push("/login");
          }
        });
      return res_getcurrent;
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
      if (confirm("Are you sure you want to update?")) {
        const user = {
          name: this.name,
          whatsapp_no: this.whatsapp_no,
          roleType: this.roleType,
          joining_date: this.joining_date,
          department: this.department,
          userUIEnable: this.userUIEnable,
          roleUIEnable: this.roleUIEnable,
          departmentUIEnable: this.departmentUIEnable,
          linkUIEnable: this.linkUIEnable,
          qaUIEnable: this.qaUIEnable,
          daUIEnable: this.daUIEnable,
          retriveUIEnable: this.retriveUIEnable,
          CRMUIEnable: this.CRMUIEnable,
        };
        //console.log(user);

        const response = await axiosClient
          .put(`user/update/${this.user_id}`, user)
          .catch((err) => {
            this.notifyVue(
              "top",
              "center",
              err.response.data.message,
              "danger"
            );
          });
        if (response) {
          this.notifyVue("top", "center", "User Updated", "warning");
          this.$router.push("/users");
        }
      }
    },
  },
};
</script>
