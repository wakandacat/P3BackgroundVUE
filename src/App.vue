<template>
  <div>
    <img :class="BackPlacement" :src="calcTimeOfDay.backIMG"> 

    <img v-if="!isDarkHour" :class="UIBackScale" src="/assets/UI/blueBackSmall.png">
    <img v-else :class="UIBackScale" src="/assets/UI/greenBackSmall.png">

    <div :class="UIPlacement">
      <div :class="currDateStyle" :style="{ color: isDarkHour ? '#0b2607' : '#246185' }">
          <p>{{ monthNum + " / " + dayInMonthNum + " • "}}</p>
          <p :style="{color: dayOfWeekNum === 6 && !isDarkHour ? '#18179d' : (dayOfWeekNum === 0 && !isDarkHour ? '#d5370a' : '')}">{{ dayOfWeekLetter }}</p>
      </div>
      <div :class="currTimeStyle" :style="{ color: isDarkHour ? '#bff9c3' : '#ffffff', textShadow: isDarkHour ? '7px 5px #0b2607' : '7px 5px #246185'}">
          <p>{{ calcTimeOfDay.timeOfDay }}</p>
      </div>
      <div v-show="!hideNext" :class="nextStyle" :style="{ color: isDarkHour ? '#e8ffe9' : '#d9fdff', textShadow: isDarkHour ? '3px 3px #0b2607' : '3px 3px #246185'}">
          <p>Next:</p>
      </div>

      <div :class="formatStyle">
        <div v-if="!hideNext" :class="daysUntilFullStyle" :style="{ color: isDarkHour ? '#78fe8d' : '#9efdff', textShadow: isDarkHour ? '3px 3px #0b2607' : '3px 3px #246185'}">
          <p>{{ daysUntilFull + " / "}}</p>
        </div>
        <div v-else :class="daysUntilFullStyle" :style="{ color: isDarkHour ? '#e8ffe9' : '#d9fdff', textShadow: isDarkHour ? '3px 3px #0b2607' : '3px 3px #246185'}">
          <p>{{ calcPhaseOfMoon.string }}</p>
        </div>
        <img :class="moonScale" :src="calcPhaseOfMoon.moonIMG">
      </div>

    </div>

  </div>
</template>

<script>

//---------------Screen Sizing----------------------------------------------
var screenWidth = window.screen.availWidth;
var screenHeight = window.screen.availHeight;

var x = document.body;
x.setAttribute("width",screenWidth);
x.setAttribute("height",screenHeight);

//using this library's functions: https://github.com/jasonsturges/lunarphase-js to get the lunarphases              
//https://jasonsturges.medium.com/moons-lunar-phase-in-javascript-a5219acbfe6e#:~:text=Using%20Julian%20date%2C%20you%20can%20calculate%20the%20current%20phase%20of,time%20between%20two%20identical%20syzygies.
import { useFavicon } from '@vueuse/core';

let basePath = import.meta.env.BASE_URL;

//global vars
let shortFormDays = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
const LUNAR_MONTH = 29.530588853;
let timesOfDay = [
  { string: 'Dark Hour', url: `${basePath}assets/Backgrounds/tartarus.png`, start: 0, end: 1 },
  { string: 'Early Morning', url: `${basePath}assets/Backgrounds/earlyMorning.png`, start: 1, end: 6 },
  { string: 'Morning', url: `${basePath}assets/Backgrounds/morning.png`, start: 6, end: 11 },
  { string: 'Lunch', url: `${basePath}assets/Backgrounds/lunchTime.png`, start: 11, end: 12 },   
  { string: 'Afternoon', url: `${basePath}assets/Backgrounds/school.png`, start: 12, end: 15 },   
  { string: 'After School', url: `${basePath}assets/Backgrounds/afterSchool.png`, start: 15, end: 18 },   
  { string: 'Evening', url: `${basePath}assets/Backgrounds/evening.png`, start: 18, end: 21 },
  { string: 'Late Night', url: `${basePath}assets/Backgrounds/lateNight.png`, start: 21, end: 24 },
];

let weekendTimesOfDay = [
  { string: 'Dark Hour', url: `${basePath}assets/Backgrounds/tartarus.png`, start: 0, end: 1 },
  { string: 'Early Morning', url: `${basePath}assets/Backgrounds/earlyMorning.png`, start: 1, end: 6 },  
  { string: 'Daytime', url: `${basePath}assets/Backgrounds/weekends.png`, start: 6, end: 15 },
  { string: 'Afternoon', url: `${basePath}assets/Backgrounds/afternoon.png`, start: 15, end: 18 },
  { string: 'Evening', url: `${basePath}assets/Backgrounds/evening.png`, start: 18, end: 21 },
  { string: 'Late Night', url: `${basePath}assets/Backgrounds/lateNight.png`, start: 21, end: 24 },
];
//14.75 is full moon
let moonPhases = [
  { string: 'New', url: `${basePath}assets/Moon/01new.png`, start: 0, end: 0.5, showText: true },
  { string: 'Sliver Left', url: `${basePath}assets/Moon/02sliverL.png`, start: 0.5, end: 3.2, showText: false },
  { string: 'Waxing Crescent', url: `${basePath}assets/Moon/03waxingCres.png`, start: 3.2, end: 4.2, showText: false },
  { string: 'Almost Half', url: `${basePath}assets/Moon/04almostHalf.png`, start:4.2, end: 6.9, showText: false },
  { string: 'Half', url: `${basePath}assets/Moon/05halfR.png`, start: 6.9, end: 7.9, showText: true },
  { string: 'Past Half', url: `${basePath}assets/Moon/06pastHalf.png`, start: 7.9, end: 10.6, showText: false },
  { string: 'Waxing Gibbous', url: `${basePath}assets/Moon/07waxingGibb.png`, start: 10.6, end: 11.6, showText: false },
  { string: 'Almost Full', url: `${basePath}assets/Moon/08almostFull.png`, start: 11.6, end: 14, showText: false },
  { string: 'Full', url: `${basePath}assets/Moon/09full.png`, start: 14, end: 15, showText: true },
  { string: 'Past Full', url: `${basePath}assets/Moon/10pastFull.png`, start: 15, end: 18, showText: false },
  { string: 'Waning Gibbous', url: `${basePath}assets/Moon/11waningGibb.png`, start: 18, end: 19, showText: false },
  { string: 'Almost Half', url: `${basePath}assets/Moon/12almostHalf.png`, start: 19, end: 21.6, showText: false },
  { string: 'Half', url: `${basePath}assets/Moon/13HalfL.png`, start: 21.6, end: 22.6, showText: true },
  { string: 'Sliver Right', url: `${basePath}assets/Moon/14pastHalf.png`, start: 22.6, end: 25.3, showText: false },
  { string: 'Waning Crescent', url: `${basePath}assets/Moon/15waningCres.png`, start: 25.3, end: 26.3, showText: false },
  { string: 'Almost New', url: `${basePath}assets/Moon/16sliverR.png`, start: 26.3, end: 30, showText: false },
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
      formatStyle: 'formatStyle',
      isDarkHour: false,
      dayInMonthNum: new Date().getDate(), //0 to 31,
      monthNum: new Date().getMonth() + 1, //0 to 11 (add +1 to get correct month),
      dayOfWeekNum: new Date().getDay(), //0, 1, 2, 3, 4, 5, 6 (STARTING AT SUNDAY = 0)
      dayOfWeekLetter: shortFormDays[new Date().getDay()],
      hideNext: false,
      hour: new Date().getHours(),
      julianDate: (new Date().getTime() / 86400000) - (new Date().getTimezoneOffset() / 1440) + 2440587.5,
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

      let arrayOfTimes = timesOfDay;
      if(this.isWeekEnd){
        arrayOfTimes = weekendTimesOfDay;
      }

      //loop through the array to figure out which string and background to display
      for(let i=0;i<arrayOfTimes.length;i++){
        if(this.hour >= arrayOfTimes[i].start && this.hour < arrayOfTimes[i].end){

          if(arrayOfTimes[i].string === "Dark Hour"){ //if its the dark hour, set the flag
            this.isDarkHour = true;
          } else {
            this.isDarkHour = false;
          }
          return {
            timeOfDay: arrayOfTimes[i].string,
            backIMG: arrayOfTimes[i].url
          };
        }
      }
    },
    calcPhaseOfMoon(){

      //loop through the array to figure out which string and background to display
      for(let i=0;i<moonPhases.length;i++){

        if(this.lunarAge >= moonPhases[i].start && this.lunarAge < moonPhases[i].end){ 
          if(moonPhases[i].showText === true){ //if its a notable moon phase, hide next and spell it out
            this.hideNext = true;
          } else {
            this.hideNext = false;
          }
          //update the favicon of the page to be the correct moon image
          this.updateFavicon(moonPhases[i].url);
          return {
            moonIMG: moonPhases[i].url,
            string: moonPhases[i].string
          };
        }
      }
    },
    lunarAgePercent(){
      let percent = (this.julianDate - 2451550.1) / LUNAR_MONTH;
      return this.normalize(percent);
    },
    lunarAge(){
      return this.lunarAgePercent * LUNAR_MONTH;
    },
    daysUntilFull(){ 
      let days = Math.round(LUNAR_MONTH/2) - this.lunarAge;
      if(days <= 0){
        days = days + LUNAR_MONTH;
      }
      return Math.round(days);
    },
  },
  methods: {
    normalize(value){
      value = value - Math.floor(value);
      if (value < 0)
          value = value + 1

      return value;
    },
    //continue to get the current time
    getCurrTimes(){
      this.dayInMonthNum = new Date().getDate();
      this.monthNum = new Date().getMonth() + 1; //0 to 11 (add +1 to get correct month),
      this.dayOfWeekNum = new Date().getDay(); //0, 1, 2, 3, 4, 5, 6 (STARTING AT SUNDAY = 0)
      this.dayOfWeekLetter = shortFormDays[new Date().getDay()];
      this.hour = new Date().getHours();
      this.julianDate = (new Date().getTime() / 86400000) - (new Date().getTimezoneOffset() / 1440) + 2440587.5;
    },

    updateFavicon(moonValue){
      const favicon = useFavicon();
      favicon.value = moonValue;
    }
  },
  mounted(){
    // Start the interval to call checkValue every second
    setInterval(this.getCurrTimes, 1000);
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
    font-weight: 900; 
  }
  .UIBackScale {
    width: 40%;
    height: auto;
    float: right;
    position: relative;
    z-index: 0;
  }
  .BackgroundScale{
    max-width:auto; 
    max-height:105%; 
    margin-left:auto;
    margin-right: auto;
    z-index: -100;
    position: absolute;
  }
  .UIHold{
    display: flex;
    flex-direction: column;
    width: 96%;
    align-items: flex-end;
    position: absolute;
    z-index: 1;
    padding: 2%;
  }
  .currDateStyle{
    position: relative;
    text-align: right;
    font-size: 3.5vw;
  }
  .currDateStyle > p {
    padding-left: 15px;
    display: inline-block;
  }
  .currTimeStyle {
    position: relative;
    text-align: right;
    font-size: 3.5vw;
  }
  .next{
    position: relative;
    text-align: right;
    font-size: 2.5vw;
    display: block;
    padding-right: 8%;
  }
  .daysUntilFullStyle{
    position: relative;
    text-align: right;
    font-size: 3.5vw;
  }
  .moonScale{
    max-width: 9%;
    padding-left: 15px;
  }
  .formatStyle{
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
