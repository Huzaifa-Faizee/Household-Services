export default {
  template: `
  <div class="page-body">
    <div class="page-heading">Summary</div>
    <div class="sub-heading">Requests</div>
    <div class="chart-image">
        <img class="chart" :src="'/chart/'+charts['bar_chart']" alt="">
    </div>
    <div class="sub-heading">Users</div>
    <div class="chart-image">
        <img class="chart" :src="'/chart/'+charts['pie_chart']" alt="">
    </div>
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
      const res = await fetch(location.origin + "/api/admin-stats", {
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
