import { helper } from '@ember/component/helper';

export function addOne(num: number) {
  return num + 1;
}

export default helper(function ([index]: [number]) {
  return addOne(index);
});
