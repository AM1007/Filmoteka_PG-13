import { refs } from "./js/refs";
import {
  carouselListener,
  carouselResizing,
  carouselRender,
} from "./js/carousel";

// Initial gallery population function goes here

modalListener();

refs.logo.addEventListener("click", (event) => {
  event.preventDefault();
  document.body.className = "home watched";

  //Gallery population function for this page goes here

  console.log("Populating Home page");
});

refs.homeButton.addEventListener("click", (event) => {
  event.preventDefault();
  document.body.classList.replace("library", "home");

  //Gallery population function for this page goes here

  console.log("Populating Home page");
});

refs.libraryButton.addEventListener("click", (event) => {
  event.preventDefault();
  document.body.classList.replace("home", "library");

  //Gallery population function for this page goes here

  console.log("Populating Library Watched page");
});

refs.watchedButton.addEventListener("click", () => {
  document.body.classList.replace("queue", "watched");

  //Gallery population function for this page goes here

  console.log("Populating Library Watched page");
});

refs.queueButton.addEventListener("click", () => {
  document.body.classList.replace("watched", "queue");

  //Gallery population function for this page goes here

  console.log("Populating Library Queue page");
});

function modalListener() {
  const modalOpener = (event) => {
    dataSource = event.currentTarget.querySelector("img").dataset.page;
    document.body.classList.toggle("modal-on");

    // Modal population function goes here. Don't forget the spinner.

    console.log("Get your link to data for modal here: " + dataSource);
    modalCloser();
  };

  refs.galleryCards = document.querySelectorAll(".gallery__card");

  refs.galleryCards.forEach(
    (element) => {
      element.addEventListener("click", modalOpener);
    }

    // For reasons unfathomable (array change?) JS doesn't want to remove event
    // listeners through the same algorithm. It is not crucial as the cards will be
    // loaded anew with each page change and will loose all their event listeners
    // and observers. If it really is that important you can use this simple trick:
    // element.replaceWith(element.cloneNode(true))
  );
}

// Honestly see no reason to remove Event Listeners
// They could be added at the start of the session
// and they would stay on for the remainder.
// My personal belief: adding and removing listeners
// is more taxing on CPu than just letting them stay on.
// But whatever. Here's the function:

function modalCloser() {
  const backgroundClose = (event) => {
    if (event.target == event.currentTarget) {
      document.body.classList.toggle("modal-on");
      refs.modalClose.removeEventListener("click", crossClose);
      window.removeEventListener("keydown", modalEsc);
      refs.modalBackground.removeEventListener("click", backgroundClose);
    }
  };

  const crossClose = (event) => {
    document.body.classList.toggle("modal-on");
    refs.modalBackground.removeEventListener("click", backgroundClose);
    window.removeEventListener("keydown", modalEsc);
    refs.modalClose.removeEventListener("click", crossClose);
  };

  const modalEsc = (event) => {
    if (event.key === "Escape") {
      if (document.body.classList.contains("modal-on")) {
        document.body.classList.toggle("modal-on");
        refs.modalBackground.removeEventListener("click", backgroundClose);
        refs.modalClose.removeEventListener("click", crossClose);
        window.removeEventListener("keydown", modalEsc);
      }
    }
  };

  refs.modalBackground.addEventListener("click", backgroundClose);

  refs.modalClose.addEventListener("click", crossClose);

  window.addEventListener("keydown", modalEsc);
}

// And here are modal button listeners that will stay on
// for the remainder of the session. And nothing bad will
// happen. I prefer this way better.

refs.modalWatch.addEventListener("click", () => {
  // Watch list update function goes here
  console.log("Adding to watch list");
});

refs.modalQueue.addEventListener("click", () => {
  // Queue update function goes here
  console.log("Adding to queue");
});

// Lazy load below. It currently doesn't work as Parcel works
// in mysterious ways. Will work with external image links though.
// Meanwhile the main script has been commented out.

function lazyLoad() {
  refs.galleryCards = document.querySelectorAll(".gallery__card");

  var firstItem = document.querySelector(".gallery__card");
  var itemGap = [
    ...document.defaultView.getComputedStyle(firstItem.parentElement).gap,
  ];
  itemGap = parseInt(`${itemGap[0]}${itemGap[1]}`);
  var itemSize = `${
    Math.ceil(firstItem.getBoundingClientRect().height) + itemGap
  }px`;

  const onEntry = (observerEntries) => {
    observerEntries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        // let source = target.firstElementChild.dataset.source;
        // target.firstElementChild.src = source;
      }
    });
  };

  const observerOptions = { root: null, rootMargin: itemSize };

  const observer = new IntersectionObserver(onEntry, observerOptions);

  refs.galleryCards.forEach((element) => {
    observer.unobserve(element);
    observer.observe(element);
  });
}

lazyLoad();

// Pages selector functions

carouselListener();

carouselResizing();

carouselRender(refs.pageCurrent, refs.pageMax);
