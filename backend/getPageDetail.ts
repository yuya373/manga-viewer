import { basename } from 'path';
import puppeteer, { Browser } from 'puppeteer-core';
import { findChromium } from './findChromium';

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (browser == null) {
    const executablePath = await findChromium();
    console.log('executablePath', executablePath);
    browser = await puppeteer.launch({
      executablePath,
    });
    browser.on('disconnected', () => {
      console.error('disconnected');
      browser = null;
    });
  }

  return browser;
}

export const getPageDetail = async (str: string) => {
  let url;
  try {
    url = new URL(str);
  } catch (error) {
    console.error('Failed to initialize URL:', str, error);
    return {
      error,
    };
  }
  const b = await getBrowser();
  const { pathname, origin } = url;
  const fileNames = basename(pathname).split('-');
  const fileName = fileNames[fileNames.length - 1];
  console.log('fileName', fileName);
  const page = await b.newPage();
  console.log('newPageCreated');
  let pageError;
  page.on('error', error => {
    console.error('error', error);
    pageError = error;
  });
  page.on('pageerror', error => {
    console.error('pageerror', error);
    pageError = error;
  });
  const readerUrl = `${origin}/reader/${fileName}`;
  await page.goto(readerUrl);
  console.log('Navigated', readerUrl);
  await new Promise(resolve => setTimeout(resolve, 1000));
  const id: string = await (page.evaluate(`galleryinfo.id`) as Promise<string>);
  const title: string = await (page.evaluate(
    `document.querySelector("title").text`
  ) as Promise<string>);
  const imageUrls: Array<{
    url: string;
    name: string;
  }> = await (page.evaluate(
    `
         galleryinfo.files.map(e => {
           const dir = e.haswebp ? 'webp' : e.hasavif ? 'avif' : undefined;
           const base = e.haswebp ? 'a' : undefined;
           return {
             url: url_from_url_from_hash(${id}, e, dir, undefined, base),
             name: e.name,
           };
         })
        `
  ) as Promise<Array<{ url: string; name: string }>>);
  await page.close();

  console.log('getPageDetailFinished', { title, imageUrls, pageError });


  return {
    id,
    title,
    imageUrls,
    error: pageError,
  };
};
