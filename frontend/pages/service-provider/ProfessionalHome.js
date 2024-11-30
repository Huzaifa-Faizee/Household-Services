export default {
  template: `
  <div class="page-body">
  <div class="sub-heading">Profile Details</div>
  <div class="container">
      <div class="row">
          <div class="col-6">
              <div class="mb-3">
                  <label for="business_name" class="form-label">Business Name:</label>
                  <input type="text" class="form-control" id="business_name" placeholder="Enter Business Name" v-model="business_name" />
              </div>
          </div>
          <div class="col-6">
              <div class="mb-3">
                  <label for="experience" class="form-label">Experience:</label>
                  <input type="text" class="form-control" id="experience" placeholder="Enter Experience" v-model="experience" />
              </div>
          </div>
      </div>
      <div class="row">
          <div class="col-6">
              <div class="mb-3">
                  <label for="address" class="form-label">Address:</label>
                  <textarea type="text" class="form-control" id="address" placeholder="Enter Address" v-model="address"></textarea>
              </div>
          </div>
          <div class="col-6">
              <div class="mb-3">
                  <label for="service_description" class="form-label">Service Description:</label>
                  <textarea type="text" class="form-control" id="service_description" placeholder="Enter service Description"
                      v-model="service_description"></textarea>
              </div>
          </div>
      </div>
      <div class="row">
          <div class="col-6">
              <div class="mb-3">
                  <label for="price" class="form-label">Price:</label>
                  <input type="number" class="form-control" id="price" placeholder="Enter Price" v-model="price" />
              </div>
          </div>
          <div class="col-6 update-button">
              <button class="button-58" @click="updateProfessionalDetails">Update</button>
          </div>
      </div>
  </div>
  <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
          {{ alertMessage }}
  </div>
  <div class="sub-heading">Reviews</div>
  <table v-if="reviews.length>0">
      <thead>
          <tr>
              <th>Sr No</th>
              <th>Customer</th>
              <th>Review</th>
          </tr>
      </thead>
      <tbody>
          <tr v-for="(rev,index) in reviews">
              <td>{{index+1}}</td>
              <td>{{rev.user.name}}</td>
              <td>{{rev.review}}</td>
          </tr>
      </tbody>
  </table>
  <div class="message" v-if="reviews.length==0">
      No Reviews Yet
  </div>
</div>
    `,
  data() {
    return {
      business_name: null,
      experience: null,
      address: null,
      service_description: null,
      price: null,
      reviews: [],
      alertMessage: null,
      alertClass: null,
    };
  },
  mounted() {
    this.getProfessionalDetails();
  },
  methods: {
    async getProfessionalDetails() {
      const res = await fetch(
        location.origin +
          "/api/invidualProfessional/" +
          this.$store.state.user_id,
        {
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        }
      );
      if (res.ok) {
        let data = await res.json();
        console.log(data);
        this.business_name = data.business_name;
        this.experience = data.experience;
        this.address = data.address;
        this.service_description = data.service_description;
        this.price = data.price;
        this.reviews = data.ratings;
      }
    },
    async updateProfessionalDetails() {
      let profData = {
        business_name: this.business_name,
        experience: this.experience,
        address: this.address,
        service_description: this.service_description,
        price: this.price,
      };
      const res = await fetch(
        location.origin +
          "/api/invidualProfessional/" +
          this.$store.state.user_id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.$store.state.auth_token,
          },
          body: JSON.stringify(profData),
        }
      );
      if (res.ok) {
        let data = await res.json();
        this.setAlert("Changes Updated Successfully","alert-success");
        this.getProfessionalDetails();
      }
    },
    setAlert(message, alertClass) {
      this.alertMessage = message;
      this.alertClass = alertClass;
      // Automatically dismiss the alert after 5 seconds
      setTimeout(() => {
        this.alertMessage = null;
        this.alertClass = null;
      }, 5000);
    },
  },
};
