# Monitor URLS

Install and Start monitoring using `npm`.

```
npm install
npm start
```

* Important Routes defined in `index.js`

 - `/add` Send a POST request to the route with the body having a parameter `url`. The response will contain the `id` associated with the url.
 - `/responses` Send a POST request with `id` in the body. The response contains last 100 response times of the url.
 - `/edit` Send a POST request with `id` and `url` in the body which Patches the existing URL in the database.
 - `/stop` Send a POST request with `id` in the body and it removes the existing database records of the url associated with the id.

* Database scheme

Database name : `monitor_urls`

Tabel 1 : `identity`
 - id CHAR (128) PRIMARY KEY, url TEXT NOT NULL

Table 2 : `responses`
 - id CHAR (128) PRIMARY KEY, delays TEXT
