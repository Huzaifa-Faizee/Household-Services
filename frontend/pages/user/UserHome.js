export default {
  template: `
  <div class="page-body">
    <div class="page-heading"> User Home </div>
    <div class="sub-heading">What do you want to do?</div>
    <div class="card" style="width: 18rem;" v-for="service in services">
        <div class="card-body">
            <h5 class="card-title">{{service.name}}</h5>
            <p class="card-text">{{service.description}}</p>
            <a href="#" class="btn btn-primary" @click="viewProfessional(service)">View Professionals</a>
        </div>
    </div>
  </div>
    `,
  data() {
    return {
      services: [],
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
        console.log(this.services);
      }
    },
    viewProfessional(service) {
      localStorage.setItem("currentService", JSON.stringify(service));
      this.$router.push("/individual-service");
    },
  },
};
