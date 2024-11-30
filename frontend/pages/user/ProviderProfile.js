export default {
  props: ["id"],
  template: `
  <div>
    <div v-if="professional!=null">
        <h3>{{professional.business_name}}</h3>
        <p>{{professional.experience}}</p>
        <p>{{professional.address}}</p>
        
        <h4>{{professional.service_description}}</h4>
        <h5>{{professional.price}}</h5>

        <div class="sub-heading">Reviews</div>
        <table v-if="professional.ratings.length>0">
            <thead>
                <tr>
                    <th>Sr No</th>
                    <th>Customer</th>
                    <th>Review</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(rev,index) in professional.ratings">
                    <td>{{index+1}}</td>
                    <td>{{rev.user.name}}</td>
                    <td>{{rev.review}}</td>
                </tr>
            </tbody>
        </table>
        <div class="message" v-if="professional.ratings.length==0">
            No Reviews Yet
        </div>
    </div>
  </div>
  `,
  data() {
    return {
      professional: null,
    };
  },
  mounted() {
    this.getProfessionalDetails();
  },
  methods: {
    async getProfessionalDetails() {
      const res = await fetch(
        location.origin + "/api/professional-details/" + this.id,
        {
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        }
      );
      if (res.ok) {
        let data = await res.json();
        this.professional = data;
        console.log(this.professional);
      }
    },
  },
};
