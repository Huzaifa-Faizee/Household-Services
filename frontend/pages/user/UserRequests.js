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
                    <td>{{req.service_provider.business_name}}</td>
                    <td>{{req.date_requested}}</td>
                    <td>{{req.user_address}}</td>
                    <td><button class="btn btn-warning" @click="openModal(req)">Close</button></td>
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
                    <td>{{req.service_provider.business_name}}</td>
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
                    <td>{{req.service_provider.business_name}}</td>
                    <td>{{req.date_requested}}</td>
                    <td>{{req.user_address}}</td>
                    <td>{{req.status}}</td>
                </tr>
            </tbody>
        </table>
        <!-- Modal for Booking -->
        <div class="modal fade" id="closingModal" tabindex="-1" aria-labelledby="closingModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="closingModalLabel">Please Leave a review, before closing the request</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <label for="review" class="form-label">Review</label>
                  <input type="text" v-model="review" id="review" class="form-control" required />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary" @click="closeRequest">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `,
  data() {
    return {
      active_requests: [],
      waiting_requests: [],
      other_requests: [],
      model: null,
      currentRequest: null,
      review: null,
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
        this.initializeVariables();
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
    openModal(req) {
      this.currentRequest = req;
      this.modal = new bootstrap.Modal(document.getElementById("closingModal"));
      this.modal.show();
    },
    async closeRequest() {
      let dataToPass = {
        request_id: this.currentRequest.id,
        status: "closed",
        review: this.review,
      };
      const res = await fetch(
        location.origin + "/api/user-requests/" + this.$store.state.user_id,
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
        this.modal.hide();
      }
    },
  },
};
