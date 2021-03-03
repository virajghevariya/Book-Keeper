const modal =document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkContainer = document.getElementById('bookmarks-container');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarkForm = document.getElementById('bookmark-form');

let bookmarks = {};

// Show Modal, Focus on Input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal Event Listner
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// Validate form
function validateForm(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regx = new RegExp(expression);
    if(!urlValue || !nameValue) {
        alert('plase fill up the given field');''
        return false;
    }
    
    if(!urlValue.match(regx)) {
        alert('Please enter valid URL value');
        return false;
    }
    // Valid
    return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
    // Remove Bookmark element
    bookmarkContainer.textContent = '';
    // Build Items
    // localStorage.clear();
    bookmarks.forEach((bookmark) => {
        const { name, url} = bookmark;
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        // Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas','fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

        // Favicon / Link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');

        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://www.google.com/s2/u/0/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');

        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;

        // Append to Bookmarks Container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarkContainer.appendChild(item);
    });
}

// Fetch bookmarks
function fetchBookmarks() {
    // Get bookmarks from localstorage if available
    if(localStorage.getItem('bookmarks')) {
       
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }
    else {
        // Create bookmarks array in localstorage
        bookmarks = [
            {
            name : 'VD',
            url : 'https://google.com',
        },
    ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if(bookmark.url === url){
            bookmarks.splice(i, 1);
        }
    });
    // Update bookmark array in  localstorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();

}

// Handle Data from Form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;

    if(!urlValue.includes('https://', 'http://')) {
        urlValue = `https://${urlValue}`;
    }

    if(!validateForm(nameValue, urlValue)) {
        return false;
    }

    const bookmark = {
        name : nameValue,
        url : urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// Event Listner
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch bookmarks
fetchBookmarks();