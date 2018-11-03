const lib = require('../../lib/sweaty');

describe('basic structure', () => {
  it("provides 'bringTowel' function", () =>
    expect(lib.bringTowel).toBeDefined());
});
