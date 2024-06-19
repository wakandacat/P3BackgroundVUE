<template>
  <div>
    <img :class="BackPlacement" v-bind:src="calcTimeOfDay.backIMG"> 

    <img v-if="!isDarkHour" :class="UIBackScale" src="../src/assets/UI/blueBackSmall.png">
    <img v-else :class="UIBackScale" src="../src/assets/UI/greenBackSmall.png">

    <div :class="UIPlacement">
      <div :class="currDateStyle">
          <p>{{ monthNum + " / " + dayInMonthNum + " • " + dayOfWeekLetter}}</p>
      </div>
      <div :class="currTimeStyle">
          <p>{{ calcTimeOfDay.timeOfDay }}</p>
      </div>
      <div v-if="!hideNext" :class="nextStyle">
          <p>Next:</p>
      </div>

      <div v-if="!hideNext" :class="daysUntilFullStyle">
        <p>{{ daysUntilFull + " / "}}</p>
      </div>
      <div v-else :class="{daysUntilFullStyle, moonPhaseText}">
        <p>{{ calcPhaseOfMoon.string }}</p>
      </div>

      <img id="moonPhase" :class="moonScale">
    </div>

  </div>
</template>

<script>
//using this library's functions: https://github.com/jasonsturges/lunarphase-js to get the lunarphases
//https://jasonsturges.medium.com/moons-lunar-phase-in-javascript-a5219acbfe6e#:~:text=Using%20Julian%20date%2C%20you%20can%20calculate%20the%20current%20phase%20of,time%20between%20two%20identical%20syzygies.

//global vars
let shortFormDays = ["Su", "M", "T", "W", "Th", "F", "Sa"];
const LUNAR_MONTH = 29.530588853;
let timesOfDay = [
  { string: 'Dark Hour', url: '../src/assets/Backgrounds/tartarus.png', start: 0, end: 1, weekendOnly: false },
  { string: 'Early Morning', url: '../src/assets/Backgrounds/earlyMorning.png', start: 1, end: 6, weekendOnly: false },
  { string: 'Morning', url: '../src/assets/Backgrounds/morning.png', start: 6, end: 11, weekendOnly: false },
  { string: 'Lunch', url: '../src/assets/Backgrounds/lunchTime.png', start: 11, end: 12, weekendOnly: false},   
  { string: 'Daytime', url: '../src/assets/Backgrounds/weekends.png', start: 8, end: 15, weekendOnly: true},
  { string: 'After School', url: '../src/assets/Backgrounds/afterSchool.png', start: 12, end: 18, weekendOnly: false},   
  { string: 'Afternoon', url: '../src/assets/Backgrounds/afternoon.png', start: 15, end: 18, weekendOnly: true},
  { string: 'Evening', url: '../src/assets/Backgrounds/evening.png', start: 18, end: 21, weekendOnly: false},
  { string: 'Late Night', url: '../src/assets/Backgrounds/lateNight.png', start: 21, end: 24, weekendOnly: false},
];
//14.75 is full moon
let moonPhases = [
  { string: 'New', url: '../src/assets/Moon/newMoon.png', start: 29, end: 0.5, showText: true },
  { string: 'Sliver Left', url: '../src/assets/Moon/extraMoon2.png', start: 0.5, end: 3.2, showText: false },
  { string: 'Waxing Crescent', url: '../src/assets/Moon/waxingMoonCrescent.png', start: 3.2, end: 4.2, showText: false },
  { string: 'Almost Half', url: '../src/assets/Moon/almostHalfAgain1.png', start:4.2, end: 6.9, showText: false },
  { string: 'Half', url: '../src/assets/Moon/halfMoonRight.png', start: 6.9, end: 7.9, showText: true },
  { string: 'Past Half', url: '../src/assets/Moon/almostMoonHalfRight.png', start: 7.9, end: 10.6, showText: false },
  { string: 'Waxing Gibbous', url: '../src/assets/Moon/waxingMoonGibbous.png', start: 10.6, end: 11.6, showText: false },
  { string: 'Almost Full', url: '../src/assets/Moon/sliverMoonRight.png', start: 11.6, end: 14, showText: false },
  { string: 'Full', url: '../src/assets/Moon/fullMoon.png', start: 14, end: 15, showText: true },
  { string: 'Past Full', url: '../src/assets/Moon/sliverMoonLeft.png', start: 15, end: 18, showText: false },
  { string: 'Waning Gibbous', url: '../src/assets/Moon/waningMoonGibbous.png', start: 18, end: 19, showText: false },
  { string: 'Almost Half', url: '../src/assets/Moon/almostMoonHalfLeft.png', start: 19, end: 21.6, showText: false },
  { string: 'Half', url: '../src/assets/Moon/halfMoonLeft.png', start: 21.6, end: 22.6, showText: true },
  { string: 'Sliver Right', url: '../src/assets/Moon/almostHalfAgain2.png', start: 22.6, end: 25.3, showText: false },
  { string: 'Waning Crescent', url: '../src/assets/Moon/waningMoonCrescent.png', start: 25.3, end: 26.3, showText: false },
  { string: 'Almost New', url: '../src/assets/Moon/extraMoon1.png', start: 26.3, end: 29, showText: false },
];


export default {
  data(){
    return {
      UIBackScale: 'UIBackScale',
      UIPlacement: 'UIHold',
      BackPlacement: 'BackgroundScale',
      currDateStyle: 'currDateStyle',
      currTimeStyle: 'currTimeStyle',
      moonScale: 'moonScale',
      nextStyle: 'next',
      daysUntilFullStyle: 'daysUntilFullStyle',
      moonPhaseText: 'moonPhaseText',
      isDarkHour: false,
      dayInMonthNum: new Date().getDate(), //0 to 31,
      monthNum: new Date().getMonth() + 1, //0 to 11 (add +1 to get correct month),
      dayOfWeekNum: new Date().getDay(), //0, 1, 2, 3, 4, 5, 6 (STARTING AT SUNDAY = 0)
      dayOfWeekLetter: shortFormDays[new Date().getDay()],
      hideNext: false,
    };
  },
  computed: {
    isWeekEnd(){
      if(this.dayOfWeekNum === 0 || this.dayOfWeekNum === 6){
        return true;
      } else{
        return false;
      }
    },
    calcTimeOfDay(){
      var hour = new Date().getHours();

      //loop through the array to figure out which string and background to display
      for(let i=0;i<timesOfDay.length;i++){
        if(hour >= timesOfDay[i].start && hour < timesOfDay[i].end && this.isWeekEnd === timesOfDay[i].weekendOnly){ 
          if(timesOfDay[i].string === "Dark Hour"){ //if its the dark hour, set the flag
            this.isDarkHour = true;
          }
          return {
            timeOfDay: timesOfDay[i].string,
            backIMG: timesOfDay[i].url
          };
        }
      }
    },
    calcPhaseOfMoon(){
      //loop through the array to figure out which string and background to display
      for(let i=0;i<moonPhases.length;i++){
        if(this.daysUntilFull >= moonPhases[i].start && this.daysUntilFull < moonPhases[i].end){ 
          if(moonPhases[i].showText === true){ //if its a notable moon phase, hide next and spell it out
            this.hideNext = true;
          }
          return {
            moonIMG: moonPhases[i].url,
            string: moonPhases[i].string
          };
        }
      }
    },
    normalize(){
      return value => {
        let temp = value - Math.floor(value);
        if (temp < 0) temp = value + 1;
        return temp;
      }
    },
    julianDate(){
      return (new Date().getTime() / 86400000) - (new Date().getTimezoneOffset() / 1440) + 2440587.5;
    },
    lunarAgePercent(){
      return this.normalize((this.julianDate - 2451550.1) / LUNAR_MONTH);
    },
    lunarAge(){
      return this.lunarAgePercent * LUNAR_MONTH;
    },
    daysUntilFull(){ 
     // console.log(Math.round(LUNAR_MONTH/2) - this.lunarAge);
      return Math.round((LUNAR_MONTH/2) - this.lunarAge);
    },
  },
  methods: {
    //continue to get the current time
    getCurrTimes(){
      this.dayInMonthNum = new Date().getDate();
      this.monthNum = new Date().getMonth() + 1; //0 to 11 (add +1 to get correct month),
      this.dayOfWeekNum = new Date().getDay(); //0, 1, 2, 3, 4, 5, 6 (STARTING AT SUNDAY = 0)
      this.dayOfWeekLetter = shortFormDays[new Date().getDay()];
    },
    //continue to get the current moon times
    getDateForCalcs(){
      this.julianDate;
      this.lunarAgePercent;
      this.lunarAge;
      this.daysUntilFull;
    }
  },
  mounted(){

    // Start the interval to call checkValue every second
    setInterval(this.getCurrTimes, 1000);
    setInterval(this.getDateForCalcs, 1000);
  }
};

</script>


<style>

  /* Reset default margins and paddings */
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  p {
    margin: 0;
  }
 .bodyClass{
    font-family: 'Trebuchet MS', sans-serif;
    margin: 0px;
    overflow-y: hidden; /* Hide vertical scrollbar */
    overflow-x: hidden; /* Hide horizontal scrollbar */
  }
  .UIBackScale {
    width:50%;
    height: auto;
    float: right;
    position: relative;
    z-index: 0;
  }
  .BackgroundScale{
    width: 100%;
    height: auto;
    z-index: -100;
    position: absolute;
  }
  .UIHold{
    display: flex;
    flex-direction: column;
    width: 98%;
    align-items: flex-end;
    position: absolute;
    z-index: 1;
    padding: 1%;
  }
  .currDateStyle{
    position: relative;
    text-align: right;
    font-size: 4em;
    color: #246185;
  }
  .currTimeStyle {
    position: relative;
    text-align: right;
    font-size: 4em;
    color: #ffffff;
    text-shadow: 7px 5px #246185;
  }
  .next{
    position: relative;
    text-align: right;
    font-size: 3em;
    color: #d9fdff;
    text-shadow: 3px 3px #246185;
    display: block;
  }
  .daysUntilFullStyle{
    position: relative;
    text-align: right;
    font-size: 4em;
    color: #9efdff;
    text-shadow: 3px 3px #246185;
    font-weight: 900; 
  }
  .moonPhaseText{
    color: white;
  }
  .moonScale{

  }
</style>
