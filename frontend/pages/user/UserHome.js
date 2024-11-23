export default {
  template: `
        <div>
            <h1> User Home </h1>
            <div class="card" style="width: 18rem;" v-for="service in services">
                <div class="card-body">
                    <h5 class="card-title">{{service.name}}</h5>
                    <p class="card-text">{{service.description}}</p>
                    <a href="#" class="btn btn-primary" @click="viewProfessional(service.id)">View Professionals</a>
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
    viewProfessional(id) {
      this.$router.push("/individual-service/"+id);
    },
  },
};
