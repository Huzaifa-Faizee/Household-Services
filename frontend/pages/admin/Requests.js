export default {
  template: `
  <div class="page-body">
    <div class="page-heading">Requests</div>
    <div class="buttons">
        <button class="button-58" @click="createCsv">Export Data</button>
    </div>
    <table v-if="requests.length>0">
        <thead>
            <tr>
                <th>Sr No</th>
                <th>Service</th>
                <th>Customer Name</th>
                <th>Customer Contact</th>
                <th>Customer Address</th>
                <th>Business Name</th>
                <th>Date</th>
                <th>Price</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(req,index) in requests">
                <td>{{index+1}}</td>
                <td>{{req.service.name}}</td>
                <td>{{req.user.name}}</td>
                <td>{{req.user.email}}</td>
                <td>{{req.user_address}}</td>
                <td>{{req.service_provider.business_name}}</td>
                <td>{{req.date_requested}}</td>
                <td>{{req.service_provider.price}}</td>
                <td>{{req.status}}</td>
            </tr>
        </tbody>
    </table>
    <div class="message" v-if="requests.length==0">
        No requests Yet
    </div>
</div>
    `,
  data() {
    return {
      requests: [],
    };
  },
  mounted() {
    this.getRequests();
  },
  methods: {
    async getRequests() {
      const res = await fetch(location.origin + "/api/all-requests", {
        headers: {
          "Authentication-Token": this.$store.state.auth_token,
        },
      });
      if (res.ok) {
        let data = await res.json();
        this.requests = data;
        console.log(this.requests);
      }
    },
    async createCsv() {
      const res = await fetch(location.origin + "/create-request-csv", {
        headers: {
          "Authentication-Token": this.$store.state.auth_token,
        },
      });
      const task_id = (await res.json()).task_id;

      const interval = setInterval(async () => {
        const res = await fetch(
          `${location.origin}/get-request-csv/${task_id}`
        );
        if (res.ok) {
          console.log("data is ready");
          window.open(`${location.origin}/get-request-csv/${task_id}`);
          clearInterval(interval);
        }
      }, 100);
    },
  },
};
