import React, { Component } from 'react';
// import react style components
import { Card, Button, CardTitle, CardText } from 'reactstrap';


// checks for result object, showResult prop and renders punchline if true
function Punchline(props){
   if (props.showResult){
      return (
         <div>
            <h5>{props.punch} HA! HA! HA!</h5>
            <Button color="secondary" onClick={props.getAnotherClicked}>Show Another</Button>
         </div>
      )
   }else{
      return null;
   }
}

// checks for jokeSetup property in result object - If true it renders following
function JokeSetup(props){

    // checks if attribute of object is true
   const showMeJoke = props.jokeLoaded ?
      <span>
         <CardTitle>Joke About {props.jokeType.charAt(0).toUpperCase() + props.jokeType.slice(1)}</CardTitle>
         <CardText>{props.jokeSetup}</CardText>
         {/* <Button color="info" onClick={props.showClicked}>TELL ME</Button> */}
      </span>
      :

      <CardTitle>Getting a Joke</CardTitle>;
    
      // shows tell me button only when show result is false
   const showTellMeButton = props.showResult ?
      <div> </div> : <Button color="info" onClick={props.showClicked}>TELL ME</Button>

   // could create components for showMeJoke and showTellMeButton
   return (
      <Card body inverse style={{ backgroundColor: '#85144b', borderColor: '#85144b' }}>
         {showMeJoke}
         {showTellMeButton}
      </Card>
   )
}

////////////////
// COMPONENT
////////////////
class Joke extends Component {
// Constructor needed in all components to set up state (work around is using fat arrow functions)
   constructor(props){
       // include to inherit props and allow usage of (this)
      super(props);
    
      // initial data object
      this.state = {
         jokeLoaded: false,
         objResult: {},
         showResult: false,
         error: null
      }
      //without this binding, showClicked calling this.setState is not avaialble
      this.showClicked = this.showClicked.bind(this);
      this.getAnotherClicked = this.getAnotherClicked.bind(this);
      //only need to bind the things needed (outside, so to speak)
   }

   // Function shows button click which shows result from API
   showClicked(){
      console.log("clicked on show")
      this.setState({
         showResult: true
      });
   }

   // Resets object so Api can be called again
   getAnotherClicked(){
      console.log("getAnother");
      this.setState({
         jokeLoaded: false,
         objResult: {},
         showResult: false,
         error: null
      }, this.getJoke());
      //ensure state is updated before calling a new joke
   }

   // starts component life cycle - state - is in the original constructor format
   componentDidMount() {
      // lifecycle hook
      console.log("componentDidMount");
      // Calls API
      this.getJoke();
   }

   // Method to call API
   getJoke(){
      fetch("https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_joke")
      // resolve to JSON
      .then(res => res.json())
      // use resulting object from API - change state 
      .then(
          //pass the result object
         (result) => {
            console.log("result", result);
            //lifecycle hook
            this.setState({
               jokeLoaded: true,
               objResult: result,
            });
         },
         // Note: it's important to handle errors here
         // instead of a catch() block so that we don't swallow
         // exceptions from actual bugs in components.
         (error) => {
            this.setState({
               isLoaded: true,
               error: error
            });
         }
      )
   }

   // flow notes
   // component load and should show "loading"
   // then call to get joke
   // handle the error also
   // when joke shows up, display JokeSetup with tellme button
   // click on tellme, tellme should go away and
   // punchline should show along with "get new joke"

   // render method render JSX to the DOM
   // render called each time state changes
   render () {
        // set the follwing objects to the current state for rendering
      const { error, jokeLoaded, objResult, showResult } = this.state;
      if (error) {
         return (
            <div>
               <div>Error: {error.message}</div>
               <button onClick={this.getAnotherClicked}>Try Again</button>
            </div>
         );
         // before joke loads
      } else if (!jokeLoaded) {
         return <div>Loading...</div>;
      } else {
        // joke loaded - renders object attributes and methods on component in JSX in those methods
         return (
            <div className="box-container">
               <JokeSetup jokeLoaded={jokeLoaded}
               jokeSetup={objResult.setup}
               jokeType={objResult.type}
               showResult={showResult}
               showClicked={this.showClicked}/>
               <Punchline
               showResult={showResult}
               punch={objResult.punchline}
               getAnotherClicked={this.getAnotherClicked} />
            </div>
         )
      }
   };
}

export default Joke;