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

.trash-icon {
  transition-duration: 200ms;
}

.trash-icon:hover {
  transform: translateY(-5px);
}
</style>
<template>
  <div class="container">
    <div>
      <div class="col-md-12" style="text-align: center; padding: 15px">
        <h2
          class="h3 mb-3 fw-normal"
          style="
            margin: 0px !important;
            font-family: sans-serif;
            font-weight: 600;
            color: #84b30e;
          "
        >
          Manage Translators
        </h2>
      </div>
    </div>
    <div class="d-flex flex-wrap justify-content-center">
      <div v-for="data in translators" :key="data">
        <div class="card m-2" style="width: 18rem">
          <div class="card-header">Name : {{ data.name }}</div>
          <div class="card-body">
            <h5 class="card-title">Number : {{ data.number }}</h5>

            <div class="mt-2 d-flex justify-content-between align-items-center">
              <div class="mx-1">
                <button
                  type="button"
                  @click="handleEditTranslator(data._id)"
                  class="btn btn-primary btn-sm"
                >
                  Edit
                </button>
              </div>
              <div class="mx-1">
                <button
                  @click="handleGetSentencesByTranslator(data._id)"
                  type="button"
                  class="btn btn-primary btn-sm"
                >
                  sentences
                </button>
              </div>

              <div v-if="data.stopped == true" class="mx-1">
                <button
                  @click="toggleMessageSending(data._id)"
                  type="button"
                  class="btn btn-primary btn-sm border-0 text-light fw-semibold"
                  style="background-color: blue"
                >
                  Start
                </button>
              </div>
              <div v-if="data.stopped == false" class="mx-1">
                <button
                  @click="toggleMessageSending(data._id)"
                  type="button"
                  class="btn btn-primary btn-sm border-0 text-light fw-semibold"
                  style="background-color: red"
                >
                  Stop
                </button>
              </div>
              <div class="d-flex align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bi bi-trash text-danger trash-icon"
                  viewBox="0 0 16 16"
                  style="cursor: pointer"
                  @click="deleteTranslator(data._id)"
                >
                  <path
                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
                  />
                  <path
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
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

      password: "",
      roleType: "1",
      joining_date: "",
      department: "1",
      type: ["", "info", "success", "warning", "danger"],
      notifications: {
        topCenter: false,
      },
      roles: [],
      departments: [],
      linkUIEnable: false,
      userUIEnable: false,
      roleUIEnable: false,
      qaUIEnable: false,
      daUIEnable: false,
      retriveUIEnable: false,
      departmentUIEnable: false,
      CRMUIEnable: false,
      translators: [],
    };
  },

  async created() {
    try {
      const response = await this.checkAuthorization();

      const translators = await axiosClient.get(`/translator/getall`);
      this.translators = translators.data;
      console.log("translators : ", this.translators);
    } catch (error) {
      console.error(error);
    }
  },

  methods: {
    async deleteTranslator(id) {
      console.log("deleteTranslator called id:", id);
      try {
        const response = await axiosClient.delete(`translator/delete/${id}`);

        if (response) {
          this.translators = this.translators.filter(
            (translator) => translator._id != id
          );
        }
      } catch (err) {
        console.log("error", err);
      }
    },
    async toggleMessageSending(id) {
      console.log("toggleMessageSending called id:", id);
      try {
        const response = await axiosClient.post(
          `translator/toggle-messages-sending-of-user/${id}`
        );

        if (response) {
          for (let i in this.translators) {
            if (this.translators[i]._id == id) {
              this.translators[i].stopped = !this.translators[i].stopped;

              /*  if (this.translators[i].stopped == true) {
          this.notifyVue("top", "center", "Started Message Sending", "success");
        } else {
          this.notifyVue("top", "center", "Stopped Message Sending", "success");
        } */
            }
          }
        }
      } catch (err) {
        console.log("error", err);
      }
    },

    handleGetSentencesByTranslator(id) {
      this.$router.push(`/sentences-by-translator/${id}`);
    },
    handleEditTranslator(id) {
      this.$router.push(`/edit-translator/${id}`);
    },
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

      const res_getcurrent = await this.checkAuthorization();

      if (res_getcurrent) {
        this.user_name = res_getcurrent.data.user.name;
        this.user_roleType = res_getcurrent.data.user.roleType;
        if (this.user_roleType == "admin" && this.roleType == "super_admin") {
          this.notifyVue(
            "top",
            "center",
            "You are not Authorized to Create Super Admin",
            "warning"
          );
          this.$router.push("/users");
        } else {
          const response = await axiosClient
            .post(`user/add`, user)
            .catch((err) => {
              alert(err.response.data.message);
            });
          if (response) {
            await this.notifyVue("top", "center", "User Created", "success");
            this.$router.push("/users");
          }
        }
      }
    },
  },
};
</script>
