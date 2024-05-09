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
    <div class="col-12" style="padding-bottom: 100px">
      <card class="my-3">
        <form class="my-10">
          <div class="row">
            <div class="col-md-12" style="text-align: center">
              <h2
                class="h3 mb-3 fw-normal"
                style="
                  margin: 0px !important;
                  font-family: sans-serif;
                  font-weight: 600;
                  color: #84b30e;
                "
              >
                Edit Translator
              </h2>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <label for="name" class="form-label">Name</label>
              <input
                type="text"
                class="form-control mb-3 custom-disabled"
                id="name"
                tabindex="1"
                v-model="form.name"
                placeholder="Enter Translator Name"
                autofocus
              />

              <button
                class="btn btn-primary my-3 gradient-button"
                type="button"
                tabindex="8"
                @click.prevent="handleSubmit"
              >
                <b>Update Translator</b>
              </button>
            </div>
            <div class="col-md-6">
              <label for="email" class="form-label">Number</label>
              <input
                type="number"
                class="form-control mb-3 custom-disabled"
                tabindex="2"
                id="email"
                v-model="form.number"
                placeholder="Enter Whatsapp Number"
              />
            </div>
          </div>
        </form>
      </card>
    </div>
  </div>
</template>

<script>
import axiosClient from "../axiosClient.js";

export default {
  name: "EditTranslator",
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
      whatsapp_no: "",
      password: "",
      roleType: "1",
      joining_date: "",
      department: "1",
      type: ["", "info", "success", "warning", "danger"],
      notifications: {
        topCenter: false,
      },
      form: {
        name: "",
        number: "",
      },
    };
  },
  async created() {
    try {
      console.log("id : ", this.id);
      const response = await this.checkAuthorization();
      if (response) {
        this.getTranslator();
      }
    } catch (error) {
      console.error(error);
    }
  },

  methods: {
    async getTranslator() {
      const translator = await axiosClient.get(
        `/translator/get_by_id/${this.id}`
      );

      this.form.name = translator.data.name;
      this.form.number = translator.data.number;
      console.log("translator : ", translator);
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
        if (this.form.name == "") {
          this.notifyVue("top", "center", "Enter Translator name", "warning");
          return;
        }
        if (this.form.name.length < 3) {
          this.notifyVue(
            "top",
            "center",
            "Name should be atleast of three characters",
            "warning"
          );
          return;
        }

        if (this.form.number == "" || this.form.number.length < 12) {
          this.notifyVue(
            "top",
            "center",
            "Number should start from 91 and must be 12 digits",
            "warning"
          );
          return;
        }

        try {
          const translator = await axiosClient.post(
            `/translator/update/${this.id}`,
            this.form
          );
          this.notifyVue("top", "center", `Translatore Updated`, "success");
          console.log("Translator : ", translator);
        } catch (error) {
          console.log("error : ", error);
          if (error.response.status == 404) {
            this.notifyVue("top", "center", "Translator Exist", "warning");
          } else {
            this.notifyVue("top", "center", "Something went wrong", "warning");
          }
        }

        console.log(this.form);

        /* else {
          const response = await axiosClient
            .post(`user/add`, user)
            .catch((err) => {
              alert(err.response.data.message);
            });
          if (response) {
            await this.notifyVue("top", "center", "User Created", "success");
            this.$router.push("/users");
          }
        } */
      }
    },
  },
};
</script>
