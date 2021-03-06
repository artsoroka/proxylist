var express   = require('express'); 
var app       = express(); 
var Datastore = require('nedb'); 
var parser    = require('./lib/parser'); 

var isValid   = function(ip){
    var ipAddress = ip.match(/\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/); 
    
    if( ! ipAddress ) return false; 
    
    return ipAddress[0].split('.').length == 4; 
    
}; 

var updateProxyList = function(db, updateDatabase){
        
    parser.start(1, function(err, data){
      if(err) return console.log(err); 
      
      db.insert(data, function(error){
        
        if( error ) return console.log(error); 
        
        updateDatabase(); 
        console.log('proxy list saved'); 
      
      }); 
      
    });
}; 

var initializeProxyList = function(db, interval, callback){
    updateProxyList(db, callback); 
    setInterval(function(){
        updateProxyList(db, callback); 
    }, interval);
}; 

module.exports = function(config){
    
    var proxyList = new Datastore({
        filename: config.db.path,  
        autoload: 'true'
    });
    
    initializeProxyList(proxyList, config.parser.updateInterval, function(){
        proxyList.loadDatabase(); 
    }); 
    
    app.get('/', function(req, res){
        res.send('welcome to proxy list checker'); 
    }); 

    app.get('/:ip', function(req, res){
        
        var ip = req.params.ip; 
        
        if( ! isValid(ip) )
            return res.send('this is not a valid ip address'); 
                
        proxyList.findOne({ip: ip}, function(err, doc){

            if( err ) 
                return res.status(500).send(err);    
            
            if( ! doc )
                return res.status(404).send('no record found with ip: ' + ip); 
            
            return res.send(JSON.stringify(doc));             
            
        }); 
    }); 
    
    return app; 
    
}; 