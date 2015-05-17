module.exports = {
    APP_PORT: process.env.PL_PORT || 8010, 
    parser: {
        updateInterval: 24 * 60 * 1000
    }, 
    db: {
        path: __dirname + '/../db/proxylist.db' 
    }
}; 