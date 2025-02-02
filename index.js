// puppeteer API : https://pptr.dev/#?product=Puppeteer&version=v12.0.0
const puppeteer = require('puppeteer');

const process = require('process');
const fs = require('fs');
const Collector = require('./server/Collector');
const SERVER_CONST = require('./server/constant');

const Logger = require('./logger');
const { LOG_TYPE } = require('./logger');

var targetNewsPath = process.argv[2]; // todo: make this const
var globalConfigFilePath = process.argv[3]; // todo: make this const

// [debug]
targetNewsPath = "C:\\git_local\\topic_collector_docker\\topic_channel\\coindeskkorea.json";
targetNewsPath = "C:\\git_local\\topic_collector_docker\\topic_channel\\kr_investing_com.json";
globalConfigFilePath = "C:\\git_local\\topic_collector_docker\\config.json";
// [debug] end

/**
 * Coding convention
 *  - prefix with 'nc'    : This means that a variable is relevant to 'news channel'.
 *  - a name of variables : The under score('_') charactor is used when denoting white space between words.
 *  - a name of functinos : Upper camel case is used but a name starts with small case.
 *                          A function name can start with "__" if the one is private function on a class.
 *  - a name of classes   : Upper camel case is used.
 */

/**
 * General:
 *   1. The page defined as news_info.urls can have a list of news .
 *   2. A news content could be formed 
 * Format: json
 * Descriptions: 
 * news_info = {
 *   
 * }
 */
const newsInfo = JSON.parse(fs.readFileSync(targetNewsPath, 'utf8'));

/**
 * 
 */
const globalConfigFileContent = fs.readFileSync(globalConfigFilePath, 'utf8');
const globalConfig = JSON.parse(globalConfigFileContent);
var collector = new Collector();;
var collectorIntervalId = undefined;

function main(newsInfo){
  Logger.setLogPath(globalConfig.log.path);

  if(newsInfo.use) {
    Logger.info(`Target channel: ${newsInfo.newsChannelName}`);
    
    collector.setNewsInfo(newsInfo);

    collectorIntervalId = setInterval(() => {
      if(collector !== undefined) {
        clearInterval(collectorIntervalId);
      }
      
      collector.start();
    }, globalConfig.collector.interval);
  } else {
    Logger.info("No news exist to be collected.");
  }
}

main(newsInfo);