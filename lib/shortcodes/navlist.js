// generates a page navigation list
const
  listType      = 'nav',
  elementActive = 'a',
  classActive   = 'active';

// pass in collections.all | eleventyNavigation, (current) page, and maximum depth level
module.exports = (pageNav, page) => {

  function navRecurse(entry) {

    let
      active = (entry.url === page.url),
      classList = [];

    if (active) classList.push(classActive);

    return (

      '<a ' +
      (classList.length ? ` class="${ classList.join(' ') }" ` : '') +
      'href='+entry.url+'' +
      '>' +
      entry.title +
      '</a>'

    );

  }

  let nav = '';
  for (let entry of pageNav) {
    nav += navRecurse(entry);
  }

  return `<${ listType } class="Site-nav menu ltr-sp">${ nav }</${ listType }>`;

};