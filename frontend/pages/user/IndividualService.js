export default {
  props: ["id"],
  template: `
    <div>
      <div v-if="currentService!=null">
        <h4>Service Details: {{currentService.name}}</h4>
        <p>{{currentService.description}}</p>
      </div>
      <table>
        <thead>
            <tr>
                <th>Sr. No</th>
                <th>Name</th>
                <th>Address</th>
                <th>Service</th>
                <th>Description</th>
                <th>Experience</th>
                <th>Price</th>
                <th>Book</th>
                <th>View</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(prof,index) in professionals">
                <td> {{index+1}} </td>
                <td> {{prof.business_name}} </td>
                <td> {{prof.address}} </td>
                <td> {{prof.service.name}} </td>
                <td> {{prof.service_description}} </td>
                <td> {{prof.experience}} </td>
                <td> {{prof.price}} </td>
                <td> <button class="btn btn-success" @click="openModal(prof)">Book</button> </td>
                <td> <button class="btn btn-warning" @click="viewProfessionalDetails(prof)">View Details</button> </td>
            </tr>
        </tbody>
      </table>

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
            <tr v-for="(req,index) in requests">
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
            <!-- Modal for Booking -->
            <div class="modal fade" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="bookingModalLabel">Book Professional</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form>
                    <div class="mb-3">
                      <label for="bookingDate" class="form-label">Date</label>
                      <input type="date" v-model="booking_date" id="bookingDate" class="form-control" required />
                    </div>
                    <div class="mb-3">
                      <label for="bookingAddress" class="form-label">Address</label>
                      <input type="text" v-model="booking_address" id="bookingAddress" class="form-control" required />
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" class="btn btn-primary" @click="submitBooking">Submit</button>
                </div>
              </div>
            </div>
          </div>
    </div>
    `,
  data() {
    return {
      currentService: null,
      professionals: [],
      currentProfessional: null,
      requests: [],
      booking_date: null,
      booking_address: null,
      modal: null,
    };
  },
  mounted() {
    this.currentService = JSON.parse(localStorage.getItem("currentService"));
    this.getProfessionals();
    this.getServiceHistory();
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
      }
    },
    async getServiceHistory() {
      const res = await fetch(
        location.origin +
          "/api/service-requests/" +
          this.currentService.id +
          "/" +
          this.$store.state.user_id,
        {
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        }
      );
      if (res.ok) {
        let data = await res.json();
        this.requests = data;
        console.log(this.requests);
      }
    },
    openModal(prof) {
      this.currentProfessional = prof;
      this.modal = new bootstrap.Modal(document.getElementById("bookingModal"));
      this.modal.show();
    },
    async submitBooking() {
      console.log(
        "submit clicked",
        this.currentProfessional,
        this.booking_address,
        this.booking_date
      );
      const submitData = {
        user_id: this.$store.state.user_id,
        service_provider_id: this.currentProfessional.id,
        service_id: this.currentService.id,
        date_requested: this.booking_date,
        user_address: this.booking_address,
      };
      const res = await fetch(location.origin + "/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": this.$store.state.auth_token,
        },
        body: JSON.stringify(submitData),
      });
      if (res.ok) {
        console.log("Saved");
        this.currentProfessional = null;
        this.booking_address = null;
        this.booking_date = null;
        this.getServiceHistory();
        this.modal.hide();
      }
    },
    viewProfessionalDetails(prof) {},
  },
};
