export default {
  template: `
  <div class="register-main">
  <div class="register-box">
      <h4 class="heading-font register-heading">Register</h4>
      <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
          {{ alertMessage }}
      </div>
      <div class="mb-3">
          <label for="name" class="form-label">Name:</label>
          <input type="text" class="form-control" id="name" v-model="name">
      </div>
      <div class="mb-3">
          <label for="email" class="form-label">Email address:</label>
          <input type="email" class="form-control" id="email" v-model="email" placeholder="name@example.com">
      </div>
      <div class="mb-3">
          <label for="password" class="form-label">Password:</label>
          <input type="password" class="form-control" id="password" v-model="password">
      </div>
      <div class="register-button">
          <button class='button-58' @click="submitRegister"> Register </button>
        </div>
        <div class="register-link">
          <span @click="registerAsProfessional">Want to register as a professional? Register here</span>
        </div>
  </div>
</div>
    `,
  data() {
    return {
      email: null,
      password: null,
      role: "user",
      name: null,
      alertMessage: null,
      alertClass: null,
    };
  },
  methods: {
    async submitRegister() {
      if (this.name != null && this.email != null && this.password != null) {
        let userData = {
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role,
        };
        var res = await fetch(location.origin + "/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });
        if (res.ok) {
          let data = await res.json();
          this.setAlert(
            "User created successfully , Please Login to continue",
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
        this.initialiseVariables()
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
    registerAsProfessional() {
      this.$router.push("/registerProfessional");
    },
    initialiseVariables() {
      this.email = null;
      this.password = null;
      this.role = "user";
      this.name = null;
    },
  },
};
