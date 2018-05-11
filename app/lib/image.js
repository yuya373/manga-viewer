export function sort(aName, bName) {
  const ANumStrings = aName.match(/\d+/);
  const BNumStrings = bName.match(/\d+/);

  if (ANumStrings !== null && BNumStrings !== null) {
    const ANumStr = ANumStrings[0];
    const BNumStr = BNumStrings[0];

    if ((typeof ANumStr) !== 'undefined' && (typeof BNumStr) !== 'undefined') {
      const ANum = Number.parseInt(ANumStr, 10);
      const BNum = Number.parseInt(BNumStr, 10);

      if (!Number.isNaN(ANum) && !Number.isNaN(BNum)) {
        if (ANum < BNum) return -1;
        if (ANum > BNum) return 1;
        return 0;
      }
    }
  }

  const A = aName.toLowerCase();
  const B = bName.toLowerCase();
  if (A < B) return -1;
  if (A > B) return 1;
  return 0;
}
