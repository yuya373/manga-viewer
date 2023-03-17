import which from 'which';

const paths = [
  // Mac
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',

  // Unix-like
  'headless_shell',
  'headless-shell',
  'chromium',
  'chromium-browser',
  'google-chrome',
  'google-chrome-stable',
  'google-chrome-beta',
  'google-chrome-unstable',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',

  // Windows
  'chrome',
  'chrome.exe', // in case PATHEXT is misconfigured
  // eslint-disable-next-line no-useless-escape
  `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`,
  // eslint-disable-next-line no-useless-escape
  `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`,
];

export async function findChromium(): Promise<string> {
  const resolvedPath = await paths.reduce(
    async (a: Promise<string | null>, path) => {
      const memo = await a;
      if (memo == null) {
        try {
          return await which(path);
        } catch (err) {
          // ignore
          return null;
        }
      } else {
        return a;
      }
    },
    Promise.resolve(null)
  );

  if (resolvedPath == null) {
    throw new Error('Failed to find Chromium');
  }

  return resolvedPath;
}
