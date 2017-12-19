<template>
    <div class="forecast">
        <div>{{ fcdata.day }}</div>
        <div>{{ fcdata.low }}&deg; / {{ fcdata.high }}&deg;</div>
        <div :class="fcdata.icon"></div>
        <div>{{ fcdata.text }}</div>
    </div>
</template>

<script>

// This component displays one day's forecast.  An array of these is set up by WeatherStatus.

export default {
  props: [ 'fcdata' ]
}
</script>

<style lang="scss">
@import "./_globals.scss";
@import "./_icons.scss";

.forecast {
    text-shadow: 2px 2px 4px #000000;
    padding: 8px;
    margin: 4px;
    display: inline-block;
    font-size: 30%;
    color: $fgcolor;
    height: 150px;
    width: 150px;
    border-radius: 16px;
    border: 1px gray solid;
    vertical-align: top;
    background: rgba(0, 0, 0, 0.3);
}

.icon {
  height: 100px;
  width: 100px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-left: auto;
  margin-right: auto;
}
</style>