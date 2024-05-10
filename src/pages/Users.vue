<style>
.green-button {
  background-color: #84b30e; /* Green background color */
  border-color: #84b30e; /* Green border color */
  color: #fff; /* White text color */
  height: 35px;
}

.green-button:hover {
  background-color: #6a940e; /* Darker green background color on hover */
  border-color: #6a940e; /* Darker green border color on hover */
}
</style>
<template>
  <div
    class="container"
    style="max-width: 1240px !important; background-color: #f2f2f2"
  >
    <!-- <div class="row">
      <div class="col-md-12">
        <div class="card my-3">
          <div class="card-body" style="text-align: center"></div>
        </div>
      </div>
    </div> -->
    <div class="row">
      <div class="col-12" style="padding-bottom: 150px">
        <button
          type="button"
          class="btn btn-primary my-3 green-button"
          @click.prevent="handleCreateBtnClick"
        >
          Create User
        </button>

        <card
          class="strpied-tabled-with-hover"
          body-classes="table-full-width table-responsive"
        >
          <div class="row">
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
                User Management
              </h2>
            </div>
          </div>

          <input
            class="form-control"
            type="text"
            placeholder="Search.."
            style="margin-left: 10px"
            v-model="searchQuery"
          />
          <br />
          <b-table
            id="my-table"
            striped
            outlined
            hover
            :per-page="perPage"
            :current-page="currentPage"
            :fields="fields"
            :items="filteredData"
            style="white-space: nowrap; overflow: hidden"
          >
            <template #cell(approved)="{ item }">
              {{ item ? (item.approved == true ? "Active" : "Inactive") : "" }}
            </template>
            <template #cell(action)="{ item }">
              <span class="mx-2"
                ><router-link
                  :to="'/user/view/' + item._id"
                  style="color: #84b30e"
                  ><i
                    class="fa fa-eye eye"
                    data-toggle="tooltip"
                    title="View User"
                  ></i></router-link
              ></span>
              <span class="mx-2"
                ><router-link
                  :to="'/user/edit/' + item._id"
                  style="color: #84b30e"
                  ><i
                    class="fa fa-pencil pencil"
                    data-toggle="tooltip"
                    title="Edit User"
                  ></i></router-link
              ></span>

              <span class="mx-2"
                ><i
                  class="fa fa-trash trash"
                  data-toggle="tooltip"
                  title="Delete User"
                  @click.prevent="handleDelete(`${item._id}`)"
                  style="color: #84b30e; cursor: pointer"
                ></i
              ></span>
              <span class="mx-2"
                ><i
                  class="fa fa-key key"
                  data-toggle="tooltip"
                  title="Change User Password"
                  @click.prevent="handleChangePass(`${item._id}`)"
                  style="color: #84b30e"
                ></i
              ></span>
            </template>
          </b-table>

          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
            first-text="First"
            prev-text="Prev"
            next-text="Next"
            last-text="Last"
            class="my-2 mx-2"
          ></b-pagination>
          <div class="col-md-6">
            <label for="perPage" class="form-label">Entries Per Page: </label>
            <select class="mx-3" aria-label="perPage" v-model="perPage">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </card>
      </div>
    </div>

    <div id="app">
      <div v-if="showModal">
        <transition name="modal">
          <div class="modal-mask">
            <div class="modal-wrapper">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Change User Password</h5>
                    <button
                      type="button"
                      class="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true" @click="showModal = false"
                        >&times;</span
                      >
                    </button>
                  </div>
                  <div class="modal-body">
                    <label for="password" class="form-label"
                      >Enter New Password</label
                    >
                    <input
                      type="text"
                      class="form-control mb-3"
                      tabindex="3"
                      id="password"
                      v-model="new_pass"
                      placeholder="Enter User Password"
                      v-if="showPassword"
                    />
                    <input
                      type="password"
                      class="form-control mb-3"
                      tabindex="3"
                      id="password"
                      v-model="new_pass"
                      placeholder="Enter User Password"
                      v-else
                    />
                    <div class="col-md-12" style="text-align-last: right">
                      <button
                        type="button"
                        class="btn btn-light"
                        @click="toggleShow"
                      >
                        <span v-if="showPassword"
                          ><i class="fa fa-eye-slash"></i
                        ></span>
                        <span v-else><i class="fa fa-eye eye"></i></span>
                      </button>
                    </div>
                    <!-- <input
                      type="password"
                      class="form-control mb-3"
                      tabindex="3"
                      id="password"
                      v-model="new_pass"
                      placeholder="Enter User Password"
                    /> -->
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click="showModal = false"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click.prevent="changeUserPassword"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div id="app">
      <div v-if="showModal1">
        <transition name="modal">
          <div class="modal-mask">
            <div class="modal-wrapper">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Send Notification</h5>
                    <button
                      type="button"
                      class="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true" @click="closeNotification"
                        >&times;</span
                      >
                    </button>
                  </div>
                  <div class="modal-body">
                    <label for="password" class="form-label"
                      >Enter Notification Text</label
                    >
                    <input
                      type="text"
                      class="form-control mb-3"
                      tabindex="3"
                      id="notification_text"
                      v-model="notification_text"
                      placeholder="Enter Text"
                    />
                    <label for="notification_type" class="form-label"
                      >Notification Type</label
                    >
                    <select
                      class="form-select mb-3"
                      aria-label="notification_type"
                      v-model="notification_type"
                    >
                      <option value="info" selected>Info</option>
                      <option value="warning">Warning</option>
                      <option value="danger">Danger</option>
                    </select>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click="showModal1 = false"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click.prevent="sendNotification"
                    >
                      Send Notification
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import axiosClient from "../axiosClient.js";
import Card from "src/components/Cards/Card.vue";

export default {
  name: "users",
  components: {
    Card,
  },
  data() {
    return {
      notification_type: "info",
      notification_text: "",
      showPassword: false,
      perPage: 10,
      currentPage: 1,
      user_name: "",
      user_roleType: "",
      all_users: [],
      showModal: false,
      showModal1: false,
      new_pass: "",
      user_id: "",
      userNotification_id: "",
      searchQuery: "",
      pageOfItems: [],
      fields: [
        {
          key: "name",
          sortable: true,
        },
        {
          key: "email",
          sortable: true,
        },
        {
          key: "whatsapp_no",
          sortable: false,
        },

        {
          key: "approved",
          sortable: true,
        },
        {
          key: "action",
          sortable: false,
        },
      ],
    };
  },
  async created() {
    const response = await this.checkAuthorization();
    console.log(response);
    if (response) {
      this.user_name = response.data.user.name;
      this.fetchUsers();
    }
  },
  computed: {
    filteredData() {
      const searchQueryLower = this.searchQuery.toLowerCase();
      function searchInObject(obj) {
        return Object.values(obj).some((value) => {
          if (value && typeof value === "object") {
            return searchInObject(value);
          }
          return value.toString().toLowerCase().includes(searchQueryLower);
        });
      }

      return this.all_users.filter((data) => searchInObject(data));
    },
    rows() {
      return this.filteredData.length;
    },
  },
  methods: {
    closeNotification() {
      this.showModal1 = false;
      this.notification_text = "";
    },
    toggleShow() {
      this.showPassword = !this.showPassword;
    },
    onChangePage(pageOfItems) {
      this.pageOfItems = pageOfItems;
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
    async fetchUsers() {
      await axiosClient
        .get(`user/getall`)
        .then((userResponse) => {
          this.all_users = userResponse.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    },
    async sendNotification() {
      //console.log(this.userNotification_id, this.notification_text);
      const notification = {
        text: this.notification_text,
        type: this.notification_type,
        to_user: this.userNotification_id,
      };
      const response = await axiosClient
        .post(`notification/add`, notification)
        .catch((err) => {
          this.notifyVue("top", "center", err.response.data.message, "danger");
        });

      if (response.status) {
        this.notifyVue("top", "center", "Notification Sent", "success");
        /* this.showModal1 = false;
        this.notification_text = ""; */
        this.$router.go(0);
      }
    },
    handleSendNotification(user_id) {
      this.userNotification_id = user_id;
      this.showModal1 = true;
    },
    notifyVue(verticalAlign, horizontalAlign, message, NotificationType) {
      const color = NotificationType;
      this.$notifications.notify({
        message: `<span>${message}</span>`,
        icon: "nc-icon nc-check-2",
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        type: color,
      });
    },
    handleCreateBtnClick() {
      this.$router.push("/user/create");
    },
    async handleDelete(id) {
      if (confirm("Are you sure you want to delete?")) {
        const response = await axiosClient
          .put(`user/delete/${id}`)
          .catch((err) => {
            this.notifyVue(
              "top",
              "center",
              err.response.data.message,
              "danger"
            );
          });
        if (response) {
          this.notifyVue("top", "center", "User Deleted", "success");
          this.$router.go(0);
        }
      }
    },
    async handleAppDis(id) {
      if (confirm("Are you sure you want to Chnage User Status?")) {
        const response = await axiosClient
          .put(`user/app_dis/${id}`)
          .catch((err) => {
            this.notifyVue(
              "top",
              "center",
              err.response.data.message,
              "danger"
            );
          });
        if (response) {
          this.notifyVue("top", "center", "User Status Changed", "success");
          this.$router.go(0);
        }
      }
    },
    handleChangePass(id) {
      this.user_id = id;
      this.showModal = true;
    },

    async changeUserPassword() {
      const user = {
        password: this.new_pass,
      };
      if (confirm("Are you sure you want to Chnage User Password?")) {
        const response = await axiosClient
          .put(`user/change/pass/${this.user_id}`, user)
          .catch((err) => {
            this.notifyVue(
              "top",
              "center",
              err.response.data.message,
              "danger"
            );
          });
        if (response) {
          this.notifyVue("top", "center", "User Password Changed", "success");
          this.$router.go(0);
        }
      }
    },
  },
};
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>
