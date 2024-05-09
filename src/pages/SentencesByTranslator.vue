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
          Translated Sentences
        </h2>
      </div>
    </div>
    <div v-for="data in sentences" :key="data">
      <div
        @click="GetSentenceById(data._id)"
        class="bg-success-subtle my-2 w-100 rounded d-flex fw-medium"
        style="height: 4rem; cursor: pointer"
      >
        <div
          class="h-100 d-flex flex-column justify-content-evenly px-3"
          style="width: 80%"
        >
          <div><strong>Sentence</strong>: {{ data.sentence.slice(0, 90) }}</div>
          <div>
            <strong>Translation</strong>: {{ data.translation.slice(0, 90) }}
          </div>
        </div>
        <div
          class="border d-flex flex-column justify-content-evenly"
          style="width: 20%"
        >
          <div><strong>Translator</strong>: {{ data.translator_id.name }}</div>
          <div><strong>Sentence Id</strong>: {{ data.sentence_id }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosClient from "../axiosClient.js";

export default {
  name: "create_user",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
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
      sentences: [],
    };
  },

  async created() {
    try {
      const response = await this.checkAuthorization();

      const sentences = await axiosClient.get(
        `/sentence/get-sentences-by-translator/${this.id}`
      );
      this.sentences = sentences.data.result;
      console.log("sentences : ", this.sentences);
    } catch (error) {
      console.error(error);
    }
  },

  methods: {
    GetSentenceById(id) {
      console.log("id : ", id);
      this.$router.push(`/sentence/${id}`);
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
