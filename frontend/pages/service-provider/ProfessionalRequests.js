export default {
  template: `
    <div>
        <h1>Professional Requests</h1>
        <h4>New Requests</h4>
        <table>
            <thead>
                <tr>
                    <th>Sr No</th>
                    <th>Service</th>
                    <th>Customer Name</th>
                    <th>Customer Contact</th>
                    <th>Customer Address</th>
                    <th>Date</th>
                    <th>Accept</th>
                    <th>Reject</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(req,index) in new_requests">
                    <td>{{index+1}}</td>
                    <td>{{req.service.name}}</td>
                    <td>{{req.user.name}}</td>
                    <td>{{req.user.email}}</td>
                    <td>{{req.user_address}}</td>
                    <td>{{req.date_requested}}</td>
                    <td><button class="btn btn-success" @click="updateStatus(req.id,'accepted')">Accept</button></td>
                    <td><button class="btn btn-danger" @click="updateStatus(req.id,'rejected')">Reject</button></td>
                </tr>
            </tbody>
        </table>
        <h4>Closed Requests</h4>
        <table>
            <thead>
                <tr>
                    <th>Sr No</th>
                    <th>Service</th>
                    <th>Customer Name</th>
                    <th>Customer Contact</th>
                    <th>Customer Address</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(req,index) in closed_requests">
                    <td>{{index+1}}</td>
                    <td>{{req.service.name}}</td>
                    <td>{{req.user.name}}</td>
                    <td>{{req.user.email}}</td>
                    <td>{{req.user_address}}</td>
                    <td>{{req.date_requested}}</td>
                    <td>{{req.status}}</td>
                </tr>
            </tbody>
        </table>
        <h4>Accepted Requests</h4>
        <table>
            <thead>
                <tr>
                    <th>Sr No</th>
                    <th>Service</th>
                    <th>Customer Name</th>
                    <th>Customer Contact</th>
                    <th>Customer Address</th>
                    <th>Date</th>
                    <th>Reject</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(req,index) in accepted_requests">
                    <td>{{index+1}}</td>
                    <td>{{req.service.name}}</td>
                    <td>{{req.user.name}}</td>
                    <td>{{req.user.email}}</td>
                    <td>{{req.user_address}}</td>
                    <td>{{req.date_requested}}</td>
                    <td><button class="btn btn-danger" @click="updateStatus(req.id,'rejected')">Reject</button></td>
                </tr>
            </tbody>
        </table>
        <h4>Rejected Requests</h4>
        <table>
            <thead>
                <tr>
                    <th>Sr No</th>
                    <th>Service</th>
                    <th>Customer Name</th>
                    <th>Customer Contact</th>
                    <th>Customer Address</th>
                    <th>Date</th>
                    <th>Accept</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(req,index) in rejected_requests">
                    <td>{{index+1}}</td>
                    <td>{{req.service.name}}</td>
                    <td>{{req.user.name}}</td>
                    <td>{{req.user.email}}</td>
                    <td>{{req.user_address}}</td>
                    <td>{{req.date_requested}}</td>
                    <td><button class="btn btn-success" @click="updateStatus(req.id,'accepted')">Accept</button></td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
  data() {
    return {
      new_requests: [],
      accepted_requests: [],
      rejected_requests: [],
      closed_requests: [],
    };
  },
  mounted() {
    this.getRequests();
  },
  methods: {
    intitalizeVariables() {
      this.new_requests = [];
      this.accepted_requests = [];
      this.rejected_requests = [];
      this.closed_requests = [];
    },
    async getRequests() {
      const res = await fetch(
        location.origin +
          "/api/professional-requests/" +
          this.$store.state.user_id,
        {
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        }
      );
      if (res.ok) {
        let all_requests = await res.json();
        console.log(all_requests);
        this.intitalizeVariables();
        all_requests.forEach((data) => {
          if (data.status == "requested") {
            this.new_requests.push(data);
          } else if (data.status == "accepted") {
            this.accepted_requests.push(data);
          } else if (data.status == "rejected") {
            this.rejected_requests.push(data);
          } else if (data.status == "closed") {
            this.closed_requests.push(data);
          }
        });
      }
    },
    async updateStatus(reqId, status) {
      let dataToPass = {
        id: reqId,
        status: status,
      };
      const res = await fetch(
        location.origin +
          "/api/professional-requests/" +
          this.$store.state.user_id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.$store.state.auth_token,
          },
          body: JSON.stringify(dataToPass),
        }
      );
      if (res.ok) {
        let data = await res.json();
        console.log(data);
        this.getRequests();
      }
    },
  },
};
