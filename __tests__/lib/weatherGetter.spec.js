const { byZip, TIME_FRAME } = require('../../lib/weatherGetter');

describe('weather getter utility structure', () => {
  it('provides TIME_FRAME constant', () => expect(TIME_FRAME).toBeDefined());
  it('provides byZip function', () => expect(byZip).toBeDefined());

  it('fetches weather data via the built-in fetch API for a zip lookup', async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        main: { temp_max: 85, humidity: 60 }
      })
    });

    try {
      const weather = await byZip('10001', 'US', TIME_FRAME.NOW);
      expect(weather.main.temp_max).toBe(85);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('zip='),
        expect.objectContaining({ headers: expect.any(Object) })
      );
    } finally {
      global.fetch = originalFetch;
    }
  });
});
