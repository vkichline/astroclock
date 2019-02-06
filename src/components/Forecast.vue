<template>
    <div class="forecast" v-bind:style="{ backgroundImage: 'url(' + fcdata.icon + ')' }">
        <div>{{ fcdata.day }}</div>
        <br/>
        <div>{{ fcdata.low }}&deg; / {{ fcdata.high }}&deg;</div>
        <div class="description">{{ fcdata.text }}</div>
    </div>
</template>

<script>

// This component displays one day's forecast.  An array of these is set up by WeatherStatus.

export default {
  props: [
    'fcdata'
  ]
}
</script>

<style lang="scss">
@import "./_globals.scss";

.forecast {
    //text-shadow: 2px 2px 4px darkslategray;
    padding: 8px;
    margin: 4px;
    display: inline-block;
    font-size: 30%;
    height: 150px;
    width: 150px;
    border-radius: 16px;
    border: 1px black solid;
    vertical-align: top;
    background: rgba(0, 0, 0, 0.3);
    background-repeat: no-repeat;
    background-size: cover;
}

.forecast .description {
    display: inline-block;
    color: $fgcolor;
    background-color: rgba(0, 0, 0, 0.5);
    margin-left: auto;
    margin-right: auto;
    margin-top: 1em;
    padding: 2px 8px;
    border-radius: 1em;
}

.forecast div {
    display: inline-block;
    color: black;
    background-color: rgba(255, 255, 255, 0.5);
    margin-left: auto;
    margin-right: auto;
    padding: 2px 8px;
    border-radius: 1em;
    margin-bottom: .5em;
}
</style>