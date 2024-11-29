export default {
    template: `
      <div>
          <h1>Summary</h1>
          <img :src="'/chart/'+charts['bar_chart']" alt="">
      </div>
      `,
    data() {
      return {
        charts: null,
      };
    },
    mounted() {
      this.getStats();
    },
    methods: {
      async getStats() {
        const res = await fetch(location.origin + "/api/professional-stats/"+this.$store.state.user_id, {
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        });
        if (res.ok) {
          let data = await res.json();
          this.charts = data;
        }
      },
    },
  };
  