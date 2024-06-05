<template>
  <body>
    <img :class="BackPlacement" id="backgroundImage" v-bind:src="backIMG">

    <img v-if="!isDarkHour" :class="UIBackScale" id="UIBackground" src="../src/assets/UI/blueBackSmall.png">
    <img v-else :class="UIBackScale" id="UIBackground" src="../src/assets/UI/greenBackSmall.png">

    <div :class="UIPlacement" id="UIHolder">
      <img id="moonPhase">
      <div id="currDate">
          <p>{{ monthNum + " / " + dayInMonthNum + " • " + dayOfWeekLetter}}</p>
      </div>
      <div id="currTime">
          <p>{{ timeOfDay }}</p>
      </div>
      <div id="next">
          <p>Next:</p>
      </div>
      <div id="daysUntilFull">
          
      </div>
    </div>

  </body>
</template>

<script>
//global vars
let isDark = false;
let shortFormDays = ["Su", "M", "T", "W", "Th", "F", "Sa"];
let isWeekEnd = false;
let timesOfDay = [
  { string: 'Dark Hour', url: '../src/assets/Backgrounds/tartarus.png', start: 0, end: 1, weekendOnly: false },
  { string: 'Early Morning', url: '../src/assets/Backgrounds/earlyMorning.png', start: 1, end: 6, weekendOnly: false },
  { string: 'Morning', url: '../src/assets/Backgrounds/morning.png', start: 6, end: 11, weekendOnly: false },
  { string: 'Lunch', url: '../src/assets/Backgrounds/lunchTime.png', start: 11, end: 12, weekendOnly: false},   
  { string: 'Daytime', url: '../src/assets/Backgrounds/weekends.png', start: 8, end: 15, weekendOnly: true},
  { string: 'After School', url: '../src/assets/Backgrounds/afterSchool.png', start: 15, end: 18, weekendOnly: false},   
  { string: 'Afternoon', url: '../src/assets/Backgrounds/afternoon.png', start: 15, end: 18, weekendOnly: true},
  { string: 'Evening', url: '../src/assets/Backgrounds/evening.png', start: 18, end: 21, weekendOnly: false},
  { string: 'Late Night', url: '../src/assets/Backgrounds/lateNight.png', start: 21, end: 24, weekendOnly: false},
];

//by default, set to early morning
let timeOfDayStr = timesOfDay[1].string;
let timeOfDayBack = timesOfDay[1].url;

//---------------GET THE CURRENT DATE--------------------
var time = new Date();
var day = time.getDate(); //0 to 31
var month = time.getMonth() + 1; //0 to 11 (add +1 to get correct month)
var dayOfWeekInt = time.getDay(); //0, 1, 2, 3, 4, 5, 6 (STARTING AT SUNDAY = 0)
if(dayOfWeekInt === 0 || dayOfWeekInt === 6){
  isWeekEnd = true;
}
var dayOfWeekStr = shortFormDays[dayOfWeekInt];


//---------------GET THE CURRENT TIME OF DAY--------------------------------------------
var hour = time.getHours();

//loop through the array to figure out which string and background to display
for(let i=0;i++;i<timesOfDay.length){
  console.log(timesOfDay[i]);
  if(hour >= timesOfDay[i].start && hour < timesOfDay[i].end && isWeekEnd === timesOfDay[i].weekendOnly){
    timeOfDayStr = timesOfDay[i].string;
    timeOfDayBack = timesOfDay[i].url;
  }
}

export default {
  data(){
    return {
      UIBackScale: 'UIBackScale',
      UIPlacement: 'UIHold',
      BackPlacement: 'BackgroundScale',
      isDarkHour: isDark,
      dayInMonthNum: day,
      monthNum: month,
      dayOfWeekNum: dayOfWeekInt,
      dayOfWeekLetter: dayOfWeekStr,
      timeOfDay: timeOfDayStr,
      backIMG: timeOfDayBack,
    };
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
    background-color: green;
  }
  .BackgroundScale{
    width: 100%;
    height: auto;
    z-index: -100;
    position: absolute;
  }
  .UIHold{
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: baseline;
    position: absolute;
    z-index: 1;
    background-color: aliceblue;
  }
</style>
