import { topMovieList } from "./js/topMovieList"
import { refs } from "./js/refs"
import { carouselListener, carouselResizing, carouselRender } from "./js/carousel"
import { upwardEl, scrollTop } from "./js/upward"

upwardEl()
scrollTop()

import { addToWatch } from "./js/library-list"

// Initial gallery population function goes here
topMovieList.render()

// Button and Modal listeners:

refs.logo.addEventListener("click", (event) => {
    event.preventDefault()
    document.body.className = "home watched"

    //Gallery population function for this page goes here
})

refs.homeButton.addEventListener("click", (event) => {
    event.preventDefault()
    document.body.classList.replace("library", "home")

    //Gallery population function for this page goes here
})

refs.libraryButton.addEventListener("click", (event) => {
    event.preventDefault()
    document.body.classList.replace("home", "library")

    //Gallery population function for this page goes here
})

refs.watchedButton.addEventListener("click", () => {
    document.body.classList.replace("queue", "watched")

    //Gallery population function for this page goes here
})

refs.queueButton.addEventListener("click", () => {
    document.body.classList.replace("watched", "queue")

    //Gallery population function for this page goes here
})

refs.modalWatch.addEventListener("click", () => {
    // Watch list update function goes here
})

refs.modalQueue.addEventListener("click", () => {
    // Queue update function goes here
})

// Pages selector functions

carouselListener()

carouselResizing()

carouselRender(refs.pageCurrent, refs.pageMax)

// Functions

// LazyLoad:

function lazyLoad() {
    refs.galleryCards = document.querySelectorAll(".gallery__card")

    var firstItem = document.querySelector(".gallery__card")

    var itemGap = [...document.defaultView.getComputedStyle(firstItem.parentElement).gap]
    itemGap = parseInt(`${itemGap[0]}${itemGap[1]}`)

    var itemSize = `${Math.ceil(firstItem.getBoundingClientRect().height) + itemGap}px`

    const onEntry = (observerEntries) => {
        observerEntries.forEach(({ target, isIntersecting }) => {
            if (isIntersecting) {
                let source = target.firstElementChild.dataset.source
                target.firstElementChild.src = source
            }
        })
    }

    const observerOptions = { root: null, rootMargin: itemSize }

    const observer = new IntersectionObserver(onEntry, observerOptions)

    refs.galleryCards.forEach((element) => {
        observer.unobserve(element)
        observer.observe(element)
    })
}

