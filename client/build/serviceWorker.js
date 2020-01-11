console.log("Hello from your service worker!");

const FILES_TO_CACHE = [
    "/",
    "../../client/build",
    "/manifest.json",
    "/assets/images/icons/icon-72x72.png",
    "/assets/images/icons/icon-96x96.png",
    "/assets/images/icons/icon-128x128.png",
    "/assets/images/icons/icon-144x144.png",
    "/assets/images/icons/icon-152x152.png",
    "/assets/images/icons/icon-192x192.png",
    "/assets/images/icons/icon-384x384.png",
    "/assets/images/icons/icon-512x512.png"
];

// const GAME_ZIP = "./assets/game-builds/buildv1.1.rar";

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

//Set up an event listener on this service worker for when the service worker is installed.
self.addEventListener("install", function(event){
    //Wait until the cache is opened
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            //Then pre-cache all of the flies to cache. (Pre-caching is done in anticipation)
            console.log("Your files were pre-cached successfully!");
            return cache.addAll(FILES_TO_CACHE);
        })
    )

    self.skipWaiting();
});

//Add an event listener to this service worker for when this is activated.
self.addEventListener("activate", function(event){
    //Wait until we retrieve the keys from the cache, then...
    event.waitUntil(
        //Caches is an object containing all of our caches.  The method keys() grabs all keys-- caches-- from our object.
        caches.keys().then(keyList => {
            //Pass in our list of keys, retrieved from 'caches.keys()', and return a promise array.
            return Promise.all(
                //Build a new array by modifying each element within keyList
                keyList.map(key => {
                    //Passing in the current key iteration of KeyList, check if the key is not equal to the name of our caches.
                    if(key !== CACHE_NAME && key !== DATA_CACHE_NAME){
                        //If the data is NOT equal to the data of either of our caches, then the name is old.
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                        //Delete this key.
                    }
                })
            )
        })
    );

    self.clients.claim();
});

//Add an event listener to this service worker for when this runs a fetch.
self.addEventListener("fetch", function(event){
    //If the fetch being made contains the string '/api', then...
    if(event.request.url.includes("/api")){
        console.log("[service worker] Fetch (data)", event.request.url);

        //Response with the following
        event.respondWith(
            //Open the specified cache, then...
            caches.open(DATA_CACHE_NAME).then(cache => {
                //Passing in the cache we have opened, return the request of our fetch call being made, then...
                return fetch(event.request)
                .then(response => {
                    //Based on the response of our fetch call, if the response is OK, then...
                    if(response.status === 200){
                        //Clone the response of our fetch into our cache, saving the url used to call this fetch.  We do this so we may replicate the fetch in the event that we are offline.
                        cache.put(event.request.url, response.clone());
                    }
                })
            })
        )
    }
})