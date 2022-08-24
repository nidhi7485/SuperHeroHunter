// const MD5 = require("crypto-js/md5");
// console.log(
//   MD5(
//     "1d2394099377caf51ee8b9b0572bec256d728c3fcd23e756ccd9401360001457f69b812c2"
//   ).toString()
// );

// const hash = MD5(
//   "1d2394099377caf51ee8b9b0572bec256d728c3fcd23e756ccd9401360001457f69b812c2"
// ).toString();

// selecting all the element
const allTabsBody = document.querySelectorAll(".tab-body-single");
const allTabsHead = document.querySelectorAll(".tab-head-single");
const searchForm = document.querySelector(".app-header-search");
const btnsOpenModal = document.querySelector(".show-modal");
const btnCloseModal = document.querySelector(".close-modal");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
let searchList = document.getElementById("search-list");

// variables for modal
let singleData;
let store = "";
let favArray = [];
let deleteBtn;
let favAdded = false;

let activeTab = 1,
  allData;


  // init function
const init = () => {
  showActiveTabBody();
  showActiveTabHead();
  loadFavlist();
};

const showActiveTabHead = () =>
  allTabsHead[activeTab - 1].classList.add("active-tab");

const showActiveTabBody = () => {
  hideAllTabBody();
  allTabsBody[activeTab - 1].classList.add("show-tab");
};

const hideAllTabBody = () =>
  allTabsBody.forEach((singleTabBody) =>
    singleTabBody.classList.remove("show-tab")
  );
const hideAllTabHead = () =>
  allTabsHead.forEach((singleTabHead) =>
    singleTabHead.classList.remove("active-tab")
  );

//      modal functions
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  // loadFavlist()
};

// close modal
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// favlist function
const loadFavlist = () => {
  let temp = localStorage.getItem("hero");
  if (!temp) return;
  favArray = [];
  favArray = temp.split(",");
  favArray = [...new Set(favArray)];
  console.log(favArray);
  console.log(temp);

  favArray.forEach(async function (item) {
    const result = await fetch(
      `https://www.superheroapi.com/api.php/727054372039115/${item}`
    );

    // https://www.superheroapi.com/api.php/727054372039115/search/${searchText}
    const heroDetails = await result.json();
    // console.log(heroDetails)
    const divElem = document.createElement("div");
    divElem.classList.add("search-list-item");
    divElem.innerHTML = `
            <img src = "${
              heroDetails.image.url ? heroDetails.image.url : ""
            }" alt = "">
            <p data-id = "${heroDetails.id}">${heroDetails.name}</p>
            <button class = "modal-btn del-fav">delete</button>
             `;
    modal.insertAdjacentElement("beforeend", divElem);
  });
};

// event listeners
window.addEventListener("DOMContentLoaded", () => init());

// for each on all tabs
allTabsHead.forEach((singleTabHead) => {
  singleTabHead.addEventListener("click", () => {
    hideAllTabHead();
    activeTab = singleTabHead.dataset.id;
    showActiveTabHead();
    showActiveTabBody();
  });
});
// open modal
btnsOpenModal.addEventListener("click", openModal);

// close modal
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
const getInputValue = (event) => {
  event.preventDefault();
  let searchText = searchForm.search.value;
  fetchAllSuperHero(searchText);
};

// search form submission
searchForm.addEventListener("submit", getInputValue);

// api key => 727054372039115
const fetchAllSuperHero = async (searchText) => {
  let url = `https://www.superheroapi.com/api.php/727054372039115/search/${searchText}`;
  try {
    const response = await fetch(url);
    allData = await response.json();
    if (allData.response === "success") {
      // console.log(allData);
      showSearchList(allData.results);
    }
  } catch (error) {
    console.log(error);
  }
};

// show search list
const showSearchList = (data) => {
  searchList.innerHTML = "";
  data.forEach((dataItem) => {
    const divElem = document.createElement("div");
    divElem.classList.add("search-list-item");
    divElem.innerHTML = `
            <img src = "${
              dataItem.image.url ? dataItem.image.url : ""
            }" alt = "">
            <p data-id = "${dataItem.id}">${dataItem.name}</p>
        `;
    searchList.appendChild(divElem);
  });
};
// event listner on search form
searchForm.search.addEventListener("keyup", () => {
  if (searchForm.search.value.length > 1) {
    fetchAllSuperHero(searchForm.search.value);
  } else {
    searchList.innerHTML = "";
  }
});


// evenlistner on searchlist
searchList.addEventListener("click", (event) => {
  let searchId = event.target.dataset.id;
  singleData = allData.results.filter((singleData) => {
    return searchId === singleData.id;
  });
  showSuperheroDetails(singleData);
  searchList.innerHTML = "";
});


// function for show superhero details
const showSuperheroDetails = (data) => {
  document.querySelector(".app-body-content-thumbnail").innerHTML = `
        <img src = "${data[0].image.url}">
    `;
  document.querySelector(".app-body-content").id = data[0].id;
  document.querySelector(".name").textContent = data[0].name;

  document.querySelector(".powerstats").innerHTML = `
    <li>
        <div>
            <i class = "fa-solid fa-shield-halved"></i>
            <span>intelligence</span>
        </div>
        <span>${data[0].powerstats.intelligence}</span>
    </li>
    <li>
        <div>
            <i class = "fa-solid fa-shield-halved"></i>
            <span>strength</span>
        </div>
        <span>${data[0].powerstats.strength}</span>
    </li>
    <li>
        <div>
            <i class = "fa-solid fa-shield-halved"></i>
            <span>speed</span>
        </div>
        <span>${data[0].powerstats.speed}</span>
    </li>
    <li>
        <div>
            <i class = "fa-solid fa-shield-halved"></i>
            <span>durability</span>
        </div>
        <span>${data[0].powerstats.durability}</span>
    </li>
    <li>
        <div>
            <i class = "fa-solid fa-shield-halved"></i>
            <span>power</span>
        </div>
        <span>${data[0].powerstats.power}</span>
    </li>
    <li>
        <div>
            <i class = "fa-solid fa-shield-halved"></i>
            <span>combat</span>
        </div>
        <span>${data[0].powerstats.combat}</span>
    </li>
    `;

  document.querySelector(".biography").innerHTML = `
    <li>
        <span>full name</span>
        <span>${data[0].biography["full-name"]}</span>
    </li>
    <li>
        <span>alert-egos</span>
        <span>${data[0].biography["alter-egos"]}</span>
    </li>
    <li>
        <span>aliases</span>
        <span>${data[0].biography["aliases"]}</span>
    </li>
    <li>
        <span>place-of-birth</span>
        <span>${data[0].biography["place-of-birth"]}</span>
    </li>
    <li>
        <span>first-apperance</span>
        <span>${data[0].biography["first-appearance"]}</span>
    </li>
    <li>
        <span>publisher</span>
        <span>${data[0].biography["publisher"]}</span>
    </li>
    `;

  document.querySelector(".appearance").innerHTML = `
    <li>
        <span>
            <i class = "fas fa-star"></i> gender
        </span>
        <span>${data[0].appearance["gender"]}</span>
    </li>
    <li>
        <span>
            <i class = "fas fa-star"></i> race
        </span>
        <span>${data[0].appearance["race"]}</span>
    </li>
    <li>
        <span>
            <i class = "fas fa-star"></i> height
        </span>
        <span>${data[0].appearance["height"][0]}</span>
    </li>
    <li>
        <span>
            <i class = "fas fa-star"></i> weight
        </span>
        <span>${data[0].appearance["weight"][0]}</span>
    </li>
    <li>
        <span>
            <i class = "fas fa-star"></i> eye-color
        </span>
        <span>${data[0].appearance["eye-color"]}</span>
    </li>
    <li>
        <span>
            <i class = "fas fa-star"></i> hair-color
        </span>
        <span>${data[0].appearance["hair-color"]}</span>
    </li>
    `;

  document.querySelector(".connections").innerHTML = `
    <li>
        <span>group--affiliation</span>
        <span>${data[0].connections["group-affiliation"]}</span>
    </li>
    <li>
        <span>relatives</span>
        <span>${data[0].connections["relatives"]}</span>
    </li>
    `;
};
const alert = document.querySelector(".alert");
const heart = document.querySelector(".fa-heart");
const favBtn = document.querySelector(".fav-btn");

// eventlistner on favourite button
favBtn.addEventListener("click", (e) => {
  heart.style.color = "red";
  alert.textContent = "added to favourites";
  alert.classList.add("sucess");
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove("sucess");
    heart.style.color = "white";
  }, 2000);
  // if (favAdded) return
  let temp = localStorage.getItem("movie");
  // console.log(temp);
  if (temp) {
    favArray = temp.split(",");
  }
  favArray = [...new Set(favArray)];
  console.log(singleData);
  if (favArray.includes(singleData[0].id)) return;
  const divElem = document.createElement("div");
  divElem.classList.add("search-list-item");
  // divElem.setAttribute('data-id', singleData[0].id)
  divElem.innerHTML = `
            <img src = "${
              singleData[0].image.url ? singleData[0].image.url : ""
            }" alt = "">
            <p data-id = "${singleData[0].id}">${singleData[0].name}</p>
            <button class = "modal-btn del-fav">delete</button>
             `;
  modal.insertAdjacentElement("beforeend", divElem);
  // favAdded = true
  favArray.push(singleData[0].id);

  favArray = [...new Set(favArray)];
  store = favArray.toString();
  // console.log(favArray);
  localStorage.setItem("hero", store);
});

//     modal list items event handlers
modal.addEventListener("click", async function (e) {
  if (e.target.closest(".search-list-item")) {
    const element = e.target.closest(".search-list-item");
    const id = element.children.item(1).dataset.id;
    if (e.target.classList.contains("del-fav")) {
      this.removeChild(element);
      favAdded = false;
      favArray.forEach(function (value, i) {
        if (value === id) {
          favArray.splice(i, 1);
        }
      });
      favArray = [...new Set(favArray)];
      console.log(favArray);
      let store = favArray.toString();
      localStorage.setItem("hero", store);
      if (!localStorage.getItem("hero")) {
        localStorage.clear();
      }
    } else {
      closeModal();
    }
  }
});
