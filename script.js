const books = [
    {
        "book": "https://bookshop.org/p/books/braiding-sweetgrass-indigenous-wisdom-scientific-knowledge-and-the-teachings-of-plants-robin-wall-kimmerer/6fa4d296293d20e8?ean=9781571313560&next=t",
        "questions": "https://docs.google.com/document/d/1adUbpYYHnebuGth1UWn-bBeE8IJhDhvXrpAiFcii8LA/edit?usp=sharing",
        "time": "24 November 2025, 6:30pm"
    },
    {
        "book": "https://bookshop.org/p/books/what-are-people-for-essays-wendell-berry/17314289?ean=9781582434872&next=t",
        "questions": "https://docs.google.com/document/d/1QZs3EZANKTCDohLA6tlr0yAwOgU4BE7G6AFF5RPcPJY/edit?usp=sharing",
        "time": "29 September 2025, 6:30pm"
    },
    {
        "book": "https://bookshop.org/p/books/dispossessed-the-50th-anniversary-edition-ursula-k-le-guin/21222066?ean=9780063382930&next=t&affiliate=98294",
        "questions": "https://docs.google.com/document/d/1M7ea0cFyqJub5nZnQu7Bf3A-OiFLgdz9xgT5u7jrQDA/edit?tab=t.0",
        "time": "19 August 2025, 6:30pm"
    },
    {
        "book": "https://bookshop.org/p/books/border-and-rule-global-migration-capitalism-and-the-rise-of-racist-nationalism-harsha-walia/14842986?ean=9781642592696&next=t",
        "questions": "https://docs.google.com/document/d/1gXciCtclSvtUQTGb3212j1D1YwKdgyWjSaw73UiXHcU/edit?usp=sharing",
        "time": "30 June 2025, 6:30 PM"
    },
    {
        "book": "https://bookshop.org/p/books/how-to-do-nothing-resisting-the-attention-economy-jenny-odell/8076119?ean=9781612198552&next=t",
        "questions": "https://docs.google.com/document/d/1dtcKhCVc9Q9foZBPL2rQ1SA1zT_4UCIEXfDwo5_b304/edit?tab=t.0",
        "time": "12 May 2025, 6:30 PM"
    },
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
                generateQuestions(head.questions).then(data => {
                    element.innerHTML += data;
                });
                break;
            case 'book':
                element.href = head.book;
                break;
            case 'book-img':
                element.src = getBookImage(head.book);
                break;
            case 'book-info':
                getBookDetails(head.book).then(data => {
                    if (data) {
                        element.innerHTML = `<h3>${data.title}</h3><p>${data.author_name[0]}</p>`;
                    }
                });
        }
    })
});

function getISBN(book) {
    bookURL = new URL(book);
    params = new URLSearchParams(bookURL.search);
    ean = params.get('ean');
    return ean;
}

async function getBookDetails(book) {
    isbn = getISBN(book);
    resp = await fetch(`https://openlibrary.org/search.json?q=${isbn}`);
    if (!resp.ok) {
        return null;
    }
    data = await resp.json();
    if (data.numFound == 0) {
        return null;
    }
    return data.docs[0];
}

function getBookImage(book) {
    ean = getISBN(book);
    return `https://images-us.bookshop.org/ingram/${ean}.jpg?width=640&v=v2`;
}

function getDocIdFromUrl(url) {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const pathParts = path.split('/');
    return pathParts[3];
}

async function generateQuestions(url) {
    data = await fetchPublicGoogleDoc(getDocIdFromUrl(url));
    console.log(data);

    if (!data) {
        return '<p>Please check back later for questions.</p>';
    }

    return removeHeadElement(data.html);
}

function removeHeadElement(htmlContent) {
    // Create a temporary DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Remove the head element if it exists
    const head = doc.querySelector('head');
    if (head) {
        head.parentNode.removeChild(head);
    }

    // Get the body content or the entire document without head
    const body = doc.querySelector('body');

    if (body) {
        // Return just the body content
        return body.innerHTML;
    } else {
        // If no body tag exists, return the entire document without head
        return doc.documentElement.innerHTML;
    }
}

async function fetchPublicGoogleDoc(docId) {
    try {
        // Construct the export URL (format is HTML)
        const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=html`;

        // Fetch the document
        const response = await fetch(exportUrl);

        if (!response.ok) {
                throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
        }

        // Get HTML content
        const htmlContent = await response.text();

        // Create a temporary element to parse the HTML
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlContent;

        // Extract just the text content
        const textContent = tempElement.textContent || tempElement.innerText;

        return {
            html: htmlContent,
            text: textContent
        };
    } catch (error) {
        console.error('Error fetching Google Doc:', error);
        return null;
    }
}
