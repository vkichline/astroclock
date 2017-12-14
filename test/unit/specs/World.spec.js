import Vue from 'vue'
import World from '@/components/World'

// Refer to: https://alexjoverm.github.io/series/Unit-Testing-Vue-js-Components-with-the-Official-Vue-Testing-Tools-and-Jest/

describe('World.vue', () => {
  it('Should have a top-level "world" container', () => {
    const Constructor = Vue.extend(World)
    const vm = new Constructor().$mount()
    expect(vm.$el.id).toBe('world')
  })
})

describe('World.vue', () => {
  it('Should Should contain two img elements', () => {
    const Constructor = Vue.extend(World)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('#b1')).toBeDefined()
    expect(vm.$el.querySelector('#b2')).toBeDefined()
  })
})

describe('World.vue', () => {
  it('Should contain a "content" container', () => {
    const Constructor = Vue.extend(World)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.content')).toBeDefined()
  })
})

describe('World.vue', () => {
  it('Should return a simple UTC time when getTimeString is called', () => {
    const Constructor = Vue.extend(World)
    const vm = new Constructor().$mount()
    let str = vm.getTimeString()
    expect(str).toMatch(/[0-9]{1,2}:[0-9]{2}/)
  })
})

describe('World.vue', () => {
  it('Should toggle "phase" when "change" is called', () => {
    const Constructor = Vue.extend(World)
    const vm = new Constructor().$mount()
    let phase = vm.phase
    vm.change()
    expect(vm.phase).toEqual(!phase)
  })
})
