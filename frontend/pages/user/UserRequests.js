export default {
  template: `
    <div>
        <h1>User Requests</h1>
        <h4>Active Requests</h4>
        <table>
            <thead>
                <tr>
                    <th>Sr No</th>
                    <th>Service</th>
                    <th>Contact</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Close</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(req,index) in active_requests">
                    <td>{{index+1}}</td>
                    <td>{{req.service.name}}</td>
                    <td>{{req.service_provider.user.email}}</td>
                    <td>{{req.service_provider.name}}</td>
                    <td>{{req.date_requested}}</td>
                    <td>{{req.user_address}}</td>
                    <td><button class="btn btn-warning">Close</button></td>
                </tr>
            </tbody>
        </table>
        <h4>Waiting Requests</h4>
        <table>
            <thead>
                <tr>
                    <th>Sr No</th>
                    <th>Service</th>
                    <th>Contact</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(req,index) in waiting_requests">
                    <td>{{index+1}}</td>
                    <td>{{req.service.name}}</td>
                    <td>{{req.service_provider.user.email}}</td>
                    <td>{{req.service_provider.name}}</td>
                    <td>{{req.date_requested}}</td>
                    <td>{{req.user_address}}</td>
                    <td>{{req.status}}</td>
                </tr>
            </tbody>
        </table>
        <h4>Other Requests</h4>
        <table>
            <thead>
                <tr>
                    <th>Sr No</th>
                    <th>Service</th>
                    <th>Contact</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(req,index) in other_requests">
                    <td>{{index+1}}</td>
                    <td>{{req.service.name}}</td>
                    <td>{{req.service_provider.user.email}}</td>
                    <td>{{req.service_provider.name}}</td>
                    <td>{{req.date_requested}}</td>
                    <td>{{req.user_address}}</td>
                    <td>{{req.status}}</td>
                </tr>
            </tbody>
        </table>
        
    </div>
    `,
  data() {
    return {
      active_requests: [],
      waiting_requests: [],
      other_requests: [],
      model: null,
    };
  },
  mounted() {
    this.getRequests();
  },
  methods: {
    initializeVariables() {
      this.active_requests = [];
      this.waiting_requests = [];
      this.other_requests = [];
    },
    async getRequests() {
      const res = await fetch(
        location.origin + "/api/user-requests/" + this.$store.state.user_id,
        {
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        }
      );
      if (res.ok) {
        let data = await res.json();
        console.log(data);
        data.forEach((req) => {
          if (req.status == "requested") {
            this.waiting_requests.push(req);
          } else if (req.status == "accepted") {
            this.active_requests.push(req);
          } else {
            this.other_requests.push(req);
          }
        });
      }
    },
  },
};
