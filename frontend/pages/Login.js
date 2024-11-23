export default {
  template: `
    <div>
        <input placeholder="email"  v-model="email"/>  
        <input placeholder="password"  v-model="password"/>  
        <button class='btn btn-primary' @click="submitLogin"> Login </button>

        <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
            {{ alertMessage }}
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
        this.$store.commit("setUser");
        if (data.role == "admin") {
          this.$router.push("/admin-home");
        } else if (data.role == "service_provider") {
          this.handleProfessionalLogin(data);
        }
      }
    },
    handleProfessionalLogin(data) {
      if ((data.status == "waiting")) {
        this.setAlert("Your account is still under review.", "alert-warning");
      } else if ((data.status == "rejected")) {
        this.setAlert("Your account application was rejected.", "alert-danger");
      } else if ((data.status == "accepted")) {
        this.$router.push("/professional-home");
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
  },
};
