const TencentAI = require('tencent-ai-nodejs-sdk')
const tencentAi = new TencentAI('<id>','<key>')

const fs = require('fs')


async function wordseg(){
  const result    = await tencentAi.nlpWordSeg('今天深圳的天气怎么样？明天呢')
  console.log(result)
}

async function asrTest(){
  const voice = fs.readFileSync('./assets/output.pcm')
  let voiceBase64 = Buffer.from(voice);
  const data   = voiceBase64.toString('base64')
  const result    = await tencentAi.aaiAsr(data, 1)
  console.log(result)
}

asrTest()
