import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
// import {loadFilteredHotels} from '../../actions/Hotels/Hotels';
import '../../public/css/animate.css';
import '../../public/css/bootstrap.css';
import '../../public/css/magnific-popup.css';
import '../../public/css/superfish.css';
import '../../public/css/bootstrap-datepicker.min.css';
import '../../public/css/magnific-popup.css';
import '../../public/css/cs-select.css';
import '../../public/css/cs-skin-border.css';
import '../../public/css/style.css';
import '../../public/css/filter.css';
import '../../public/css/star.css';
import * as HotelsAPI from '../../api/HotelsAPI';

class Results extends Component {
  state={
    hotelsArray: [],
    sort_review:0,
    sort_price:0,
    filterparams: {
      price:"500",
      star:"1",
      freebies:[],
      chk_breakfast: false,
      chk_parking: false,
      chk_fitness: false,
      chk_pool: false,
      chk_tennis: false,
      chk_airport: false
    }
  }

  componentWillMount(){
    this.state.hotelsArray = this.props.hotels.hotels;
  }

  handleBooking(hotelItem){
    var checkin = this.props.hotels.checkin;
    var checkout = this.props.hotels.checkout;
    var roomtype = "0"; //0=King, 1=Queen, 2=Standard
    var roomcount = this.props.hotels.roomcount;
    HotelsAPI.doHotelBooking({hotelItem, checkin, checkout, roomtype, roomcount})
    .then((status) => {
        if(status == 200){
          alert("Booking Done!");
          // this.props.loadHotels(result);
          // this.props.loadFilteredHotels(result);
          // this.props.history.push("/Hotels");
        }
    });
  }


  createHotelsList(){
    return this.state.hotelsArray.map((hotelItem) => {
      var styles = {
        background:'white',
        'margin-bottom':'8px'
      }
      return(
        <div className="col-md-8 col-sm-8 " style={styles}>
          <div className="row">
            <div className="col-md-8 col-sm-8 ">
                <h3>{hotelItem.hotel_name}</h3>
                <span>
                  <h4>{hotelItem.hotel_star} star</h4>
                  <h4>{hotelItem.hotel_location}</h4>
                </span>
                <br/>
                <h4>Review: {hotelItem.review_overall}/10</h4>
            </div>
            <div className="col-md-4 col-sm-4 ">
                <h4 class="price">${hotelItem.standard_rates}</h4>
                <br/>
                <button class="btn btn-primary" onClick={() => this.handleBooking(hotelItem)}>Book Now</button>
            </div>
          </div>
          <div>
            <h4>{hotelItem.hotel_description}</h4>
          </div>
        </div>
      );
  });
  }

  setSortCriteria(sort_criteria){
    if(sort_criteria == "price"){
      if(this.state.sort_price == 0){
        this.setState({
          ...this.state,
          sort_price:1
        },this.sortHotels(sort_criteria));
      }
      else{
        this.setState({
          ...this.state,
          sort_price:0
        },this.sortHotels(sort_criteria));
      }
    }
    else if(sort_criteria == "review"){
      if(this.state.sort_review == 0){
        this.setState({
          ...this.state,
          sort_review:1
        },this.sortHotels(sort_criteria));
      }
      else{
        this.setState({
          ...this.state,
          sort_review:0
        },this.sortHotels(sort_criteria));
      }
    }
  }

  sortHotels(sort_criteria){
    var sortPrice = this.state.sort_price;
    var sortReview = this.state.sort_review;
    if(sort_criteria == "price"){
      function comparePrice(a,b){
        if (a.standard_rates < b.standard_rates)
          return  (sortPrice == 1)? -1 : 1;
        if (a.standard_rates > b.standard_rates)
          return  (sortPrice == 1)? 1 : -1;
        return 0;
      }
      this.state.hotelsArray.sort(comparePrice);
    }
    else{
      function compareReviews(a,b){
        if (a.review_overall < b.review_overall)
          return  (sortReview == 1)? -1 : 1;
        if (a.review_overall > b.review_overall)
          return  (sortReview == 1)? 1 : -1;
        return 0;
      }
      this.state.hotelsArray.sort(compareReviews);
    }
  }

  filterHotels(){
    var tempHotelsArray = [];
    var price = this.state.filterparams.price;
    var star = this.state.filterparams.star;
    var freebies = this.state.filterparams.freebies;
    this.props.hotels.hotels.map((hotelItem) => {
      var amenities = hotelItem.hotel_amenities.split(',');
      var filterflag = false;
      if(hotelItem.standard_rates <= price){
        if(hotelItem.hotel_star >= star){
          for(var i=0; i<freebies.length; i++){
            if(amenities.indexOf(freebies[i]) == -1){
              filterflag = true;
              break;
            }
          }
          if(!filterflag){
            tempHotelsArray.push(hotelItem);
          }  
        }
      }
    });
    this.setState({
      ...this.state,
      hotelsArray: tempHotelsArray
    });
  }

  setFreebies(){
    var tempFreebies = [];
    if(this.state.filterparams.chk_airport == true) tempFreebies.push("Airport Pick-up");
    if(this.state.filterparams.chk_parking == true) tempFreebies.push("Free Parking");
    if(this.state.filterparams.chk_fitness == true) tempFreebies.push("Fitness Center");
    if(this.state.filterparams.chk_pool == true) tempFreebies.push("Swimming Pool");
    if(this.state.filterparams.chk_tennis == true) tempFreebies.push("Tennis Court");
    if(this.state.filterparams.chk_breakfast == true) tempFreebies.push("Free Breakfast");
    this.setState({
      filterparams:{
        ...this.state.filterparams,
        freebies: tempFreebies
      }
    },this.filterHotels);
    console.log(this.state.filterparams.freebies);
  }
  
  render() {
    return (
      <div className="row">
        <div className="col-lg-2" id="divfilter">
          <div id="divleftpanel">
            <h4 id="h4filter">Star</h4>
            <hr />
            <span class="rating">
              <input type="radio" class="rating-input" value="1"
                    id="rating-input-1-5" name="rating-input-1" onClick={(event) => {
                      this.setState({
                          ...this.state,
                          filterparams: {
                              ...this.state.filterparams,
                              star: event.target.value
                          }
                      },this.filterHotels);}}/>
              <label for="rating-input-1-5" class="rating-star">
                <p id="parstar">1</p>
              </label>
              <input type="radio" class="rating-input" value="2"
                    id="rating-input-1-4" name="rating-input-1" onClick={(event) => {
                      this.setState({
                          ...this.state,
                          filterparams: {
                              ...this.state.filterparams,
                              star: event.target.value
                          }
                      },this.filterHotels);}}/>
              <label for="rating-input-1-4" class="rating-star"><p id="parstar">2</p></label>
              <input type="radio" class="rating-input" value="3"
                    id="rating-input-1-3" name="rating-input-1" onClick={(event) => {
                      this.setState({
                          ...this.state,
                          filterparams: {
                              ...this.state.filterparams,
                              star: event.target.value
                          }
                      },this.filterHotels);}}/>
              <label for="rating-input-1-3" class="rating-star"><p id="parstar">3</p></label>
              <input type="radio" class="rating-input" value="4"
                    id="rating-input-1-2" name="rating-input-1" onClick={(event) => {
                      this.setState({
                          ...this.state,
                          filterparams: {
                              ...this.state.filterparams,
                              star: event.target.value
                          }
                      },this.filterHotels);}}/>
              <label for="rating-input-1-2" class="rating-star"><p id="parstar">4</p></label>
              <input type="radio" class="rating-input" value="5"
                    id="rating-input-1-1" name="rating-input-1" onClick={(event) => {
                      this.setState({
                          ...this.state,
                          filterparams: {
                              ...this.state.filterparams,
                              star: event.target.value
                          }
                      },this.filterHotels);}}/>
              <label for="rating-input-1-1" class="rating-star"><p id="parstar">5</p></label>
            </span>
            <br/>
            <br/>
            <h4 id="h4filter">Price</h4>
            <hr/>
            <div>
              <h6 id="sliderh6">${this.state.filterparams.price}</h6>
            </div>
            <input type="range"
              min="50"
              max="500"
              step="10"
              defaultValue="500"
              onChange={(event) => {
                this.setState({
                    ...this.state,
                    filterparams: {
                        ...this.state.filterparams,
                        price: event.target.value
                    }
                },this.filterHotels);}}
            />
            <br/>
            <br/>
            
            <h4 id="h4filter">Freebies</h4>
            <hr/>
            <div class="control-group">
              <label class="control control--checkbox">Free Parking
                <input type="checkbox" onChange={(event) => {
                this.setState({
                    ...this.state,
                    filterparams: {
                        ...this.state.filterparams,
                        chk_parking: event.target.checked
                    }
                },this.setFreebies);}}/>
                <div class="control__indicator"></div>
              </label>
              <label class="control control--checkbox">Fitness Center
                <input type="checkbox" onChange={(event) => {
                this.setState({
                    ...this.state,
                    filterparams: {
                        ...this.state.filterparams,
                        chk_fitness: event.target.checked
                    }
                },this.setFreebies);}}/>
                <div class="control__indicator"></div>
              </label>
              <label class="control control--checkbox">Free Breakfast
                <input type="checkbox" onChange={(event) => {
                this.setState({
                    ...this.state,
                    filterparams: {
                        ...this.state.filterparams,
                        chk_breakfast: event.target.checked
                    }
                },this.setFreebies);}}/>
                <div class="control__indicator"></div>
              </label>
              <label class="control control--checkbox">Swimming Pool
                <input type="checkbox" onChange={(event) => {
                this.setState({
                    ...this.state,
                    filterparams: {
                        ...this.state.filterparams,
                        chk_pool: event.target.checked
                    }
                },this.setFreebies);}}/>
                <div class="control__indicator"></div>
              </label>
              <label class="control control--checkbox">Tennis Court
                <input type="checkbox" onChange={(event) => {
                this.setState({
                    ...this.state,
                    filterparams: {
                        ...this.state.filterparams,
                        chk_tennis: event.target.checked
                    }
                },this.setFreebies);}}/>
                <div class="control__indicator"></div>
              </label>
              <label class="control control--checkbox">Airport Pick-up
                <input type="checkbox" onChange={(event) => {
                this.setState({
                    ...this.state,
                    filterparams: {
                        ...this.state.filterparams,
                        chk_airport: event.target.checked
                    }
                },this.setFreebies);}}/>
                <div class="control__indicator"></div>
              </label>
            </div>
          </div>
        </div>
        <div className="col-lg-10">
          <div className="row">
              <div className="col-sm-6 col-lg-6 col-md-6 col-xs-6" >
                  <label className="sortbtn btn-block"
                          onClick={() => this.setSortCriteria("price")}
                  >
                      PRICE
                  </label>
              </div>
              <div className="col-sm-6 col-lg-6 col-md-6 col-xs-6" >
                  <label className="sortbtn btn-block"
                          onClick={() => this.setSortCriteria("review")}>
                      REVIEW SCORE
                  </label>
              </div>
          </div> 
          <div>
            <span>
            {this.createHotelsList()}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
      hotels: state.hotels,
      // filteredHotels: state.filteredHotels
  }
}

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({loadFilteredHotels : loadFilteredHotels}, dispatch);
// }

export default connect(mapStateToProps)(Results);