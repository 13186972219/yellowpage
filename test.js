var http = require('http');
var fs = require('fs'); 
var express = require('express');

class Link
{
  constructor(name, url){
    this.name = name;
    this.url = url;
  }
  toString(){
    return "<a href=" + this.url + ">" + this.name + "</a>";
  }
}

class Td
{
  constructor(link){
    this.link = link;
  }
  toString(){
    return "<td>" + this.link.toString() + "</td>";
  }
}

class Tr
{
  constructor(){
    this.tds = new Array();
  }
  add(td){
    this.tds.push(td);
  }
  toString(){
    var text = "<tr>";
    for (var i = 0; i < this.tds.length; i++) {
      text += this.tds[i].toString();
    }
    text += "</tr>";
    return text;
  }
}

class Table
{
  constructor(title){
    this.title = title;
    this.tds = [];
  }
  add(td){
    this.tds.push(td);
  }
  toString(){
    var trs = [];
    var text = "<table><tr><th colspan='8'>" + this.title + "</th></tr>";
    for (var i = 0; i < this.tds.length; i++) {
      if (i % 8 == 0) {
        trs.push(new Tr());
      }
      var tr = trs[trs.length - 1];
      tr.add(this.tds[i]);
    }
    for (var i = 0; i < trs.length; i++) {
      text += trs[i].toString();
    }
    text += "</table>";
    return text;
  }
}

css_table = 'table{border-style: double; width: 100%;}';
css_tr = 'tr{text-align: center; width: 100%; border-style: double;}';
css_th = 'th{text-align: center;  text-color: red; width: 100%; border-style: double;}';
css_td = 'td{text-align: center; text-color: blue; border-style: double;}';
htmlBegin='<html><head><title>Yellow Page</title><style>' + css_table + css_tr + css_th + css_td + '</style></head><body>';
htmlEnd='</body></html>';

var app = express();

app.get('/',  function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var contents = fs.readFileSync('page.conf').toString();
  var lines = contents.split("\n");
  var tables = new Array();
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.length < 10)
      continue;
    var items = line.split("->");
    if (items[0] == 'Title'){
      tables.push(new Table(items[1]));
      continue;
    }
    var currTable = tables[tables.length - 1];
    currTable.add(new Td(new Link(items[0], items[1])));
  }

  var text = "";
  for(var i = 0; i < tables.length; i++) {
    text += tables[i].toString() + "<br>";
  }

//console.log(text);

  res.end(htmlBegin + text + htmlEnd);

});

app.listen(80, function(){});


