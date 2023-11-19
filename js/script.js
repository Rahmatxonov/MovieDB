const mainBox = document.querySelector(".mainBox");
const loading = document.querySelector(".loading");
const notFound = document.querySelector(".notFound");
const form = document.querySelector("form");
const searchInput = document.querySelector(".searchInput");
const searchButton = document.querySelector(".btn");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjQ3MGNhNzVlODg3ODdiZjYwYzBlOTA5MjY2ZTMxNiIsInN1YiI6IjY1NDllMDI5NDFhNTYxMzM2Yjc5MzdjNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._3eUo7jvZzj9dTTbfHJfaMDKJWOL2xz5h302XL_DLSA",
  },
};

const moviesUrl =
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=popularity.desc";

const searchUrl = "https://api.themoviedb.org/3/search/movie?query=";

async function getMovies(url) {
  try {
    const response = await fetch(url, options);
    // console.log(response);
    if (response.status !== 200) {
      console.log(`Response status error ${response.status}`);
    }
    const movies = await response.json();
    return movies;
  } catch (error) {
    console.error(error);
  }
}

const imgUrl = "https://image.tmdb.org/t/p/w500/";

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}

function showFullOverview(element) {
  const overview = element.querySelector(".moviesOverview");
  const fullText = overview.dataset.fullText;
  overview.textContent = fullText;
  const readMoreButton = element.querySelector(".readMore");
  readMoreButton.style.display = "none";
}

const pagination = document.querySelector(".pagination");
const preBtn = document.querySelector(".preBtn");
const nextBtn = document.querySelector(".nextBtn");

// let currentPage = 1;
// let totalPages = 0;

// const moviesUrl = fetch(
//   "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=popularity.desc"
// );

// moviesUrl.then(function (data) {
//   newData = data.slice(0, 500);
// });
function updatePaginationButtons() {
  preBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

function updatePaginationInfo() {
  pagination.textContent = `Page ${currentPage} of ${totalPages}`;
}

function renderMovies(data) {
  console.log(data);
  mainBox.innerHTML = "";
  let found = false;
  data.forEach((element) => {
    const { backdrop_path, original_title, title, vote_average, overview } =
      element;
    const fragment = new DocumentFragment();
    const card = document.createElement("div");
    card.classList.add("card");

    const image = document.createElement("img");
    image.classList.add("movieImage");
    image.src = `${imgUrl}${backdrop_path}`;
    image.alt = title;

    const moviesTitle = document.createElement("h2");
    moviesTitle.classList.add("moviesTitle");
    moviesTitle.textContent = original_title;

    const moviesOverview = document.createElement("p");
    moviesOverview.classList.add("moviesOverview");
    const truncatedOverview = truncateText(overview, 100);
    moviesOverview.textContent = truncatedOverview;
    moviesOverview.dataset.fullText = overview;

    const readMoreButton = document.createElement("button");
    readMoreButton.classList.add("readMore");
    readMoreButton.textContent = "Read More";
    readMoreButton.addEventListener("click", () => {
      showFullOverview(card);
    });

    const average = document.createElement("p");
    average.classList.add("average");
    average.textContent = vote_average;

    if (vote_average < 4) {
      average.style.color = "rgb(255, 0, 0)";
    } else if (vote_average >= 4 && vote_average <= 7.5) {
      average.style.color = "yellow";
    } else {
      average.style.color = "rgb(0, 255, 94)";
    }

    fragment.appendChild(image);
    fragment.appendChild(moviesTitle);
    fragment.appendChild(moviesOverview);
    fragment.appendChild(readMoreButton);
    fragment.appendChild(average);
    card.appendChild(fragment);
    mainBox.appendChild(card);
    found = true;

    // totalPages = data.total_pages;
    // updatePaginationButtons();
    // updatePaginationInfo();
  });

  //   preBtn.addEventListener("click", async () => {
  //     if (currentPage > 1) {
  //       currentPage--;
  //       const movies = await getMovies(`${moviesUrl} &page= ${currentPage}`);
  //       renderMovies(movies.results);
  //     }
  //   });

  //   nextBtn.addEventListener("click", async () => {
  //     if (currentPage < totalPages) {
  //       currentPage++;
  //       const movies = await getMovies(`${moviesUrl} &page=${currentPage}`);
  //       renderMovies(movies.results);
  //     }
  //   });

  window.scrollTo(0, 0);

  loading.style.display = "none";
  if (!found) {
    notFound.style.display = "block";
  } else {
    loading.style.display = "none";
    notFound.style.display = "none";
  }
}

getMovies(moviesUrl).then((data) => renderMovies(data.results));

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchValue = searchInput.value.trim().toLowerCase();
  const movies = await getMovies(`${searchUrl}${searchValue}`);
  renderMovies(movies.results);
  form.reset();
});
