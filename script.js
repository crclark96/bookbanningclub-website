const books = [
    {
        "book": "https://bookshop.org/p/books/better-buses-better-cities-how-to-plan-run-and-win-the-fight-for-effective-transit-steven-higashide/8245349?ean=9781642830149&next=t",
        "questions": "https://docs.google.com/document/d/1kn_3Efg-CD-ADjznACk4LJ9iyltUgUHQsaVSr82Di-g/edit?tab=t.0",
        "time": "14 April 2025, 6:30 PM"
    },
    {
        "book": "https://bookshop.org/p/books/how-to-blow-up-a-pipeline-andreas-malm/14512497?ean=9781839760259&next=t&next=t",
        "questions": "https://docs.google.com/document/d/1hwS7GTjV0XMjYYaXYnjyihsqKbGiDT5aWpmzdLoo2h0/edit?tab=t.0",
        "time": "03 March 2025, 6:30 PM"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    console.log(books);
    let head = books[0];
    document.querySelectorAll('[data-tag]').forEach(element => {
        let type = element.getAttribute('data-type');
        switch(type) {
            case 'time':
                element.innerHTML = head.time;
                break;
            case 'questions':
                break;
            case 'book':
                element.href = head.book;
                break;
            case 'book-img':
                element.src = getBookImage(head.book);
                break;
        }
    })
});

function getBookImage(book) {
    bookURL = new URL(book);
    params = new URLSearchParams(bookURL.search);
    ean = params.get('ean');
    return `https://images-us.bookshop.org/ingram/${ean}.jpg?width=640&v=v2`;
}
