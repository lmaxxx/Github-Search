const _ = (selector) => {
    return document.querySelector(selector)
}

class Page {
    constructor() {
        this.theme = "dark"
        this.searchUrl = "https://api.github.com/search/users"
        this.userData = []
        this.searchData = []
    }

    getSearchData() {
        const value = _(".form__search-bar").value

        if(value) {
            fetch(`${this.searchUrl}?q=${value.toLowerCase()}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.searchData = [...data.items]

                _(".result").innerHTML = ""
                _(".result__querytext").innerHTML = `Results for <strong class="result__result-text">"${value}"</strong>`
                this.searchData.forEach(item => {
                    const block = document.createElement("section")
                    const content = `
                    <img class="result__img" src="${item.avatar_url}" alt="">
                    <p class="result__nickname">${item.login}</p>
                    <button class="result__button">Show</button>`
        
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
}

const page = new Page()

_("form").onsubmit = e => {
    e.preventDefault()
    page.getSearchData()
}