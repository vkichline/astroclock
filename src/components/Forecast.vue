<template>
    <div class="forecast">
        <div>{{ day }}</div>
        <div>{{ low }}&deg; / {{ high }}&deg;</div>
        <div v-bind:class="icon"></div>
        <div>{{ text }}</div>
    </div>
</template>

<script>
export default {
  props: [ 'day', 'low', 'high', 'icon', 'text' ]
}
</script>

<style lang="scss">
@import "./_globals.scss";
@import "./_icons.scss";

.forecast {
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