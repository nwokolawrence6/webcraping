'use strict';

const puppeteer = require('puppeteer');

let runBot =async () => {
  const browser = await puppeteer.launch({headless: false});
  let jsonInput = {
    "URL": "http://www.paddypower.com/racing?PLT=I&RE=QL&REP=1&P=SB&PG=HME&OR=NLL&S=NLL&SC=HRS",
    "loop": "table.default>tbody>tr>td>a.no_custom",
    "ParentSelector": "table.default>tbody>tr",
    "SiblingSelector": "th>a",
    "Selector": "table"
    
  };
  
  const page = await browser.newPage();
  await page.goto(jsonInput.URL, {waitUntil: 'networkidle2'});
  await page.waitForSelector(jsonInput.Selector);
  await page.addScriptTag({url: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js'});
  let result = await page.evaluate((jsonInput) => {
    
    let UrlLoc = jsonInput.loop;
    let links = $(UrlLoc), result = {};
    
    links.each(function () {
      let e = $(this);
      let venue = e.parents(jsonInput.ParentSelector).find(jsonInput.SiblingSelector).text().trim(),
        time = e.text().trim().slice(0, 5),
        url = e.attr('href');
      
      if (venue.includes("Next 5 Races" || "Live Betting")) {
        //Ignored
      } else {
        if (!result[(venue)]) {
          
          result[venue] = [];
          
        }
        result[venue].push({ "url": url,"time": time, "status":"ACTIVE"});
      }
    });
    
    return result;
    
  }, jsonInput);
  if (!result) {
    console.log("Result object has returned empty");
    
  } else {
    console.log(JSON.stringify(result));
  }
  await browser.close();
};
runBot().catch((err) => {console.log(err); process.exit(1);});
