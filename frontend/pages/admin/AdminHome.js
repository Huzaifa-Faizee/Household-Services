export default {
  template: `
  <div class="page-body all-boxes">
  <div class="box">
      <div class="box-title">
          Customers
      </div>
      <div class="box-data">
          {{users_count}}
      </div>
  </div>
  <div class="box">
      <div class="box-title">
          Professionals
      </div>
      <div class="box-data">
          {{professionals_count}}
      </div>
  </div>
  <div class="box">
      <div class="box-title">
          Active Requests
      </div>
      <div class="box-data">
          {{active_requests_count}}
      </div>
  </div>
  <div class="box">
      <div class="box-title">
          Closed Requests
      </div>
      <div class="box-data">
          {{closed_requests_count}}
      </div>
  </div>
</div>
    `,
  data() {
    return {
      users_count: null,
      professionals_count: null,
      active_requests_count: null,
      closed_requests_count: null,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await fetch(location.origin + "/api/admin-home-data", {
        headers: {
          "Authentication-Token": this.$store.state.auth_token,
        },
      });
      if (res.ok) {
        let data = await res.json();
        this.users_count = data.users;
        this.professionals_count = data.professionals;
        this.active_requests_count = data.active_requests;
        this.closed_requests_count = data.closed_requests;
      }
    },
  },
};
