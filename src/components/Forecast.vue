<template>
    <div class="forecast">
        <div>{{ fcdata.day }} {{ fcdata.low }}&deg;/{{ fcdata.high }}&deg;</div>
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
    font-family: sans-serif;
    text-shadow: 3px 3px 4px black;
    padding: 8px;
    margin: 4px;
    display: inline-block;
    font-size: 40%;
    height: 150px;
    width: 150px;
    border-radius: 1em;
    border: 1px #888 solid;
    vertical-align: top;
    background: rgba(0, 0, 0, 0.3);
    background-repeat: no-repeat;
    background-size: cover;
}

.forecast .description {
    font-size: 90%;
    color: $fgcolor;
    margin-left: auto;
    margin-right: auto;
    margin-top: 1em;
    padding: 4px 8px;
    border-radius: 1em;
}

.forecast div {
    color: white;
    margin-left: auto;
    margin-right: auto;
    padding: 2px 8px;
    border-radius: 1em;
    margin-bottom: .5em;
    height: 50px;
}
</style>