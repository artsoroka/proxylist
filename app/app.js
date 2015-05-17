var parser = require('./parser'); 

var Datastore = require('nedb'); 
var proxyList = new Datastore({filename: 'proxylist.db', autoload: 'true'}); 

parser.start(1, function(err, data){
  if(err) return console.log(err); 
  
  proxyList.insert(data, function(error){
    
    if( error ) return console.log(error); 
    
    console.log('proxy list saved'); 
  
  }); 
  
}); 