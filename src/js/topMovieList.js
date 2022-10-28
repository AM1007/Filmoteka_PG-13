import TmDbApi from "./services/fetchApi";
import genres from "./services/genres";
import { modalListener } from "./modal";
const Api = new TmDbApi();

export const topMovieList = {
  movieList: document.querySelector(".gallery"),
  paginationControlBtns: document.querySelectorAll(".js_pagination--btn"),
  options: {
    page: 1,
    // per_page: 15,
  },
  changePage(event) {
    const action = event.currentTarget.dataset.page;
    const { options } = this;
    if (action === "prev" && this.options.page > 1) {
      options.page -= 1;
      this.render();
    } else if (action === "next") {
      options.page += 1;
      this.render();
    }
  },
  async render() {
    try {
      const filmResponse = await Api.fetchTrendingMovies(this.options.page);
      const films = filmResponse.results;
      this.createMarkUp(this.preparingForMarkUp(films));
    } catch (error) {
      console.log(error, `Попробуйте перезагрузить страницу`);
    }
  },
  preparingForMarkUp(films) {
    return films.map(
      ({ id, title, poster_path, vote_average, release_date, genre_ids }) => ({
        id,
        title,
        poster_path: "https://image.tmdb.org/t/p/w500" + poster_path,
        vote_average,
        release_date: release_date.split("-"),
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
    modalListener()
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

// topMovieList.render();

topMovieList.paginationControlBtns.forEach((el) =>
  el.addEventListener("click", topMovieList.changePage.bind(topMovieList))
);
