const express = require('express')
const dotenv = require('dotenv')

const path = require('path')
const fs = require('fs')

dotenv.config()

const aws = require('aws-sdk')
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const app = express()

app.post('/distributed', (req, res, next) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: 'index.html'
  }

  s3.getObject(params, (error, data) => {
    if (error) {
      res.status(500).json({
        message: 'Failed at pulling from S3 Bucket'
      })
    }

    fs.writeFileSync(path.resolve(__dirname, 'static/index.html'),
      data.Body.toString())
  })

  res.status(200).json({
    message: 'Successfully pulled from S3 Bucket'
  })
})

app.get('*', (req, res, next) => {
  try {
    const indexFile = fs.readFileSync(path.resolve(__dirname, 'static/index.html'))
    res.send(indexFile.toString())
  } catch (error) {
    res.status(500).send('Pulling from S3 Bucket is required before distribute ECHO-FRONT')
  }
})

app.listen(process.env.SERVER_PORT, () => {
  console.log('Server is running...')
})
