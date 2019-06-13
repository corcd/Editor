const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1280,
      height: 720
    }
  }); // 创建浏览器实例
  const page = await browser.newPage(); // 创建新的浏览器页面
  await page.goto(
    "https://editor.guangdianyun.tv/screenshot?appid=lmflki2ao&id=3",
    {
      waitUntil: "networkidle2"
    }
  ); // 页面访问地址 http://example.com
  await page.screenshot({
    path: "./example.png"
  }); // 页面截图 example.png

  await browser.close(); // 关闭浏览器
})();
