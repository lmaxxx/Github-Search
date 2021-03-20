const _ = (selector) => {
    return document.querySelector(selector)
}

class Page {
    constructor() {
        this.theme = "dark"
        this.searchUrl = "https://api.github.com/search/users?client_id=537eb1ccd6cf3d86e0dd&secret_id=ed69e0ea1b0c18f1fff0f079bff42f0f72fbea09"
        this.userData = []
        this.searchData = []
    }

    getSearchData() {
        const value = _(".form__search-bar").value
        _(".form__search-bar").value = ""

        if(value) {
            fetch(`${this.searchUrl}&q=${value.toLowerCase()}`)
            .then(response => response.json())
            .then(data => {
                this.searchData = [...data.items]

                _(".result").innerHTML = ""
                _(".result__querytext").innerHTML = `Results for <strong class="result__result-text">"${value}"</strong>`
                this.searchData.forEach((item, index) => {
                    const block = document.createElement("section")
                    const content = `
                    <img class="result__img" src="${item.avatar_url}" alt="">
                    <p class="result__nickname">${item.login}</p>
                    <button onclick="page.getUserInfo(${index})" class="result__button">Show</button>`
        
                    block.classList.add("result__section")
                    block.innerHTML = content
        
                    _(".result").appendChild(block)
                })
            })
        } else {
            _("#alert-wrapper").innerHTML = `
            <div class="alert alert-warning alert-dismissible show fade error-alert" role="alert">
                You should type something below.
                <button type="button" class="btn-close close-button" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `
        }
    }

    async getUserInfo(index) {
        const user = page.searchData[index]

        const reposResp = await fetch(`https://api.github.com/users/${user.login.toLowerCase()}/repos?client_id=537eb1ccd6cf3d86e0dd&secret_id=ed69e0ea1b0c18f1fff0f079bff42f0f72fbea09&per_page=100`);
        const repos = await reposResp.json();

        if(repos.length > 0) {
            _(".main__user").innerHTML = `
            <button id="back"><i class="fas fa-arrow-left"></i></button>
            <div class="head">
                <div class="head__img-wrapper">
                    <img class="head__img" src="${user.avatar_url}" alt="">
                    <p class="head__name">${user.login}</p>
                    <button class="head__button" onclick="document.location.href='${user.html_url}'">Go to Github</button>
                </div>
                <div class="head__status">
                    <ul>
                        <li><strong>Type:</strong> ${user.type}</li>
                        <li><strong>Repos:</strong> ${repos.length}</li>
                    </ul>
                </div>
            </div>
            <h2 class="repo-title">Repos</h2>
            <div class="repos"></div>`
        } else {
            _(".main__user").innerHTML = `
            <button id="back"><i class="fas fa-arrow-left"></i></button>
            <div class="head">
                <div class="head__img-wrapper">
                    <img class="head__img" src="${user.avatar_url}" alt="">
                    <p class="head__name">${user.login}</p>
                    <button class="head__button" onclick="document.location.href='${user.html_url}'">Go to Github</button>
                </div>
                <div class="head__status">
                    <ul>
                        <li><strong>Type:</strong> ${user.type}</li>
                        <li><strong>Repos:</strong> ${repos.length}</li>
                    </ul>
                </div>
            </div>`
        }


        _(".main__user").classList.add("show")
        _('.main__search').classList.add("hide")
        
        _("#back").onclick = () => {
            _(".main__user").classList.remove("show")
            _('.main__search').classList.remove("hide")
        } 


        repos.forEach(item => {
            const block = document.createElement("section")
            let content

            if(item.language !== null) {
                content = `
                <a href="${item.html_url}">${item.name}</a>
                <p>${item.language}</p>`
            } else {
                content = `<a href="${item.html_url}">${item.name}</a>`
            }

            block.classList.add("repo")
            block.innerHTML = content

            _(".repos").appendChild(block)
        })




    }
}

const page = new Page()

_("form").onsubmit = e => {
    e.preventDefault()
    page.getSearchData()
}
