export default {
  template: `
    <div>
        <h1>Search</h1>
        
        <input type="text" name="search" v-model="search_value">
        <button @click="search">search</button>
        <div v-if="professionals.length>0">
            <h4>Professionals</h4>
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
        </div>
        <div v-if="services.length>0">
            <h4>Services</h4>
            <div class="card" style="width: 18rem;" v-for="service in services">
                <div class="card-body">
                    <h5 class="card-title">{{service.name}}</h5>
                    <p class="card-text">{{service.description}}</p>
                    <a href="#" class="btn btn-primary" @click="viewProfessional(service)">View Professionals</a>
                </div>
            </div>
        </div>

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
      search_value: null,
      professionals: [],
      services: [],
      modal: null,
      currentProfessional: null,
      booking_date: null,
      booking_address: null,
    };
  },
  methods: {
    async search() {
      const res = await fetch(
        location.origin + "/api/user-search/" + this.search_value,
        {
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        }
      );
      if (res.ok) {
        let data = await res.json();
        this.services = data.services;
        this.professionals = data.professionals;
      }
    },
    viewProfessional(service) {
      localStorage.setItem("currentService", JSON.stringify(service));
      this.$router.push("/individual-service");
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
        service_id: this.currentProfessional.service_id,
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
        this.modal.hide();
      }
    },
    viewProfessionalDetails(prof) {
      this.$router.push("/provider-profile/" + prof.id);
    },
  },
};
