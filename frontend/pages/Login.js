export default {
  template: `
<div class="login-main">
  <div class="login-box">
      <h4 class="heading-font login-heading">Login</h4>
      <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
        {{ alertMessage }}
      </div>
      <div class="mb-3">
          <label for="email" class="form-label">Email address:</label>
          <input type="email" class="form-control" id="email" v-model="email" placeholder="name@example.com">
      </div>
      <div class="mb-3">
          <label for="password" class="form-label">Password:</label>
          <input type="password" class="form-control" id="password" v-model="password">
      </div>
      <div class="login-button">
        <button class='button-58' @click="submitLogin"> Login </button>
      </div>
      <div class="login-link">
        <span @click="register">New here? Register</span>
      </div>
  </div>
</div>
    `,
  data() {
    return {
      email: null,
      password: null,
      alertMessage: null,
      alertClass: null,
    };
  },
  methods: {
    async submitLogin() {
      if (this.email != null && this.password != null) {
        let submitData = {
          email: this.email,
          password: this.password,
        };
        const res = await fetch(location.origin + "/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });

        if (res.ok) {
          console.log("we are logged in");
          const data = await res.json();
          console.log(data);
          localStorage.setItem("user", JSON.stringify(data));
          if (data.role == "admin") {
            this.$store.commit("setUser");
            this.$router.push("/admin-home");
          } else if (data.role == "service_provider") {
            this.handleProfessionalLogin(data);
          } else if (data.role == "user") {
            this.handleUserLogin(data);
          }
        } else if (res.status == 400) {
          this.setAlert("Wrong Password", "alert-danger");
        } else if (res.status == 404) {
          this.setAlert("User doesn't exist, Please register", "alert-danger");
        }
      } else {
        this.setAlert("Please enter all credentials", "alert-warning");
      }
    },
    handleProfessionalLogin(data) {
      if (data.status == "waiting") {
        this.setAlert("Your account is still under review.", "alert-warning");
      } else if (data.status == "rejected") {
        this.setAlert("Your account application was rejected.", "alert-danger");
      } else if (data.status == "accepted") {
        this.$store.commit("setUser");
        this.$router.push("/professional-home");
      }
    },
    handleUserLogin(data) {
      if (data.status == "active") {
        this.$store.commit("setUser");
        this.$router.push("/user-home");
      } else if (data.status == "blocked") {
        this.setAlert(
          "Your account has been blocked by admin. Please Contact Admin to login",
          "alert-danger"
        );
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
  },
};
