var http = require('http');
var fs = require('fs'); 

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});

  var contents = fs.readFileSync('page.conf').toString();
  var lines = contents.split("\n");
  var isFirstTable = true;
  var count = 0;
  for (i = 0; i < lines.length; i++) {
    var line = lines[i];
    if(line.length < 10)
      continue;
    var items = line.split("->");
    if (items[0] == 'Title')
    {
      if(!isFirstTable)
      {
         res.write('</table><br>');
      }
      res.write('<table><tr><th>' + items[1] + '</th></tr>');
      count = 0;
    }
    else
    {
      count++;
      if(count % 8 == 0)
      {

      }
      res.write('<a href=' + items[1] + ' >' + items[0] + ' ' + count.toString() + '</a><br>');
    }
  } 

  res.write('</table>');

  res.end();
}).listen(80);
