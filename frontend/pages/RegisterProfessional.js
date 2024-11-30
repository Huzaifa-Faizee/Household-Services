export default {
  template: `
<div class="register-professional-main ">
  <div class="register-professional-box">
      <h4 class="heading-font register-heading">Register As Professional</h4>
      <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
          {{ alertMessage }}
      </div>
      <div class="container">
          <div class="row">
              <div class="col-6">
                  <div class="mb-3">
                      <label for="name" class="form-label">Name:</label>
                      <input type="text" class="form-control" id="name" v-model="name">
                  </div>
              </div>
              <div class="col-6">
                  <div class="mb-3">
                      <label for="email" class="form-label">Email address:</label>
                      <input type="email" class="form-control" id="email" v-model="email"
                          placeholder="name@example.com">
                  </div>
              </div>
          </div>
          <div class="row">
              <div class="col-12">
                  <div class="mb-3">
                      <label for="password" class="form-label">Password:</label>
                      <input type="password" class="form-control" id="password" v-model="password">
                  </div>
              </div>
          </div>
          <div class="row">
              <div class="col-6">
                  <div class="mb-3">
                      <label for="service" class="form-label">Service:</label>
                      <select name="service" class="form-control" v-model="service_data">
                          <option v-for="service in services" :value="service">{{service.name}}</option>
                      </select>
                  </div>
              </div>
              <div class="col-6">
                  <div class="mb-3">
                      <label for="business_name" class="form-label">Business Name:</label>
                      <input type="text" class="form-control" id="business_name" v-model="business_name">
                  </div>
              </div>
          </div>
          <div class="row">
              <div class="col-6">
                  <div class="mb-3">
                      <label for="experience" class="form-label">Experience:</label>
                      <input type="text" class="form-control" id="experience" v-model="experience">
                  </div>
              </div>
              <div class="col-6">
                  <div class="mb-3">
                      <label for="address" class="form-label">Address:</label>
                      <input type="text" class="form-control" id="address" v-model="address">
                  </div>
              </div>
          </div>
          <div class="row">
              <div class="col-12">
                  <div class="mb-3">
                      <label for="document" class="form-label">Document:</label>
                      <input type="file" class="form-control" id="document" @change="onFileChange">
                  </div>
              </div>
          </div>
      </div>
      <div class="register-button">
          <button class='button-58' @click="submitRegister"> Register </button>
      </div>
      <div class="register-link">
          <span @click="register">Are you a customer? Register here</span>
      </div>
  </div>
</div>
    `,
  data() {
    return {
      email: null,
      password: null,
      role: "service_provider",
      services: [],
      service_data: null,
      experience: null,
      name: null,
      business_name: null,
      experience: null,
      address: null,
      selectedFile: null,
      alertMessage: null,
      alertClass: null,
    };
  },
  mounted() {
    this.getServices();
  },
  methods: {
    async getServices() {
      const res = await fetch(location.origin + "/api/services", {
        headers: {
          // "Authentication-Token": this.$store.state.auth_token,
        },
      });
      if (res.ok) {
        let data = await res.json();
        this.services = data;
      } else {
        console.log("Not ok");
      }
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async submitRegister() {
      if (
        this.name != null &&
        this.email != null &&
        this.password != null &&
        this.service_data != null &&
        this.business_name != null &&
        this.experience != null &&
        this.address != null &&
        this.selectedFile != null
      ) {
        const formData = new FormData();
        formData.append("name", this.name);
        formData.append("email", this.email);
        formData.append("password", this.password);
        formData.append("role", this.role);
        formData.append("service_id", this.service_data.id);
        formData.append("price", this.service_data.base_price);
        formData.append("business_name", this.business_name);
        formData.append("experience", this.experience);
        formData.append("address", this.address);
        if (this.selectedFile) {
          formData.append("file", this.selectedFile); // Append the file
        }
        var res = await fetch(location.origin + "/registerProfessional", {
          method: "POST",
          // headers: { "Content-Type": "application/json" },
          body: formData,
        });
        if (res.ok) {
          let data = await res.json();
          console.log("we are registered");
          this.setAlert(
            "Professional request sent to the admin",
            "alert-success"
          );
        } else if (res.status == 404) {
          this.setAlert("User already exists", "alert-danger");
        } else if (res.status == 400) {
          this.setAlert(
            "Some error occured please try again later",
            "alert-warning"
          );
        }
        this.initialiseVariables();
      } else {
        this.setAlert("Please enter all fields", "alert-warning");
      }
    },
    setAlert(message, alertClass) {
      this.alertMessage = message;
      this.alertClass = alertClass;
      // Automatically dismiss the alert after 5 seconds
      setTimeout(() => {
        this.alertMessage = null;
        this.alertClass = null;
      }, 5000);
    },
    register() {
      this.$router.push("/register");
    },
    initialiseVariables() {
      this.email = null;
      this.password = null;
      this.service_data = null;
      this.experience = null;
      this.name = null;
      this.business_name = null;
      this.experience = null;
      this.address = null;
      this.selectedFile = null;
    },
  },
};
