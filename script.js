'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
//smooth scrolling
btnScrollTo.addEventListener('click', function(e){
  //old pattern
  //getting the cordinates
  //this is section 1 cordinates
  const s1Coords = section1.getBoundingClientRect();
  console.log(s1Coords); 
  //this is the btn coordinate
  console.log(e.target.getBoundingClientRect()); 
 //scroll cordinate
 console.log('current scroll (x/y)', 
 window.pageXOffset, window.pageYOffset);
  //viewport coordinates
  console.log('height/width viewport', 
  document.documentElement.clientHeight,
  document.documentElement.clientWidth);

  //to implement the scroll
  // window.scrollTo(s1Coords.left, s1Coords.top)
  // the above is not perfect, to perfect it
  // window.scrollTo(s1Coords.left + window.pageXOffset,
  //    s1Coords.top + window.pageYOffset);
    //to add smooth scrolling
    // window.scrollTo({
    //   left: s1Coords.left + window.pageXOffset,
    //   top: s1Coords.top + window.pageYOffset,
    //   behavior: 'smooth',
    // });


    //new pattern
    section1.scrollIntoView({behavior: 'smooth'});
});

//event delegation
//page navigation----- event delegation 
/*
document.querySelectorAll('.nav__link').forEach(function(el){
  el.addEventListener('click', function(e){
    e.preventDefault();
    const id = this.getAttribute('href')
    console.log(id);
    // const ids = this.href;
    // console.log(ids);

    document.querySelector(id).scrollIntoView({
      behavior: 'smooth'
    });
  }); 
}); */
//to prevent generating this code on each click//to boost perfomance
//we select th container of all links
document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();
  // console.log(e.target);
  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({behavior: 'smooth'})
  }
});

//TABBED COMPONENT

//lets use event delegation
tabContainer.addEventListener('click', function(e){
  // console.log('working');
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);
  //guard clause
  if (!clicked) return;
  //remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabContent.forEach(c => c.classList.remove('operations__content--active'));
  //activate tab
  clicked.classList.add('operations__tab--active');
  //activate content
  // console.log(clicked.dataset.tab);
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

//MENU FADING ANIMATION

/*
nav.addEventListener('mouseover', function(e){
  // console.log(e.target);
  if (e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // console.log(siblings);
    // const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link ) el.style.opacity = 0.5;
    });
    // logo.style.opacity = 0.5;
  }
})
nav.addEventListener('mouseout', function(e){
  if (e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // console.log(siblings);
    // const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link ) el.style.opacity = 1;
    });
    // logo.style.opacity = 1;
  }
}); */
//lets refactor
// const handlerHover = function(e, opacity){
const handlerHover = function(e){
  if (e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // console.log(siblings);
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      // if (el !== link ) el.style.opacity = opacity;
      if (el !== link ) el.style.opacity = this;
    });
    // logo.style.opacity = opacity;
    logo.style.opacity = this;
  }
};
// nav.addEventListener('mouseover', function(e){
//   handlerHover(e, 0.5);
// });
// nav.addEventListener('mouseout', function(e){
//   handlerHover(e, 1);
// });
nav.addEventListener('mouseover', handlerHover.bind(0.5));
nav.addEventListener('mouseout', handlerHover.bind(1));

//IMPLEMENT STICKY NAVIGATION
//using scroll event
/*
const initialcoords = section1.getBoundingClientRect();
console.log(initialcoords);
window.addEventListener('scroll', function(){
  console.log(this.window.scrollY);
  if(this.window.scrollY > initialcoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky')
}); */
//using intersection observer api

//for practice
// const obsCallBack = function(entries, observer){
//   entries.forEach(entry => {console.log(entry);})
// };
// const obsOption = { root: null, threshold:[0, 0.2]};
// const observer = new IntersectionObserver(obsCallBack, obsOption);
// observer.observe(section1);
//main observer api
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);
const stickyNav = function(entries){
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky')
  else nav.classList.remove('sticky')
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function(entries, observer){
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //replacing src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-100px', //200px..loads 200px before it appears on screen
});
imgTargets.forEach(img => imgObserver.observe(img))

//slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let curSlide = 0;
const maxSlide = slides.length;
//for practice
// const slider = document.querySelector('.slider');
// slider.style.transform = `scale(0.3) translateX(-600px)`;
// slider.style.overflow = 'visible';

const goToSlide = function(slide){
  slides.forEach((s,i) => s.style.transform =
     `translateX(${100 * (i - slide)}%`);
}
goToSlide(0);
//next slide button
const nextSlide = function(){
  if (curSlide === maxSlide - 1){
    curSlide = 0;
  }else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDots(curSlide);
};
btnRight.addEventListener('click', nextSlide);
//prev slide
const prevSlide = function(){
  if (curSlide === 0){
    curSlide = maxSlide - 1;
  }else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDots(curSlide);
};
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
//keyboard event---arrow keys
document.addEventListener('keydown', function(e){
  console.log(e);
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});
//dots in slider
const dotContainer = document.querySelector('.dots');
const createDots = function(){
  slides.forEach(function(_,i){
    dotContainer.insertAdjacentHTML('beforeend', 
    `<button class="dots__dot" data-slide="${i}"></button>`)
  });
};
createDots();

//functional dots--can move the slide
dotContainer.addEventListener('click', function(e){
  if (e.target.classList.contains('dots__dot')) {
    const {slide} = e.target.dataset;
    goToSlide(slide);
    activateDots(slide);
  }
});
//highlight dots
const activateDots = function(slide){
  //remove
  document.querySelectorAll('.dots__dot').forEach
  (dot => dot.classList.remove('dots__dot--active'));
  //add
  document.querySelector(`.dots__dot[data-slide="${slide}"]`)
  .classList.add('dots__dot--active');
};
activateDots(0);
/////////////////////////////////////////////////////////
/*
/////////////////////////////////////////////////////////
//seleccting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section-1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons); //we get htmlcollection

console.log(document.getElementsByClassName('btn'));

//creating and inserting elements
//revise .inserAdjacentHTML
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 
// 'we use cookies for improved functionalities and Analytics';
message.innerHTML = `we use cookies for improved functionalities and Analytics. 
<button class="btn btn--close-cookie"> Got it! </button>`;
// header.prepend(message); //like first child within the section
header.append(message); //more like last child, within the section
//to appear in multiple places
// header.append(message.cloneNode(true));
// header.before(message);
// header.after(message);

//deleting element
document.querySelector('.btn--close-cookie').addEventListener
('click', function(){
  message.remove();
  //old style
  // message.parentElement.removeChild(message);
});

//changing styles
message.style.backgroundColor = '#37383d';
message.style.width = '100%';
//we can only see the inline style we wrote
console.log(message.style.color);
console.log(message.style.backgroundColor);
//letrs get the written css of a specified element
console.log(getComputedStyle(message));
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);
//increasing message box height
message.style.height = Number.parseFloat
(getComputedStyle(message).height, 10) + 20 + 'px'; 
console.log(message.style.height);
//lets change css custom variables
//since they are written on root, we access them on root
document.documentElement.style.setProperty('--color-primary', 'orangered');

//attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.src);
console.log(logo.alt);
console.log(logo.className);
//we can change their value
logo.alt = 'beautiful logo'
//or access non standard attributes
//we add a customised attr and access it from here
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
//to set or add attr by ourself
logo.setAttribute('company', 'Bankist');
//for src
console.log(logo.src);
console.log(logo.getAttribute('src')); //note d difference
//links
const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));
//data attributes ---all attr starting with data
console.log(logo.dataset.versionNumber);

//classes
logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c'); //not includes as in arrays
//don't
// logo.className = 'Jonas'

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////


//other eventhandlers ---mouseenter
const h1 = document.querySelector('h1');
// h1.addEventListener('mouseenter', function(e){
//   alert('this is h1')
// });
// h1.onmouseenter = function(e){
//   alert('old style')
// };

//removing event handlers
//lets export the function
const alerth1 = function(e){
  alert('this is h1');
  //removing event listener 
  // h1.removeEventListener('mouseenter', alerth1)
};
h1.addEventListener('mouseenter', alerth1);
//lets remove the event after some time
setTimeout(()=> h1.removeEventListener
('mouseenter', alerth1), 1000);

//html attribute
//in html tag write onclick="alert("html");

//event propagation ---bubbling
//lets make the heading links show diff colors on click
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// console.log(randomInt(0, 255));
const randomColor = ()=> `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  //to stop propagation
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor();
  console.log('container', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor();
  console.log('largest', e.target, e.currentTarget);
});


//dom traversing
const h1 = document.querySelector('h1');
//going downwards
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = '#fff';
h1.lastElementChild.style.color = '#000';
//going upwards
console.log(h1.parentNode);
console.log(h1.parentElement);
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--color-tertiary)';
//going sideways
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
console.log(h1.previousSibling);
console.log(h1.nextSibling);
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function(el){
  console.log(el);
  if (el !== h1) el.style.transform = 'scale(0.7)'
})
*/

//lifecycle of dom events
//domcontentloaded
document.addEventListener('DOMContentLoaded', function(e){
  console.log('HTML parsed and DOM tree built', e);
});
//load
window.addEventListener('load', function(e){
  console.log('Page fully loaded', e);
});

//beforeunload----
// window.addEventListener('beforeunload', function(e){
//   e.preventDefault();
//   console.log('bye', e);
//   this.alert('wanna leave??');
//   e.returnValue = '';
// });
