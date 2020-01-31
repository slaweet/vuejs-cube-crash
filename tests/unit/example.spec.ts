import { shallowMount } from '@vue/test-utils';
import CubeCrash from '@/components/CubeCrash.vue';

describe('CubeCrash.vue', () => {
  it('renders with no message at first', () => {
    const wrapper = shallowMount(CubeCrash, { });
    expect(wrapper.text()).toMatch('');
  });
});
