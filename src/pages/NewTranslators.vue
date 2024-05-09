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
          New Translators
        </h2>
      </div>
    </div>
    <div class="border d-flex flex-wrap justify-content-center">
      <div v-for="data in translators" :key="data">
        <div class="card m-2" style="width: 18rem">
          <div class="card-header">Name : {{ data.name }}</div>
          <div class="card-body">
            <h5 class="card-title">Number : {{ data.number }}</h5>

            <div class="mt-2 d-flex">
              <div class="mx-2">
                <button
                  type="button"
                  @click="handleEditTranslator(data._id)"
                  class="btn btn-primary btn-sm"
                >
                  Edit
                </button>
              </div>
              <div class="mx-2">
                <button
                  @click="handleSendMSG(data.number)"
                  type="button"
                  class="btn btn-primary btn-sm"
                >
                  Send MSG
                </button>
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
  name: "NewTranslators",
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
      this.translators = this.translators.filter(
        (item) => item.firstReply != true
      );

      console.log("translators : ", this.translators);
    } catch (error) {
      console.error(error);
    }
  },

  methods: {
    async handleSendMSG(number) {
      const form = {
        number: number,
        template: "template",
      };
      console.log("form : ", form);

      try {
        const reponse = await axiosClient.post(
          `/google-sheets/send-whatsapp`,
          form
        );

        this.notifyVue("top", "center", "Template MSG Sent", "success");
      } catch (error) {
        console.error("error : ", error);
        this.notifyVue("top", "center", "Something went wrong", "warning");
      }
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
