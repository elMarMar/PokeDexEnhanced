export function quickSortByObjectAttribute(arr, attribute) {
  if (arr.length <= 1) return arr;

  const pivotObject = arr[arr.length - 1];
  const pivotAttribute = pivotObject[attribute];

  const leftArr = [];
  const rightArr = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i][attribute] < pivotAttribute) {
      leftArr.push(arr[i]);
    } else {
      rightArr.push(arr[i]);
    }
  }

  return [
    ...quickSortByObjectAttribute(leftArr, attribute),
    pivotObject,
    ...quickSortByObjectAttribute(rightArr, attribute),
  ];
}
