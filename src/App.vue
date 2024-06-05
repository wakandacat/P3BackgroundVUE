<template>
  <body>
    <img id="backgroundImage">

    <img v-if="!isDarkHour" :class="UIBackScale" id="UIBackground" src="../src/assets/blueBackSmall.png">
    <img v-else :class="UIBackScale" id="UIBackground" src="../src/assets/greenBackSmall.png">

    <div id="UIHolder">
      <img id="moonPhase">
      <div id="currDate">
          
      </div>
      <div id="currTime">
          
      </div>
      <div id="next">
          
      </div>
      <div id="daysUntilFull">
          
      </div>
    </div>

  </body>
</template>

<script>
//global vars
let isDark = false;


export default {
  data(){
    return {
      isDarkHour: isDark,
      UIBackScale: 'UIBackScale',

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
    margin: 0px;
    overflow-y: hidden; /* Hide vertical scrollbar */
    overflow-x: hidden; /* Hide horizontal scrollbar */
  }
  .UIBackScale {
    width:50%;
    height: auto;
    float: right;
  }
</style>
