'use strict'
const fs = require("fs")
// const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
// body-parser - node.js 中间件，用于处理 JSON, Raw, Text 和 URL 编码的数据。
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// 返回静态文件
app.use(express.static('views'))

// 默认: 折线
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/polyline.html')
})

// 区间：曲线
app.get('/curve', (req, res) => {
  res.sendFile(__dirname + '/views/curve.html')
})
// 工点：点
app.get('/marker', (req, res) => {
  res.sendFile(__dirname + '/views/marker.html')
})

// 获取区间坐标
app.post('/coordinate', (req, res) => {
  console.log(req.body.arr)
  const name = req.body.name
  const data = JSON.stringify(req.body)
  const exists = fs.existsSync(`data/interval/${name}.json`) // 检查文件是否已经存在

  const addIntervalFile = name => fs.appendFile(`data/interval/${name}.json`, data, err => {
    if (err) throw err
    console.log('线网数据已添加到文件')
  })

  if (exists) {
    const fd = fs.openSync(`data/interval/${name}.json`, 'r+')
    fs.ftruncate(fd, err => { // 如文件存在，清空文件内容
      if (err) throw err
      addIntervalFile(name)
    })
  } else {
    addIntervalFile(name)
  }

  res.send('interval update ok')
})

// 获取工点坐标
app.post('/site', (req, res) => {
  console.log(req.body.position)
  const name = req.body.name
  const data = JSON.stringify(req.body)
  const exists = fs.existsSync(`data/site/${name}.json`) // 检查文件是否已经存在

  const addSiteFile = name => fs.appendFile(`data/site/${name}.json`, data, err => {
    if (err) throw err
    console.log('工点数据已添加到文件')
  })

  if (exists) {
    const fd = fs.openSync(`data/site/${name}.json`, 'r+')
    fs.ftruncate(fd, err => { // 如文件存在，清空文件内容
      if (err) throw err
      addSiteFile(name)
    })
  } else {
    addSiteFile(name)
  }

  res.send('site upload ok')

})

app.listen(9998, () => console.log('Mock data server is started:http://localhost:9998'))
