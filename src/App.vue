<template>
  <div>
    <img :class="BackPlacement" v-bind:src="calcTimeOfDay.backIMG"> 

    <img v-if="!isDarkHour" :class="UIBackScale" src="../src/assets/UI/blueBackSmall.png">
    <img v-else :class="UIBackScale" id="UIBackground" src="../src/assets/UI/greenBackSmall.png">

    <div :class="UIPlacement">
      <img id="moonPhase">
      <div :class="currDateStyle">
          <p>{{ monthNum + " / " + dayInMonthNum + " • " + dayOfWeekLetter}}</p>
      </div>
      <div :class="currTimeStyle">
          <p>{{ calcTimeOfDay.timeOfDay }}</p>
      </div>
      <div :class="nextStyle">
          <p>Next:</p>
      </div>
      <div :class="daysUntilFullStyle">
          
      </div>
    </div>

  </div>
</template>

<script>

//global vars
let shortFormDays = ["Su", "M", "T", "W", "Th", "F", "Sa"];
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
//      timeOfDay: timesOfDay[1].string,
//backIMG: timesOfDay[1].url,
export default {
  data(){
    return {
      UIBackScale: 'UIBackScale',
      UIPlacement: 'UIHold',
      BackPlacement: 'BackgroundScale',
      currDateStyle: 'currDateStyle',
      currTimeStyle: 'currTimeStyle',
      nextStyle: 'next',
      daysUntilFullStyle: 'daysUntilFullStyle',
      isDarkHour: false,
      dayInMonthNum: new Date().getDate(), //0 to 31,
      monthNum: new Date().getMonth() + 1, //0 to 11 (add +1 to get correct month),
      dayOfWeekNum: new Date().getDay(), //0, 1, 2, 3, 4, 5, 6 (STARTING AT SUNDAY = 0)
      dayOfWeekLetter: shortFormDays[new Date().getDay()],

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
    }
  },
  methods: {
    //continue to get the current time
    getCurrTimes(){
      this.dayInMonthNum = new Date().getDate();
      this.monthNum = new Date().getMonth() + 1; //0 to 11 (add +1 to get correct month),
      this.dayOfWeekNum = new Date().getDay(); //0, 1, 2, 3, 4, 5, 6 (STARTING AT SUNDAY = 0)
      this.dayOfWeekLetter = shortFormDays[new Date().getDay()];
    },
  },
  mounted(){

    // Start the interval to call checkValue every minute
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
}
</style>
