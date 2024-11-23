export default {
  props: ["id"],
  template: `
    <div>
        {{this.id}}
    </div>
    `,
  data() {
    return {
      currentService: null,
      professionals: [],
    };
  },
  mounted() {
    this.getProfessionals();
    this.getService();
  },
  methods: {
    async getProfessionals() {
      const res = await fetch(
        location.origin + "/api/professionals/" + this.id,
        {
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        }
      );
      if (res.ok) {
        let data = await res.json();
        this.professionals = data;
        this.currentService = this.professionals[0].service;
        console.log(this.professionals, this.currentService);
      }
    },
  },
};
