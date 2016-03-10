var http = require("http");
http.createServer(function(request, response) {  
    response.writeHead(200, {"Content-Type": "text/plain"});  
    respone.write();
    response.write("Hello World");
    response.end();
}).listen(8888);
console.log("nodejs start listen 8888 port!");