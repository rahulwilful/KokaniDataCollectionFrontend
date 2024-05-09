<style>
.green-button {
  background-color: green; /* Green background color */
  border-color: green; /* Green border color */
  color: #fff; /* White text color */
  height: 45px;
  margin-bottom: 10px;
}

.green-button:hover {
  background-color: #6a940e; /* Darker green background color on hover */
  border-color: #6a940e;
  color: white; /* Darker green border color on hover */
}
</style>
<template>
  <nav class="navbar navbar-expand-lg" style="background-color: #ffffeb">
    <div class="container-fluid">
      <!-- <a class="navbar-brand" href="#">Dashboard</a> -->
      <button
        type="button"
        class="navbar-toggler navbar-toggler-right"
        :class="{ toggled: $sidebar.showSidebar }"
        aria-controls="navigation-index"
        aria-expanded="false"
        aria-label="Toggle navigation"
        @click="toggleSidebar"
      >
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <button
              v-if="startMessages == false"
              type="button"
              class="btn btn-primary border-0 text-light fw-bold"
              style="background-color: blue"
              @click="toggleMessageSending"
            >
              Start Messages
            </button>

            <button
              v-if="startMessages == true"
              type="button"
              class="btn btn-primary border-0 text-light fw-bold"
              style="background-color: red"
              @click="toggleMessageSending"
            >
              Stop Messages
            </button>
          </li>

          <li class="nav-item">
            <a
              class="nav-link"
              href="/admin/user"
              style="
                font-weight: 600;
                text-transform: uppercase;
                font-size: 13px;
              "
              ><img src="/ua.png" style="width: 50px; height: 50px" />
              <span style="margin-top: 18px">User Account</span>
            </a>
          </li>
          <!-- <base-dropdown title="Dropdown">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something</a>
            <div class="divider"></div>
            <a class="dropdown-item" href="#">Separated link</a>
          </base-dropdown> -->
          <li class="nav-item">
            <button
              type="button"
              class="btn btn-primary green-button"
              @click.prevent="handleLogout"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import axiosClient from "../axiosClient.js";
export default {
  data() {
    return {
      user_id: "",
      startMessages: true,
      type: ["", "info", "success", "warning", "danger"],
      notifications: {
        topCenter: false,
      },
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
      this.user_id = response.data.user._id;

      //console.log(this.all_notifications);
    }

    const startMessages = await axiosClient.get(
      `/google-sheets/get-last-count`
    );
    this.startMessages = startMessages.data.result[0].startSendingMessages;
    console.log("startMessages: ", startMessages.data.result[0]);
  },
  computed: {
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    },
  },
  methods: {
    async toggleMessageSending() {
      console.log("toggleMessageSending called");
      try {
        const response = await axiosClient.post(
          `/google-sheets/stop-sending-messages`
        );

        if (response) {
          this.startMessages = !this.startMessages;
        }
        /*  if (this.startMessages == true) {
          this.notifyVue("top", "center", "Started Message Sending", "success");
        } else {
          this.notifyVue("top", "center", "Stopped Message Sending", "success");
        } */
      } catch (err) {
        console.log("error", err);
      }
    },

    handleLogout() {
      localStorage.removeItem("token");
      this.$router.go(0);
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
  },
};
</script>
<style>
a:hover {
  /* background-color: yellow; */
  color: #84b30e !important;
}

.dropdown-item {
  /* font-weight: bold; */
  color: #333;
}
</style>
