<template>
  <div class="wrapper">
    <side-bar>
      <div style="text-align-last: center; padding-bottom: 2px">
        <span style="font-size: 13px; color: #84b30e">Welcome</span
        ><span style="font-size: 14px; text-transform: uppercase">
          {{ user_name }}!</span
        ><br />
        <span style="font-size: 13px; font-style: italic">{{
          user_email
        }}</span>
      </div>
      <!-- <mobile-menu slot="content"></mobile-menu> -->
      <sidebar-link to="/dashboard">
        <i class="nc-icon nc-tv-2"></i>
        <p>Dashboard</p>
      </sidebar-link>

      <base-dropdown tag="li">
        <template slot="title">
          <i class="nc-icon nc-circle-09"></i>Users
        </template>
        <router-link class="dropdown-item" to="/users"
          >Manage Users</router-link
        >
        <router-link class="dropdown-item" to="/user/create"
          >Add Users</router-link
        >
      </base-dropdown>
      <base-dropdown tag="li">
        <template slot="title">
          <i class="nc-icon nc-circle-09"></i>Translators
        </template>

        <router-link class="dropdown-item" to="/manage-traslators"
          >Manage Translators</router-link
        >
        <router-link class="dropdown-item" to="/add-translator"
          >Add Translator</router-link
        >
      </base-dropdown>
      <base-dropdown tag="li">
        <template slot="title">
          <i class="nc-icon nc-notes"></i>Sentences
        </template>

        <router-link class="dropdown-item" to="/translated-sentences"
          >Translated Sentences</router-link
        >
      </base-dropdown>
    </side-bar>
    <div
      class="main-panel"
      style="background-color: #f2f2f2"
      :class="{ 'main-panel-collapsed': !sidebarOpen }"
    >
      <top-navbar></top-navbar>
      <dashboard-content @click="toggleSidebar"> </dashboard-content>
    </div>
  </div>
</template>

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
      user_email: "",
      all_users: [],

      sidebarOpen: true,
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
      this.user_email = response.data.user.email;
    }
  },

  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    /* toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }, */
  },
};
</script>
<style>
/* Styles for the button and sidebar */
.toggle-sidebar-button {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1000;
}

.side-bar {
  transition: transform 0.3s ease; /* Add transition for sidebar */
}

.sidebar-open {
  transform: translateX(0); /* Sidebar open position */
}

.main-panel {
  transition: margin-left 0.3s ease; /* Add transition for main panel */
  margin-left: 240px; /* Initial margin when sidebar is open */
}

.main-panel-collapsed {
  margin-left: 80px; /* Adjusted margin when sidebar is closed */
}

/* Media query for small screens */
@media (max-width: 768px) {
  .main-panel {
    margin-left: 0; /* Reset margin for small screens */
  }

  .sidebar-open {
    transform: translateX(
      -100%
    ); /* Hide sidebar off-screen for small screens */
  }
}
</style>
