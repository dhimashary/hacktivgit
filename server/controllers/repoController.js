const axios = require('axios')

class RepoController {
    static getStarred(req, res) {
        axios({
            method: 'GET',
            url: 'https://api.github.com/user/starred',
            headers: {
                'Authorization' : process.env.GITHUB_TOKEN
            }
        })
        .then(repos => {
            let result = repos.data.map(data => {
                let repo = {}
                repo.name = data.name;
                repo.owner = data.owner.login;
                repo.description = data.description;
                repo.url = data.html_url;
                repo.starsCount = data.stargazers_count;
                return repo
            })
            res.status(200).json(result)
        })
        .catch(err => {
            //console.log(err)
            res.status(500).json(err)
        })
    }

    static filterStarredRepo(req, res) {
        axios({
            method: 'GET',
            url: 'https://api.github.com/user/starred',
            headers: {
                'Authorization' : process.env.GITHUB_TOKEN
            }
        })
        .then(repos => {
            let result = repos.data.map(data => {
                let repo = {}
                repo.name = data.name;
                repo.owner = data.owner.login;
                repo.description = data.description;
                repo.url = data.html_url;
                repo.starsCount = data.stargazers_count;
                return repo
            }).filter(repo => repo.name.includes(req.params.name))
            res.status(200).json(result)
        })
        .catch(err => {
            //console.log(err)
            res.status(500).json(err)
        })
    }

    static findUserRepos(req, res) {
        axios({
            method: 'GET',
            url: `https://api.github.com/users/${req.params.username}/repos`,
            headers: {
                'Authorization' : process.env.GITHUB_TOKEN
            }
        })
        .then(repos => {
            res.status(200).json(repos.data)
        })
        .catch(err => {
            //console.log(err)
            res.status(500).json(err)
        })
    }

    static findDetailRepos(req, res) {
        axios({
            method: 'GET',
            url: `https://api.github.com/repos/${req.params.owner}/${req.params.repo}`,
            headers: {
                'Authorization' : process.env.GITHUB_TOKEN
            }
        })
        .then(repos => {
          console.log(repos)
            res.status(200).json(repos.data)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    }

    static unStar(req, res) {
        axios({
            method: 'DELETE',
            url: `https://api.github.com/user/starred/${req.params.owner}/${req.params.repo}`,
            headers: {
                'Authorization' : process.env.GITHUB_TOKEN
            }
        })
        .then(response => {
            console.log(response)
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err.response)
            res.status(500).json({
                err : err.response.data
            })
        })
        //res.status(200).json(req.params)
    }

    static create(req, res) {
        axios({
            method: 'POST',
            url: 'https://api.github.com/user/repos',
            headers: {
                'Authorization' : process.env.GITHUB_TOKEN
            },
            data: {
                name : req.body.name,
                description : req.body.description
            }
        })
        .then(response => {
            console.log(response)
            res.status(201).json(response.data)
        })
        .catch(err => {
            console.log(err.response)
            res.status(500).json({
                err : err.response.data
            })
        })
        //res.status(200).json(req.body.name)
    }


}

module.exports = RepoController
