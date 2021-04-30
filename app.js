let inputShorten = document.querySelector('#input-shorten');
let buttonShorten = document.querySelector('#button-shorten');
let help = document.querySelector('.help');
let shortenList = document.querySelector('#shorten-list')

buttonShorten.addEventListener('click', shortenSubmit);

function shortenSubmit(event){
  if(inputShorten.value === ''){
    inputShorten.classList.add('is-error');
    help.innerText = 'Please add a link';
    help.classList.add('error-message');
  } else{
    inputShorten.classList.remove('is-error');
    help.classList.remove('error-message');
    buttonShorten.classList.add('is-loading');
    sendShorten();
  }
}

function sendShorten(){
  fetch('https://api.shrtco.de/v2/shorten?url='+inputShorten.value)
  .then((response) => {
    return response.json();
  })
  .then((json) => {
    const shortLink = json.result.short_link;
    
    const link = {
      link: inputShorten.value,
      shortLink: shortLink
    }

    setLocalStorage(link);
    createBoxLink(inputShorten.value, shortLink);

    inputShorten.value = '';
    buttonShorten.classList.remove('is-loading');
  })
  .catch((error) => {
    console.log(error.message);
    help.innerText = 'Something went wrong. Please try again.';
    help.classList.add('error-message');
    buttonShorten.classList.remove('is-loading');
  });
}

function setLocalStorage(link){
  if (localStorage.getItem("links") === null) {
    const links = [];
    links.push(link)
    localStorage.setItem("links", JSON.stringify(links));
  } else{
    const stored = JSON.parse(localStorage.getItem("links"));
    stored.unshift(link);
    localStorage.setItem("links", JSON.stringify(stored));
  }
}

function createBoxLink(longLink, shortLink){
  //div box
  const box = document.createElement('div');
  box.classList.add('box','box-link');

  //div columns
  const columns = document.createElement('div');
  columns.classList.add('columns');

  //div column long link
  const column_long_link = document.createElement('div');
  column_long_link.classList.add('column','is-6','long-link');

  const text_long_link = document.createElement('span');
  text_long_link.innerText = longLink;
  column_long_link.append(text_long_link);

  //div column short link
  const column_short_link = document.createElement('div');
  column_short_link.classList.add('column','is-4','short-link');

  const text_short_link = document.createElement('span');
  text_short_link.innerText = 'https://'+shortLink;
  column_short_link.append(text_short_link);

  //div column button
  const column_button = document.createElement('div');
  column_button.classList.add('column','is-2','is-flex','is-align-items-center');

  const button_copy = document.createElement('button');
  button_copy.classList.add('button','button-primary');
  button_copy.addEventListener("click", copyShortLink);
  button_copy.addEventListener("mouseout", mouseOutCopyShortLink);
  button_copy.innerText = 'Copy';
  button_copy.value = 'https://'+shortLink;
  column_button.append(button_copy);

  //append
  box.append(columns);
  columns.append(column_long_link, column_short_link, column_button);
  shortenList.prepend(box);
}

function showBoxLink(){
  if (localStorage.getItem("links") !== null) {
    const links = JSON.parse(localStorage.getItem("links"));
    links.forEach((link) => {
      createBoxLink(link.link, link.shortLink);   
    });
  }
}

async function copyShortLink(event) {
  const shortLink = event.target;
  await navigator.clipboard.writeText(shortLink.value);

  shortLink.classList.add('button-copied');
  shortLink.innerText = 'Copied!';
}

function mouseOutCopyShortLink(event){
  const shortLink = event.target;
  shortLink.classList.remove('button-copied');
  shortLink.innerText = 'Copy';
}

document.addEventListener('DOMContentLoaded', () => {

    showBoxLink();

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
  
      // Add a click event on each of them
      $navbarBurgers.forEach( el => {
        el.addEventListener('click', () => {
  
          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);
  
          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
  
        });
      });
     }
   
});