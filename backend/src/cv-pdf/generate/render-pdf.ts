import { launch } from "puppeteer";

import type { Browser, Page } from "puppeteer";
import { Cv } from "@/cv-pdf/interfaces";

import { renderCvHtml } from "@/cv-pdf/generate/template";

export async function renderCvPdf(cv: Cv): Promise<Buffer> {
  const html = renderCvHtml(cv);

  const browser: Browser = await launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page: Page = await browser.newPage();
    await page.emulateMediaType("print");
    await page.setContent(html, { waitUntil: "load" });

    const pdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
