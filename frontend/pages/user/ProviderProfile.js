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

        <ul>
            <li v-for="rev in professional.ratings">{{rev.user.name}}-{{rev.review}}</li>
        </ul>
    </div>
  </div>
  `,
  data() {
    return {
        professional:null
    };
  },
  mounted() {
    this.getProfessionalDetails();
  },
  methods:{
    async getProfessionalDetails(){
        const res = await fetch(location.origin + "/api/professional-details/"+this.id, {
            headers: {
              "Authentication-Token": this.$store.state.auth_token,
            },
          });
          if (res.ok) {
            let data = await res.json();
            this.professional = data;
            console.log(this.professional);
          }
    }
  }
};
