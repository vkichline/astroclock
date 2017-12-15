import Vue from 'vue'
import ClockFace from '@/components/ClockFace'

// Refer to: https://alexjoverm.github.io/series/Unit-Testing-Vue-js-Components-with-the-Official-Vue-Testing-Tools-and-Jest/

describe('ClockFace.vue', () => {
  it('Should have a top-level "clock-face" container', () => {
    const Constructor = Vue.extend(ClockFace)
    const vm = new Constructor().$mount()
    expect(vm.$el.className).toBe('clock-face')
  })
})

describe('ClockFace.vue', () => {
  it('Should return an object from getTimeParts with 7 properties', () => {
    const Constructor = Vue.extend(ClockFace)
    const vm = new Constructor().$mount()
    let now = new Date(2017, 11, 14, 14, 54, 3, 0)
    let t = vm.getTimeParts(now)
    expect(Object.keys(t).length).toBe(7)
    expect(t.hhmm).toEqual('2:54')
    expect(t.ss).toEqual('03')
    expect(t.suffix).toEqual('PM')
    expect(t.full).toEqual('2:54:03 PM')
    expect(t.dow).toEqual('Thursday')
    expect(t.mdy).toEqual('December 14, 2017')
    expect(t.isPM).toBe(true)
  })
})
