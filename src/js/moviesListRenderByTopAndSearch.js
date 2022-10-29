import TmDbApi from "./services/fetchApi";
import genres from "./services/genres";
import { modalListener } from "./modal";
const Api = new TmDbApi();
export const defaultPoster =
  "https://tn.fishki.net/26/upload/post/2018/04/20/2577020/afrikanskie-postery-k-gollivudskim-blokbasteram-6.jpg";

export const moviesListRenderByTopAndSearch = {
  movieList: document.querySelector(".gallery"),
  paginationControlBtns: document.querySelectorAll(".js_pagination--btn"),
  searchForm: document.querySelector(".js-search__form"),
  searchWarning: document.querySelector(".search__warning"),
  logo: document.querySelector(".navigation__logo"),
  navigationHomeBtn: document.querySelector(".navigation__home"),
  options: {
    query: "",
    page: 1,
    totalPages: null,
  },
  onSearchForm(event) {
    event.preventDefault();
    const { options } = this;
    const currentQuery = this.options.query;
    const form = event.currentTarget;
    const searchQuery = form.elements.searchQuery.value;
    if (searchQuery === currentQuery || searchQuery === "") {
      this.searchWarning.classList.remove("hidden");
      form.reset();
      return;
    }
    options.query = searchQuery;
    options.page = 1;
    form.reset();

    this.render();
  },
  changePage(event) {
    const action = event.currentTarget.dataset.page;
    const { options } = this;
    if (action === "prev" && this.options.page > 1) {
      options.page -= 1;

      this.render();
    } else if (
      action === "next" &&
      this.options.page < this.options.totalPages
    ) {
      options.page += 1;

      this.render();
    }
  },
  async render() {
    const { options } = this;
    const { page, query } = this.options;

    if (query) {
      try {
        const filmResponse = await Api.fetchSearchMovies(query, page);
        options.totalPages = filmResponse.total_pages;
        const films = filmResponse.results;
        if (films.length === 0) {
          this.searchWarning.classList.remove("hidden");
        } else {
          this.searchWarning.classList.add("hidden");
        }
        this.createMarkUp(this.preparingForMarkUp(films));
      } catch (error) {
        console.log(error, `Попробуйте перезагрузить страницу`);
      }
    } else {
      try {
        const filmResponse = await Api.fetchTrendingMovies(page);
        options.totalPages = filmResponse.total_pages;

        const films = filmResponse.results;
        this.createMarkUp(this.preparingForMarkUp(films));
      } catch (error) {
        console.log(error, `Попробуйте перезагрузить страницу`);
      }
    }
  },
  preparingForMarkUp(films) {
    return films.map(
      ({ id, title, poster_path, vote_average, release_date, genre_ids }) => ({
        id,
        title,
        poster_path: poster_path
          ? "https://image.tmdb.org/t/p/w500" + poster_path
          : defaultPoster,
        vote_average,
        release_date: release_date ? release_date.split("-") : "`2000",
        genre_ids: this.calculatingGenres(genre_ids),
      })
    );
  },

  createMarkUp(preparedMovies) {
    const { movieList } = this;
    const moviesMarkUp = preparedMovies
      .map(
        ({ id, title, poster_path, vote_average, release_date, genre_ids }) => {
          return `<li class="gallery__card" data-id=${id}>
          <img
            src=${poster_path}
            data-source=${poster_path}
            data-page="homepage"
            alt=${title}
            class="gallery__image"
          />
          <div class="gallery__data">
            <div class="gallery__name">Servant of the People</div>
            <div class="gallery__stats">
              <p class="gallery__details">${genre_ids.join(", ")} | ${
            release_date[0]
          }</p>
         
              <p class="gallery__rating">${vote_average.toFixed(1)}</p>
            </div>
          </div>
        </li>
    `;
        }
      )
      .join("");
    movieList.innerHTML = "";
    movieList.insertAdjacentHTML("beforeend", moviesMarkUp);
    modalListener();
  },
  calculatingGenres(genre_ids) {
    const sortGenres = genres
      .filter((genre) => {
        for (const id of genre_ids) {
          if (id === genre.id) {
            return genre;
          }
        }
      })
      .map((genre) => genre.name);
    if (sortGenres.length > 2) {
      return [...sortGenres.slice(0, 2), "Other"];
    } else {
      return sortGenres;
    }
  },
};

// moviesListRenderByTopAndSearch.render();

moviesListRenderByTopAndSearch.paginationControlBtns.forEach((el) =>
  el.addEventListener(
    "click",
    moviesListRenderByTopAndSearch.changePage.bind(
      moviesListRenderByTopAndSearch
    )
  )
);

moviesListRenderByTopAndSearch.searchForm.addEventListener(
  "submit",
  moviesListRenderByTopAndSearch.onSearchForm.bind(
    moviesListRenderByTopAndSearch
  )
);

moviesListRenderByTopAndSearch.logo.addEventListener("click", () => {
  moviesListRenderByTopAndSearch.options.query = "";
  moviesListRenderByTopAndSearch.options.page = 1;
  moviesListRenderByTopAndSearch.render();
});

moviesListRenderByTopAndSearch.navigationHomeBtn.addEventListener(`click`, () =>
  moviesListRenderByTopAndSearch.render()
);
