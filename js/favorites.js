export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
      .then(data => data.json())
      .then(({login, name, public_repos, followers } = data) =>
      ({login, name, public_repos, followers})
    )}
}


export class favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }


  load(){
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:'))  || []
    console.log((this.entries).length)
  }

  save(){
    localStorage.setItem('@github-favorites:',JSON.stringify(this.entries))
  }

  async add(username){
    try{
      const userExist = this.entries.find(entry => entry.login.toUpperCase() === username.toUpperCase())
      if(userExist) {
        throw new Error('Usuário já cadastrado')
      }
      
    const githubUser = await GithubUser.search(username)
    if(githubUser.login === undefined){
      throw new Error ('Usuário não encontrado!')
      }
      this.entries = [githubUser, ...this.entries]
      this.update()
      this.save()
    }
    catch(error) {alert(error.message) 
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
      console.log(filteredEntries)
      this.entries = filteredEntries
      this.update()
      this.save()
    }
  }
  

export class favoritesView extends favorites {
  constructor(root){
    super(root)
    this.tbody = this.root.querySelector('table tbody')
    this.tr=this.root.querySelector('table tbody tr')
    this.update()
    this.onadd()
  }

  onadd()
  {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => 
    {const {value} = this.root.querySelector('.search input')
    this.add(value)
    }
  }
  

update() {
  if ((this.entries).length === 0){
    this.removeAllTr()
    const tr = document.createElement('tr')
    tr.innerHTML=`<td class="empty"><img src="./img/star.svg"></img><span>Nenhum favorito ainda</span></td>`
    const empty= document.querySelector('.empty')
    console.log(tr)
    this.tbody.append(tr)}
    else{

    this.removeAllTr()

    this.entries.forEach(user => {
    const row = this.createRow()
    row.querySelector('.user img').src = `https://github.com/${user.login}.png`
    row.querySelector('.user img').alt = `imagen de ${user.name}`
    row.querySelector('.user a').href = `https://github.com/${user.login}`
    row.querySelector('.user p'). textContent = user.name
    row.querySelector('.user span').textContent = `/${user.login}`
    row.querySelector('.repositories').textContent = user.public_repos
    row.querySelector('.followers').textContent = user.followers
    row.querySelector('.remove').onclick = () => {
    const validation = confirm('Tem certeza que deseja deletar essa conta?');
    if(validation){
    this.delete(user)
  }
    }
    this.tbody.append(row)
     }
    )}
    
  }


createRow(){
  const tr = document.createElement('tr')

  tr.innerHTML = `
  <td class="user">
  <a href="foto de perfil"><img src="https://github.com/maykbrito.png" alt="">
  <div><p>Mayk Brito</p>
  <span>maykbrito</span>
  </div></a></td>
  <td class="repositories">76</td>
  <td class="followers">9589</td>
  <td class="action"><button class="remove">Remover</button></td>
  `
  return tr
}

removeAllTr() {

    this.tbody.querySelectorAll('tr')
      .forEach ((tr) => {tr.remove()}) 
  }
}