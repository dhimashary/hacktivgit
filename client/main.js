$(document).ready(function() {
  console.log('ready go!')
  checkLogin()

  function checkLogin() {
      if (localStorage.getItem('token')) {
      console.log('hai')
      $("#loginBtn").hide()
      $("#logoutBtn").show()
      $("#repoList").show()
      $("#repoList").empty()
      $(".content").show()
      $("#addRepo").show()
      getStarred()
    } else {
      $("#loginBtn").show()
      $("#logoutBtn").hide()
      $("#repoList").hide()
      $("#repoList").empty()
      $(".content").hide()
      $("#addRepo").hide()
    }
  }

  function login() {
    $.ajax({
      url: 'http://localhost:3000/users/login',
      method : "POST",
      data : {
          'email' : $("#InputEmail").val(),
          'password' : $("#InputPassword").val()
      }
    })
    .done(response => {
      console.log(response)
      localStorage.setItem('token', response.token)
      checkLogin()
    })
    .fail(err => {
      alert('Wrong username or password')
    })
  }

  function logout() {
    localStorage.removeItem('token')
    checkLogin()
  }

  function getStarred() {
    $.ajax({
      url: 'http://localhost:3000/repo/starred',
      method: "GET"
    })
    .done(response => {
      console.log(response)
      $("#repoList").append('<h3 class="text-center mt-2">Starred Repo</h3>')
      $.each(response, (index, value) => {
          $("#repoList").append(`
                            <hr>
                            <div class='${value.owner} ${value.name}' id='repo-border'>
                            <h5>${value.name}</h5>
                            <hr>
                            <p class="owner">${value.owner}</p>
                            <p>${value.description}</p>
                            <a href="${value.url}">View on Github</a>
                            <p>Stars : ${value.starsCount}</p>
                            <button class="readMore btn btn-outline-primary"> Read More </button>
                            </div>
                            <br>`)
        })
    })
    .catch(err => {
      console.log(err)
    })
  }

  function addRepo() {
    $.ajax({
      url: 'http://localhost:3000/repo',
      method: "POST",
      data : {
        'name' : $("#InputName").val(),
        'description' : $("#InputDescription").val()
      }
    })
    .done(response => {
      console.log(response)
      alert('Repo successfully created')
    })
    .catch(err => {
      console.log(err)
      alert('Create repo failed')
    })
  }

  function searchStarred() {
    console.log('masuk')
    let searchInput = $("#search").val()
    $.ajax({
      url: 'http://localhost:3000/repo/starred/search/' +searchInput,
      method: 'GET'
    })
    .done(response => {
      $("#repoList").empty()
      $("#repoList").append('<h3 class="text-center mt-2">Starred Repo</h3>')
      $.each(response, (index, value) => {
          $("#repoList").append(`
                            <hr>
                            <div class='${value.owner} ${value.name}' id='repo-border'>
                            <h5>${value.name}</h5>
                            <hr>
                            <p class="owner">${value.owner}</p>
                            <p>${value.description}</p>
                            <a href="${value.url}">View on Github</a>
                            <p>Stars : ${value.starsCount}</p>
                            <button class="readMore btn btn-outline-primary"> Read More </button>
                            </div>
                            <br>`)
        })
    })
    .catch(err => {
      console.log(err)
    })
  }

  function searchUserRepo(username) {
      $.ajax({
        url : `http://localhost:3000/repo/${username}`,
        method : "GET"
      })
      .done((data) => {
        console.log(data)
        $("#repoList").empty()
        $("#repoList").append('<h3 class="text-center mt-2">Starred Repo</h3>')
        $.each(data, (index, value) => {
          if (value.description === null) {
            var desc = "No description"
          } else {
            var desc = value.description
          }
          $("#repoList").append(`<hr>
                                <div class='${value.owner.login} ${value.name}' id='repo-border'>
                                <h5>${value.name}</h5>
                                <hr>
                                <p class="owner">${value.owner.login}</p>
                                <p>${desc}</p>
                                <a href="${value.git_url}">View on Github</a>
                                <p>Stars : ${value.stargazers_count}</p>
                                <button class="readMore btn btn-outline-primary"> Read More </button>
                                </div>
                                <br>`)

        })
      })
      .catch((err) => {
        console.log(err)
      })
    }

  function showRepoDetail(owner, repo) {
    return new Promise( (resolve, reject) => {
      $.ajax({
        url: 'http://localhost:3000/repo/' + owner + '/' + repo,
        method: "GET"
      })
      .done(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
    })
  }
  $("#userList").on('click', '.user', event => {
      const val = $(event.currentTarget).attr('id');
      console.log(val);
        searchUserRepo(val)
    })
  $("#searchButton").click(searchStarred)
  $("#repoList").on("click", ".readMore", event => {
    const title = $(event.currentTarget).prevAll('h5').text();
    const owner = $(event.currentTarget).prevAll('.owner').text();
    showRepoDetail(owner, title)
      .then(repo => {
        $("#repoDetail").empty()
        $("#repoDetail").append(`
                                <p>Created at : ${repo.created_at}</p>
                                <p>Total forks : ${repo.forks}</p>
                                <p>Owner : ${repo.owner.login}</p>
                                <img src="${repo.owner.avatar_url}"></img>`)
        console.log('time', repo.created_at)
        console.log('forks', repo.forks)
        console.log('name', repo.name)
        console.log('owner image', repo.owner.avatar_url)
        console.log('owner', repo.owner.login)
      })
      .catch(err => {
        console.log(err)
      })
  })
  $("#buttonClick").click(login)
  $("#logoutBtn").click(logout)
  $("#buttonAdd").click(addRepo)
})
