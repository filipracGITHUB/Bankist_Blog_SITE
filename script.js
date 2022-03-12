'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);
const section2 = document.querySelector(`#section--2`);
const section3 = document.querySelector(`#section--3`);
const section4 = document.querySelector(`#section--4`);
const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabsContent = document.querySelectorAll(`.operations__content`);
const nav = document.querySelector(`.nav`);
const header = document.querySelector(`.header`);

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener(`click`, openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener(`click`, () => {
  // const s1coords = section1.getBoundingClientRect();
  // // console.log(e.target.getBoundingClientRect());
  // // console.log(`Current scroll (X/Y)`, window.pageXOffset, window.pageYOffset);
  // // // checking the size of the clients screen atm
  // // console.log(
  // //   `height ${document.documentElement.clientHeight} :: width ${document.documentElement.clientWidth}`
  // // );

  //scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // oldschool way
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: `smooth`,
  // });

  //modernway
  section1.scrollIntoView({ behavior: `smooth` });
});
////////////////////////////////////////////////////
// tabbed part

nav.addEventListener(`mouseover`, e => {
  if (e.target.classList.contains(`nav__link`)) {
    const link = e.target;
    const siblings = link.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = link.closest(`.nav`).querySelector(`img`);
    link.style.opacity = 1;

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = 0.5;
    });

    logo.style.opacity = 0.5;
  }
});

nav.addEventListener(`mouseout`, e => {
  if (e.target.classList.contains(`nav__link`)) {
    const link = e.target;
    const siblings = link.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = link.closest(`.nav`).querySelector(`img`);

    siblings.forEach(e => {
      e.style.opacity = 1;
    });
    logo.style.opacity = 1;
  }
});

tabsContainer.addEventListener(`click`, e => {
  const clicked = e.target.closest(`.operations__tab`);

  // guard clause if statement that will return early if some condition is matched
  if (!clicked) return;

  // disable active
  tabsContent.forEach(t => t.classList.remove(`operations__content--active`));
  // ACTIVE TAB
  tabs.forEach(t => t.classList.remove(`operations__tab--active`));
  clicked.classList.add(`operations__tab--active`);
  // ACTIVATE CONTENT AREA
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});
/////////////////////////////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll(`.section`);

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove(`section--hidden`);
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add(`section--hidden`);
});
//////////////////////////////////////////////////////////////////////////
// LAZY LOADING IMAGES
const imgTarget = document.querySelectorAll(`img[data-src]`);

const loadImg = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  // entry.target.classList.remove(`lazy-img`);
  entry.target.addEventListener(`load`, () => {
    entry.target.classList.remove(`lazy-img`);
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.8,
  rootMargin: `200px`,
});

imgTarget.forEach(img => imgObserver.observe(img));
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// Slider component

const btnLeft = document.querySelector(`.slider__btn--left`);
const btnRight = document.querySelector(`.slider__btn--right`);
const slides = document.querySelectorAll(`.slide`);
let curSlide = 0;
const maxSlide = slides.length;
const slider = document.querySelector(`.slider`);
slider.style.overflow = `hidden`;
const dotContainer = document.querySelector(`.dots`);

// FUNCTIONS
const goToSlide = slide => {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const createDots = () => {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      `beforeend`,
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = slide => {
  document.querySelectorAll(`.dots__dot`).forEach(dot => {
    dot.classList.remove(`dots__dot--active`);
  });

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add(`dots__dot--active`);
};

const nextSlide = () => {
  if (curSlide == maxSlide - 1) curSlide = 0;
  else curSlide++;

  goToSlide(curSlide);
  activateDot(curSlide);
};
const prevSlide = () => {
  if (curSlide === 0) curSlide = maxSlide - 1;
  else curSlide--;

  goToSlide(curSlide);
  activateDot(curSlide);
};
const init = () => {
  goToSlide(0);
  createDots();
  activateDot(0);
};
init();
// Event handlers
btnRight.addEventListener(`click`, nextSlide);
btnLeft.addEventListener(`click`, prevSlide);

document.addEventListener(`keydown`, e => {
  if (e.key === `ArrowLeft`) prevSlide();
  e.key === `ArrowRight` && nextSlide();
});

dotContainer.addEventListener(`click`, e => {
  if (e.target.classList.contains(`dots__dot`)) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});

// 0%, 100%, 200%, 300%
// Sticky navigation
// const intCords = section1.getBoundingClientRect();
// console.log(intCords);

// // very not optimised
// window.addEventListener(`scroll`, () => {
//   console.log(window.scrollY);
//   if (window.scrollY > intCords.top) nav.classList.add(`sticky`);
//   else nav.classList.remove(`sticky`);
// });
// Sticky navigation: Intersection Observer API
// const obsCB = (entries, observer) => {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: [0, 1, 0.2],
// };

// const observer = new IntersectionObserver(obsCB, obsOptions);
// observer.observe(section1);
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add(`sticky`);
  else nav.classList.remove(`sticky`);
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////////////////////////////////
///////////////// navigation menu fading

//////////////////////////////////////
// Page navigation

// document.querySelectorAll(`.nav__links`).forEach(el => {
//   el.addEventListener(`click`, e => {
//     e.preventDefault();
//     const id = this.getAttribute(`href`);
//     console.log(id);
//     // id.scrollIntoView({ behavior: `smooth` });
//   });
// });

// 1. Add event listener to common parent element
// 2. Determine what elemnt originated the event
document.querySelector(`.nav__links`).addEventListener(`click`, e => {
  //e.scrollIntoView({ behavior: `smooth` });
  e.preventDefault();
  const id = e.target.getAttribute(`href`);
  document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  // Matching strategy
  if (e.target.classList.contains(`nav__link`)) {
  }
});

document.addEventListener(`DOMContentLoaded`, function (e) {
  console.log(`HTML PARSED AND DOM TREE BUILD`, e);
});

// document.querySelectorAll(`.section`);

// const allSections = document.querySelectorAll(`.section`);

// // console.log(allSections);

// document.getElementById(`section--1`);
// const allButtons = document.getElementsByTagName(`button`);
// // console.log(allButtons);
// document.getElementsByClassName(`btn`);

// Creating and inserting elemnts

//.insertAdjacentHTML()

// const message = document.createElement(`div`);
// message.classList.add(`cookie-message`);
// message.textContent = `We use cookies for improved functionallity and analytics.`;
// message.innerHTML = `We use cookies for improved functionallity and analytics. <button class="btn btn--close-cookie">Got it!</button>`;

// //header.prepend(message);
// header.append(message);
// //header.append(message.cloneNode(true));

// // Delete elements

// document
//   .querySelector(`.btn--close-cookie`)
//   .addEventListener(`click`, function () {
//     message.remove();
//   });

// // Styles
// message.style.backgroundColor = `#37383d`;
// message.style.width = '103.3%';

// // getting info on styles (color)

// // console.log(message.style.backgroundColor);
// // console.log(getComputedStyle(message).color);
// // console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + `px`;

// atributes
// const logo = document.querySelector(`.nav__logo`);
// console.log(logo.alt);

// console.log(logo.className);

// logo.alt = `Beautiful minimalist logo`;

// // non-standard
// console.log(logo.designer);
// console.log(logo.getAttribute(`designer`));

// console.log(logo.src);
// console.log(logo.getAttribute(`src`));

// const link = document.querySelector(`.nav__link--btn`);

// console.log(link.href);
// console.log(link.getAttribute(`href`));

// // Data attributes
// console.log(logo.dataset.versionNumber);

//Classes
// logo.classList.add(`c`);
// logo.classList.remove(`c`);
// logo.classList.toggle(`c`);
// logo.classList.contains(`c`);

// DONT USE IT OVERRIDES ALL CLASSES
// logo.className = `jonas`;
/// ----- BANKIST SITE----

// // Selectiong elements
// console.log(document.documentElement);
// console.log(document.body);
// console.log(document.head);

// const h1 = document.querySelector(`h1`);

// const alertH1 = function (e) {
//   alert(`blabla`);
//   h1.removeEventListener(`mouseenter`, alertH1);
// };
// h1.addEventListener(`mouseenter`, alertH1);

// // old school
// // h1.onmouseenter = function (e) {
// //   alert(`blabla`);
// // };

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector(`.nav__link`).addEventListener(`click`, function (e) {
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector(`.nav`).addEventListener(`click`, function (e) {
//   this.style.backgroundColor = randomColor();
// });
////////////////////////////////////////////////////////////////
///////// ---------------- DOM TRAVERSING ---------------------------------

// const h1 = document.querySelector(`h1`);

// // Going downards: child elements
// console.log(h1.querySelectorAll(`.highlight`));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = `white`;
// h1.lastElementChild.style.color = `orangered`;

// // Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// // its same as queryselector but it finds PARENT elements
// h1.closest(`.header`).style.background = `var(--gradient-secondary)`;

// h1.closest(`h1`).style.background = `var(--gradient-primary)`;

// // Going sideways : siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(el => {
//   if (el !== h1) el.style.transform = `scale(0.5)`;
// });
