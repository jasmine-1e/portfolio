console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );
let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/index.html', title: 'Projects' },
  // add the rest of your pages here
  { url: 'contact/index.html', title: 'Contact' },
  { url: 'https://github.com/jasmine-1e', title: 'Profile' },
  { url: 'resume/index.html', title: 'Resume' }
];

// if (currentLink) {
//  or if (currentLink !== undefined)
//   currentLink.classList.add('current'); }


// how u create a nav element  +
let nav = document.createElement('nav');
document.body.prepend(nav); //how u add it inside the body, at the beginning

/// to see if we r on home page w/ localhost or on github, 
// to adjust the base URL for all the links accordingly 
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";         // GitHub Pages repo name

//location.hostname gives domain of cirrent page 
//(so local/127.0.0.1 or gihuthub link)

/// to add the <a> elements + links inside the nav 
for (let p of pages) {
  let url = p.url;
  let title = p.title;
  // Create link and add it to nav
  // 


 // counld also do this in one line but idk what it mens 
 // url = !url.startsWith('http') ? BASE_PATH + url : url;
  if (!url.startsWith('http')) {
  url = BASE_PATH + url;
}
  //nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);

  if (a.host === location.host && a.pathname === location.pathname) {
  a.classList.add('current');
}
  if (a.host !== location.host) {
    a.target = "_blank"
  }

}


document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:  
        <select>
			<option value="light">Light</option>
            <option value="dark">Dark</option>  
            <option value="light dark">Auto</option>  
		</select>
	</label>`,
    
    
);

const select = document.querySelector('select');



select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value ; 

  if (localStorage.colorScheme == 'light dark') {
    document.documentElement.style.setProperty('color-scheme', 'light dark');
    select.value = 'light dark'; 
  }
  if (localStorage.colorScheme == 'light') {
    document.documentElement.style.setProperty('color-scheme', 'light');
    select.value = 'light'; 
    }
  if (localStorage.colorScheme == 'dark') {
    document.documentElement.style.setProperty('color-scheme', 'dark');
    select.value = 'dark';
    }
});

if ("colorScheme" in localStorage) {
  select.value = localStorage.colorScheme;
  select.dispatchEvent(new Event('input')); 
}



const form = document.querySelector('form');

form?.addEventListener('submit', function (event) {
  event.preventDefault();

  let data = new FormData(form);
  
  let url = form.action + '?';
  let params = [];

  for (let [name, value] of data) {
    params.push(name + '=' + encodeURIComponent(value));
    console.log(name, encodeURIComponent(value));
  }
  url += params.join('&');
  location.href = url;
});