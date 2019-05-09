export function defineMockMatchMedia(matches: boolean) {
  if (window) {
    ;(window as any).matchMedia = jest.fn(() => {
      return {
        matches,
        addListener: function() {},
        removeListener: function() {},
      }
    })
  }
}
