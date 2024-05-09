<template>
  <div class="wrapper">
    <side-bar>
      <!-- <mobile-menu slot="content"></mobile-menu> -->
      <sidebar-link to="/dashboard">
        <i class="nc-icon nc-chart-pie-35"></i>
        <p>Dashboard</p>
      </sidebar-link>

      <li>
        <a
          href="/users"
          v-if="user_roleType == 'super_admin' || user_roleType == 'admin'"
          class="nav-link"
          ><i class="nc-icon nc-circle-09"></i>
          <p>Users</p></a
        >
      </li>

      <!-- <sidebar-link
        :to="{ path: '/users' }"
        v-if="user_roleType == 'super_admin' || user_roleType == 'admin'"
      >
        <i class="nc-icon nc-circle-09"></i>
        <p>Users</p>
      </sidebar-link> -->

      <sidebar-link
        :to="{ path: '/roles' }"
        v-if="user_roleType == 'super_admin'"
      >
        <i class="nc-icon nc-notes"></i>
        <p>Roles</p>
      </sidebar-link>
      <sidebar-link to="/departments" v-if="user_roleType == 'super_admin'">
        <i class="nc-icon nc-paper-2"></i>
        <p>Departments</p>
      </sidebar-link>
      <sidebar-link
        to="/links"
        v-if="user_roleType == 'super_admin' || user_roleType == 'admin'"
      >
        <i class="nc-icon nc-paper-2"></i>
        <p>Links</p>
      </sidebar-link>
      <sidebar-link
        to="/qa"
        v-if="
          user_roleType == 'super_admin' ||
          user_roleType == 'admin' ||
          user_roleType == 'quality_assurance'
        "
      >
        <i class="nc-icon nc-paper-2"></i>
        <p>Quality Assurance</p>
      </sidebar-link>
      <sidebar-link to="/dataentry" key="">
        <i class="nc-icon nc-paper-2"></i>
        <p>Data Entry</p>
      </sidebar-link>
      <sidebar-link
        to="/retrive"
        v-if="user_roleType == 'super_admin' || user_roleType == 'admin'"
      >
        <i class="nc-icon nc-paper-2"></i>
        <p>Retrive</p>
      </sidebar-link>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click="toggleSidebar"> </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss"></style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
/* import MobileMenu from "./MobileMenu.vue"; */
import axiosClient from "../axiosClient.js";

export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
  },
  data() {
    return {
      user_name: "",
      user_roleType: "",
      all_users: [],
    };
  },
  async created() {
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
    if (response) {
      this.user_name = response.data.user.name;
      this.user_roleType = response.data.user.roleType;
    }
  },

  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
};
</script>
