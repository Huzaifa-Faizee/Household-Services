export default {
  template: `
    <div>
        <h4>Profile Details</h4>
        <input type="text" placeholder="Enter Business Name" v-model="business_name" />
        <input type="text" placeholder="Enter Experience" v-model="experience" />
        <input type="text" placeholder="Enter Address" v-model="address" />
        <input type="text" placeholder="Enter service Description" v-model="service_description" />
        <input type="number" placeholder="Enter Price" v-model="price" />
        <button class="btn btn-warning" @click="updateProfessionalDetails">Update</button>
        <h4>Reviews</h4>
        <table>
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
        console.log("Successfully Changes Updated");
        this.getProfessionalDetails();
      }
    },
  },
};
