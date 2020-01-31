import { shallowMount } from '@vue/test-utils';
import CubeCrash from '@/components/CubeCrash.vue';

describe('CubeCrash.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(CubeCrash, {
      propsData: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
