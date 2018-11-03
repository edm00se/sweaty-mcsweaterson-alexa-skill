const { byZip, TIME_FRAME } = require('../../lib/weatherGetter');

describe('weather getter utility structure', () => {
  it('provides TIME_FRAME constant', () => expect(TIME_FRAME).toBeDefined());
  it('provides byZip function', () => expect(byZip).toBeDefined());
});
