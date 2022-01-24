const overview = document.querySelector(".overview");
const username = "Sarah-C-Arvin";
const repoList = document.querySelector(".repo-list");
const repoInfo = document.querySelector(".repos");
const individualRepoData = document.querySelector(".repo-data");
const backToGallery = document.querySelector(".view-repos");
const searchBox = document.querySelector(".filter-repos");

const gitHubInfo = async function(){
    const userInfo = await fetch(`https://api.github.com/users/${username}`);
    const data = await userInfo.json();
    //console.log(data);
    displayUserInfo(data);
};
gitHubInfo();

const displayUserInfo = function(data){
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `<figure>
    <img alt="user avatar" src=${data.avatar_url} />
  </figure>
  <div>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Bio:</strong> ${data.bio}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
  </div>`;
  overview.append(div);
  myRepos();
};

const myRepos = async function(){
    const repos = await fetch (`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await repos.json();
    //console.log(repoData);
    displayRepoInfo(repoData);
};

const displayRepoInfo = function(repos){
    searchBox.classList.remove("hide");
    for (const repo of repos) {
      const repoItem = document.createElement("li");
      repoItem.classList.add("repo");
      repoItem.innerHTML = `<h3>${repo.name}</h3>`;
      repoList.append(repoItem);
    }
};

repoList.addEventListener("click", function(e){
  if (e.target.matches("h3")){
    const repoName = e.target.innerText;
    //console.log(repoName);
    getRepoInfo(repoName);
  }
});

const getRepoInfo = async function(repoName){
  const getInfo = await fetch (`https://api.github.com/repos/${username}/${repoName}`);
  const info = await getInfo.json();
  console.log(info);
  const fetchLanguages = await fetch(info.languages_url);
  const languageData = await fetchLanguages.json();
  //console.log(languageData);

  const languages = [];
  for (language in languageData){
    languages.push(language);
    //console.log(languages);
  }
  individualRepo(info, languages);
};

const individualRepo = function(info, languages){
  backToGallery.classList.remove("hide");
  individualRepoData.innerHTML = "";
  const div = document.createElement("div");
  individualRepoData.classList.remove("hide");
  repoInfo.classList.add("hide");
  div.innerHTML = `
    <h3>Name: ${info.name}</h3>
    <p>Description: ${info.description}</p>
    <p>Default Branch: ${info.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${info.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
  `;
  individualRepoData.append(div);
};

backToGallery.addEventListener("click", function(){
  repoInfo.classList.remove("hide");
  individualRepoData.classList.add("hide");
  backToGallery.classList.add("hide");
});

searchBox.addEventListener("input", function(e){
  const searchText = e.target.value;
  //console.log(searchText);
  const allRepos = document.querySelectorAll(".repo");
  const lowercaseText = searchText.toLowerCase();

  for (const repo of allRepos){
    repoLowerText = repo.innerText.toLowerCase();
    if (repoLowerText.includes(lowercaseText)){
      repo.classList.remove("hide");
    } else {
      repo.classList.add("hide");
    }
  }
});