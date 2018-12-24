import * as express from 'express'

import { elasticSearchHelper } from '../../scripts/class/ElasticSearchHelper'

const search = express.Router()

search.get('/', async (req, res) => {
  const search = new elasticSearchHelper()
  const result = await search.test()

  res.status(200).json({
    result
  })
})

export default search
