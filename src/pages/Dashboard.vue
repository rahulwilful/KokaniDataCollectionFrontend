<template>
  <div
    class="container"
    style="
      max-width: 1240px !important;
      background-color: #f2f2f2;
      padding-bottom: 100px;
    "
  >
    <div class="row" style="text-align: center">
      <div class="col-md-12">
        <span style="font-size: 22px; font-weight: 600; font-family: sans-serif"
          >User Dashboard</span
        >
      </div>
    </div>

    <div class="row">
      <div class="col-md-3">
        <card class="my-3" style="text-align: center">
          <span
            style="font-size: 20px; font-weight: 600; font-family: sans-serif"
            >Total Users</span
          >
          <h4>{{ total_users }}</h4>
        </card>
      </div>
      <div @click="handleTotalTranslators" class="col-md-3">
        <card class="my-3" style="text-align: center; cursor: pointer">
          <span
            style="font-size: 20px; font-weight: 600; font-family: sans-serif"
            >Total Translators</span
          >
          <h4>{{ totalTranslators }}</h4>
        </card>
      </div>
      <div @click="handleNewTranslators" class="col-md-3">
        <card class="my-3" style="text-align: center; cursor: pointer">
          <span
            style="font-size: 20px; font-weight: 600; font-family: sans-serif"
            >New Translators</span
          >
          <h4>{{ newTranslators }}</h4>
        </card>
      </div>
      <div @click="handleStoppedTranslators" class="col-md-3">
        <card class="my-3" style="text-align: center; cursor: pointer">
          <span
            style="font-size: 20px; font-weight: 600; font-family: sans-serif"
            >Stopped Translators</span
          >
          <h4>{{ stoppedTranslators }}</h4>
        </card>
      </div>
      <div class="col-md-3">
        <card class="my-3" style="text-align: center">
          <span
            style="font-size: 20px; font-weight: 600; font-family: sans-serif"
            >Total Translated</span
          >
          <h4>{{ totalTranslated }}</h4>
        </card>
      </div>
      <div class="col-md-3">
        <card class="my-3" style="text-align: center">
          <span
            style="font-size: 20px; font-weight: 600; font-family: sans-serif"
            >Total Sentences</span
          >
          <h4>{{ totalSentences }}</h4>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import axiosClient from "../axiosClient.js";
import * as XLSX from "xlsx";

export default {
  name: "dashboard",
  data() {
    return {
      user_dict: [],
      values_user: [],
      names_user: [],
      values_entry: [],
      names_entry: [],
      values_entry_user: [],
      names_entry_user: [],
      user_name: "",
      user_roleType: "",
      total_users: 0,
      totalTranslated: 0,
      totalSentences: 0,
      totalTranslators: 0,
      created_to: "",
      created_from: "",
      no_of_superadmin: 0,
      no_of_admin: 0,
      no_of_deo: 0,
      no_of_qa: 0,
      no_of_crm: 0,
      newTranslators: 0,
      stoppedTranslators: 0,

      no_of_user_data: 0,
    };
  },

  async created() {
    let temp = "2,jsjbd,sj";
    let parts = temp.split(",");
    let firstPart = parts.shift(); // Extracting the first part
    let remainingString = parts.join(",");
    let variable = parseInt(temp[0]); // Example variable holding a number
    if (!isNaN(variable)) {
      console.log("The variable holds a number.", variable);
      console.log("firstPart String.", firstPart);
      if (remainingString) {
        console.log("Reamaining String.", remainingString);
      }
    } else {
      console.log("The variable does not hold a number.", variable);
      console.log("firstPart String.", firstPart);
      if (remainingString) {
        console.log("Reamaining String.", remainingString);
      }
    }

    const auth = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    const response = await axiosClient.get(`user/getCurrent`).catch((err) => {
      console.log(err);
      if (err.response.status == 401) {
        this.$router.push("/login");
      }
    });

    if (response) {
      this.user_name = response.data.user.name;
      this.user_roleType = response.data.user.roleType;

      const userResponse = await axiosClient.get(`user/getall`).catch((err) => {
        console.log(err);
        this.$router.push("/dashboard");
      });
      const all_users = userResponse.data.data;
      this.total_users = all_users.length;

      const translators = await axiosClient.get(`translator/getall`);
      this.totalTranslators = translators.data.length;
      const newTranslators = translators.data.filter(
        (item) => item.firstReply != true
      );

      this.newTranslators = newTranslators.length;
      const stoppedTranslators = translators.data.filter(
        (item) => item.stopped != false
      );

      this.stoppedTranslators = stoppedTranslators.length;
      console.log("Translators : ", translators);

      const sentences = await axiosClient.get(`google-sheets/getdata`);
      this.totalSentences = sentences.data.result.length;
      console.log("Sentences : ", sentences);

      const translated = await axiosClient.get(`sentence/getall`);
      this.totalTranslated = translated.data.result.length;
      console.log("Translated : ", translated);

      const superadmin_Users = all_users.filter(
        (users) => users.roleType == "super_admin"
      );
      this.no_of_superadmin = superadmin_Users.length;
      const admin_Users = all_users.filter(
        (users) => users.roleType == "admin"
      );
      this.no_of_admin = admin_Users.length;
      const deo_users = all_users.filter(
        (users) => users.roleType == "data_entry_operator"
      );
      this.no_of_deo = deo_users.length;
      const qa_users = all_users.filter(
        (users) => users.roleType == "quality_assurance"
      );
      this.no_of_qa = qa_users.length;

      const crm_users = all_users.filter(
        (users) => users.roleType == "CRM Admin"
      );
      this.no_of_crm = crm_users.length;

      this.values_user = [
        this.no_of_superadmin,
        this.no_of_admin,
        this.no_of_deo,
        this.no_of_qa,
        this.no_of_crm,
      ];
      /* this.values = [10, 5, 4, 3]; */

      this.names_user = [
        "Super Admin",
        "Admin",
        "Data Entry Operator",
        "Quality Assurance",
        "CRM Admin",
      ];
    }
  },
  computed: {
    filteredValues() {
      return this.values_user.filter((value) => value !== 0);
    },
    filteredNames() {
      return this.names_user.filter(
        (_, index) => this.values_user[index] !== 0
      );
    },
  },
  methods: {
    handleLogout() {
      localStorage.removeItem("token");
      this.$router.go(0);
    },
    handleTotalTranslators() {
      console.log("handleTotalTranslators called");
      this.$router.push("/manage-traslators");
    },
    handleNewTranslators() {
      this.$router.push("/new-translators");
    },
    handleStoppedTranslators() {
      this.$router.push("/stopped-translators");
    },
  },
};
</script>
<style scoped>
.tableHeight {
  height: 200px; /* Adjust the height as needed */
  overflow-y: auto;
}
</style>
