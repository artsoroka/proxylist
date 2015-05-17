var request = require('request'); 
var cheerio = require('cheerio'); 

var baseUrl = 'http://proxy-besplatno.com'; 
var result  = []; 

var parseTable = function(tableRows, entry){
  tableRows.each(function(index, td){
      
    switch(index){
      case 0:
        entry.ip = $(td).text().trim();
        break; 
      case 2: 
        entry.country = $(td).text().trim(); 
        break; 
      case 3: 
        entry.kbs = $(td).text().trim(); 
        break; 
      case 4: 
        entry.availability = $(td).text().trim(); 
        break; 
      case 5: 
        entry.lastChecked = $(td).text().trim(); 
        break; 
      case 6: 
        entry.discovered = $(td).text().trim(); 
        break;
      default:
        break; 
        }
        
    });
}; 

var parsePage = function(html, callback){
    $ = cheerio.load(html); 
    
    var table = $('.tr_index');
    
    if( table.length <= 2){
      console.log('EMPTY'); 
      return callback(true);  
    }

    table.each(function(i,e){
      var entry = {}; 
      parseTable($(this).children(), entry); 
      result.push(entry); 
    }); 
    
    callback(false); 
    
}; 
 
var getPage = function(pageId, listReadyCallback){

  var query   = ['page_num', pageId].join('='); 
  var options = {
    url: [baseUrl, query].join('?'),
    headers: {
      'User-Agent': 'request'
    }, 
    followRedirect: true
  };

  request(options, function (error, response, body) {
    if ( error && response.statusCode == 200) {
      console.log(error, response, body); 
      return listReadyCallback(error); 
    }
    console.log('Starting parsing page ', pageId ); 
    
    parsePage(body, function(listReady){
        if(listReady)
          return listReadyCallback(null, result); 
        getPage(++pageId, listReadyCallback); 
    }); 
     
  }); 
  
}; 

module.exports = {
      start: function(startPageId, callback){
      getPage(startPageId, callback); 
    }
}; 
  
