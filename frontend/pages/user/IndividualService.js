export default {
  props: ["id"],
  template: `
    <div>
      <div v-if="currentService!=null">
        <h4>Service Details: {{currentService.name}}</h4>
        <p>{{currentService.description}}</p>
      </div>
    </div>
    `,
  data() {
    return {
      currentService: null,
      professionals: [],
    };
  },
  mounted() {
    this.currentService=JSON.parse(localStorage.getItem("currentService"))
    this.getProfessionals();
  },
  methods: {
    async getProfessionals() {
      const res = await fetch(
        location.origin + "/api/professionals/" + this.currentService.id,
        {
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        }
      );
      if (res.ok) {
        let data = await res.json();
        this.professionals = data;
        console.log(this.professionals, this.currentService);
      }
    },
  },
};
