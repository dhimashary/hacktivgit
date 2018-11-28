const express = require('express')
const router = express.Router()
const RepoController = require('../controllers/repoController')

router.get('/starred', RepoController.getStarred)
router.get('/starred/search/:name', RepoController.filterStarredRepo)
router.post('/', RepoController.create)
router.get('/:username', RepoController.findUserRepos)
router.get('/:owner/:repo', RepoController.findDetailRepos)
router.delete('/starred/:owner/:repo', RepoController.unStar)

module.exports = router
