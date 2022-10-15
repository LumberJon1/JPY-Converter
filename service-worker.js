// Define files to cache
const FILES_TO_CACHE = [
    "./index.html",
    "./script.js"
];

// Other global constants
const APP_PREFIX = "JPYConverter-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX+VERSION;


// Event listener for installation of service worker
self.addEventListener("install", function (e) {

    // waitUntil tells the browser to wait until this is done to terminate the service worker
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            // Add all files in array to opened cache
            console.log("installing cache : "+CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE)
        })
    )
});

// Event listener for the activation phase
self.addEventListener("activate", function (e) {

    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeepList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });

        // Add the current cache to the keep list
        cacheKeepList.push(CACHE_NAME);
        
        return Promise.all(
            keyList.map(function(key, i) {
                if (cacheKeepList.indexOf(key) == -1) {
                    console.log("deleting cache: "+keyList[i]);
                    return caches.delete(keyList[i]);
                }
            })
        )

        })
    );
    

});