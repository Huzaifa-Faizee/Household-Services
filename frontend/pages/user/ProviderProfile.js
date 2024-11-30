export default {
  props: ["id"],
  template: `
  <div class="page-body">
    <div v-if="professional!=null">
        <div class="page-heading">{{professional.business_name}}</div>
        <div class="container">
            <div class="row">
                <div class="col-4 description">
                    Experience: {{professional.experience}}</p>
                </div>
                <div class="col-4 description">
                    Address: {{professional.address}}
                </div>
                <div class="col-4 description">
                    Price: {{professional.price}}
                </div>
            </div>
        </div>

        <div class="description">{{professional.service_description}}</div>

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
