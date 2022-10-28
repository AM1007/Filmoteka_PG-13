import { refs } from "./refs"
import TmDbApi from "./services/fetchApi"

// fetchApi for movieDetail
const Api = new TmDbApi()

async function render(id) {
    try {
        const filmResponse = await Api.fetchMovieDetail(id)
        renderMovie(filmResponse)
    } catch (error) {
        console.log(error)
    }
}

// Це для накидування лістенерів для закриття модалки:

function modalCloser() {
    const backgroundClose = (event) => {
        if (event.target == event.currentTarget) {
            document.body.classList.toggle("modal-on")
            refs.modalClose.removeEventListener("click", crossClose)
            window.removeEventListener("keydown", modalEsc)
            refs.modalBackground.removeEventListener("click", backgroundClose)
        }
    }

    const crossClose = (event) => {
        document.body.classList.toggle("modal-on")
        refs.modalBackground.removeEventListener("click", backgroundClose)
        window.removeEventListener("keydown", modalEsc)
        refs.modalClose.removeEventListener("click", crossClose)
    }

    const modalEsc = (event) => {
        if (event.key === "Escape") {
            if (document.body.classList.contains("modal-on")) {
                document.body.classList.toggle("modal-on")
                refs.modalBackground.removeEventListener("click", backgroundClose)
                refs.modalClose.removeEventListener("click", crossClose)
                window.removeEventListener("keydown", modalEsc)
            }
        }
    }

    refs.modalBackground.addEventListener("click", backgroundClose)

    refs.modalClose.addEventListener("click", crossClose)

    window.addEventListener("keydown", modalEsc)
}

// Накидує на картки лістенери для модалки:

export function modalListener() {
    const modalOpener = (event) => {
        let dataSource = event.currentTarget.dataset.id
        render(dataSource)
        renderMovie(dataSource)

        document.body.classList.toggle("modal-on")

        // Modal population function goes here. Don't forget the spinner.
        console.log("link to id for modal" + dataSource)
        modalCloser()
    }

    refs.galleryCards = document.querySelectorAll(".gallery__card")

    refs.galleryCards.forEach((element) => {
        element.addEventListener("click", modalOpener)
    })
}

const modalPoster = document.querySelector(".modal__poster")

function renderMovie(response) {
    console.log(response)
    const { title, vote_average, vote_count, poster_path, popularity, original_title, overview } = response

    console.log(poster_path)

    // const allGenres = genres.map((genre) => genre.name).join(", ")
    // console.log(allGenres)

    const markupMovie = /*html*/ `<div class="overlay">
    <div class="modal">
      <button type="button" class="modal__close"></button>
      <div class="modal__content">
        <div class="modal__media">
        <img src="" alt="Movie poster" class="modal__poster" />
        </div>
        <div class="modal__details">
          <h2 class="modal__title">${title}</h2>
          <ul class="modal__stats">
            <li class="modal__votes">
              <span class="data">Vote / Votes</span>
              <div class="value value__votes">
                <div class="rating">9.5</div>
                <div class="data separator">/</div>
                <div class="rating rating__votes">9001</div>
              </div>
            </li>
            <li class="modal__popularity">
              <span class="data">${popularity}</span>
              <span class="value">1488</span>
            </li>
            <li class="modal__original">
              <span class="data">Original Title</span>
              <span class="value value__title">Text</span>
            </li>
            <li class="modal__genre">
              <span class="data">Documentary</span>
              
            </li>
          </ul>
          <div class="modal__description">
            <p>ABOUT</p>
            <p class="modal__text">
              Little is known about the majority of the Emperor's life; of who he
              was and what he did before he emerged as the great Emperor of
              Mankind, only the Emperor himself remembers. The man who would later
              become known as the Emperor started out humbly - peacefully serving
              as sixth President of Ukraine. But one cold February morning
              everything changed... This is a story of his ascension to Godhood.
              Ave Imperator, morituri te salutant!
            </p>
          </div>
          <div class="modal__buttons">
            <button type="button" class="button modal__watch">
              add to Watched
            </button>
            <button type="button" class="button modal__queue">
              add to queue
            </button>
          </div>
        </div>
      </div>
      <div class="modal__spinner">
        <img src="./img/loading.gif" alt="Loading. Please wait." />
      </div>
    </div>
  </div>
  `
    return (modalPoster.textContent = `https://image.tmdb.org/t/p/w300/3zXceNTtyj5FLjwQXuPvLYK5YYL.jpg`)
}
// <span class="value">${allGenres}</span>

// Для сету постера
// ${setPosters(poster_path)}
function setPosters(poster) {
    if (poster === null) {
        return "https://wipfilms.net/wp-content/data/posters/tt0338683.jpg"
    }

    return `https://image.tmdb.org/t/p/w300${poster_path}`
}
