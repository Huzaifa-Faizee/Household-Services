export default {
  template: `
    <h1>Professionals</h1>
    `,
  data() {
    return {
      professionals: [],
      pending_professionals: [],
      accepted_professionals: [],
      rejected_professionals: [],
    };
  },
  mounted() {
    this.getProfessionalData();
  },
  methods: {
    async getProfessionalData() {
      const res = await fetch(location.origin + "/api/professionals", {
        headers: {
          "Authentication-Token": this.$store.state.auth_token,
        },
      });
      if (res.ok) {
        let data = await res.json();
        this.professionals = data;
        this.professionals.forEach(prof => {
            if(prof.status="waiting"){
                this.pending_professionals.push(prof)
            }else if(prof.status="accepted"){
                this.accepted_professionals.push(prof)
            }else{
                this.rejected_professionals.push(prof)
            }
        });
      }
    },
  },
};
