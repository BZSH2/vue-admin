import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Icon from '@/icons/Icon.vue'

describe('Icon.vue', () => {
  it('renders svg element', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'test-icon',
      },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.classes()).toContain('svg-icon')
  })

  it('computes correct icon name', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'test-icon',
      },
    })
    const useElement = wrapper.find('use')
    expect(useElement.attributes('href')).toBe('#icon-test-icon')
  })

  it('applies custom class name', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'test-icon',
        className: 'custom-class',
      },
    })
    expect(wrapper.classes()).toContain('custom-class')
    expect(wrapper.classes()).toContain('icon-test-icon')
  })
})
