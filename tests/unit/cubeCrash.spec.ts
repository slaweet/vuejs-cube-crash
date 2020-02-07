import { mount } from '@vue/test-utils';
import CubeCrash from '@/components/CubeCrash.vue';

import { gridSize, minimumCrashSize } from '../../src/config';

describe('CubeCrash.vue', () => {
  const initialCubeCount = gridSize ** 2;

  it('renders grid of gridSize X gridSize cubes', async () => {
    const wrapper = mount(CubeCrash, { });
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.cube')).toHaveLength(initialCubeCount);
  });

  it('highlights cubes of the same group on hover', () => {
    const wrapper = mount(CubeCrash, { });
    const cubeToHover = wrapper.findAll('.cube.isCrashable').at(0);
    expect(cubeToHover.classes()).not.toContain('active');
    cubeToHover.trigger('mouseover');
    expect(cubeToHover.classes()).toContain('active');
    expect(wrapper.findAll('.cube.active').length).toBeGreaterThanOrEqual(minimumCrashSize);
  });

  it('removes cubes of the same group on click', () => {
    const wrapper = mount(CubeCrash, { });
    const cubeToClick = wrapper.findAll('.cube.isCrashable').at(0);
    cubeToClick.trigger('mouseover');
    const cubesToBeCrashed = wrapper.findAll('.cube.active').length;
    cubeToClick.trigger('click');
    expect(wrapper.findAll('.cube.active')).toHaveLength(0);
    expect(wrapper.findAll('.cube').length).toBeLessThanOrEqual(initialCubeCount - minimumCrashSize);
    expect(wrapper.findAll('.cube')).toHaveLength(initialCubeCount - cubesToBeCrashed);
  });

  it('ignores click on cube with too small group', () => {
    const wrapper = mount(CubeCrash, { });
    const cubeToClick = wrapper.findAll('.cube:not(.isCrashable)').at(0);
    cubeToClick.trigger('mouseover');
    expect(wrapper.findAll('.cube.active')).toHaveLength(0);
    cubeToClick.trigger('click');
    expect(wrapper.findAll('.cube')).toHaveLength(initialCubeCount);
  });

  it('shows high scores at the end of a game and allows starting a new game', () => {
    const wrapper = mount(CubeCrash, { });
    let remainingCubes = initialCubeCount;
    let cubeToClick;

    while (wrapper.findAll('.cube.isCrashable').length > 0) {
      cubeToClick = wrapper.findAll('.cube.isCrashable').at(0);
      cubeToClick.trigger('mouseover');
      const cubesToBeCrashed = wrapper.findAll('.cube.active').length;
      remainingCubes -= cubesToBeCrashed;
      cubeToClick.trigger('click');
      expect(wrapper.findAll('.cube')).toHaveLength(remainingCubes);
    }

    expect(wrapper.find('.highScores h3').text()).toEqual('High Scores');

    wrapper.find('.newGame').trigger('click');
    expect(wrapper.findAll('.cube')).toHaveLength(initialCubeCount);
  });
});
