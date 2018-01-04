var http = require('http');
var fs = require('fs'); 
var path = require('path'); 
var express = require('express');
var favicon = require('serve-favicon');

let TableCircle=3

class Link
{
  constructor(name, url){
    this.name = name;
    this.url = url;
  }
  toString(){
      return "<a target='_blank' href=" + this.url + "><b>" + this.name + "</b></a>";
  }
}

class Td
{
  constructor(link, table, col){
    this.link = link;
    this.table = table;
    this.col = col;
  }
  toString(){
    if (this.col % 7 % 2 == 0)
      return "\n<td class='tdSingle" + this.table%TableCircle + "'>" + this.link.toString() + "</td>";
    else
      return "\n<td class='tdDouble" + this.table%TableCircle + "'>" + this.link.toString() + "</td>";
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
    var text = "\n<tr>";
    for (var i = 0; i < this.tds.length; i++) {
      text += this.tds[i].toString();
    }
    text += "\n</tr>\n";
    return text;
  }
}

class Table
{
  constructor(title, id){
    this.title = title;
    this.id = id;
    this.tds = [];
  }
  add(td){
    this.tds.push(td);
  }
  table_id(){
    return this.id;
  }
  toString(){
    var trs = [];
    var text = "\n<table cellpadding='3' cellspacing='3'>\n<tr>\n<th colspan='7' class='th" + this.id%TableCircle + "'>" + this.title + "</th>\n</tr>";
    for (var i = 0; i < this.tds.length; i++) {
      if (i % 7 == 0) {
        trs.push(new Tr());
      }
      var tr = trs[trs.length - 1];
      tr.add(this.tds[i]);
    }
    for (var i = 0; i < trs.length; i++) {
      text += trs[i].toString();
    }
    text += "</table>\n";
    return text;
  }
}

var app = express();

app.get('/',  function(req, res) {
  var cssData = fs.readFileSync('style.css').toString();
  htmlBegin='<html><head><title>Yellow Page</title>\n<link rel="icon" href="http://172.24.186.167:2018/favicon.ico?" type="image/x-icon">\n<style>' + cssData + '</style>\n</head>\n<body>\n<center>\n';
  htmlEnd='\n</center>\n</body>\n</html>';
  res.writeHead(200, {'Content-Type': 'text/html'});
  var contents = fs.readFileSync('page.conf').toString();
  var lines = contents.split("\n");
  var tables = new Array();
  var table_id = 0;
  var td_id = 0;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.length < 10)
      continue;
    var items = line.split("->");
    if (items[0] == 'Title'){
      tables.push(new Table(items[1], table_id));
      table_id+=1;
      td_id=0;
      continue;
    }
    var currTable = tables[tables.length - 1];
    currTable.add(new Td(new Link(items[0], items[1]), currTable.table_id(), td_id));
    td_id+=1;
  }

  var text = "";
  for(var i = 0; i < tables.length; i++) {
    text += tables[i].toString() + "\n<br>\n";
  }

//console.log(text);

  res.end(htmlBegin + text + htmlEnd);

});

app.listen(2018, function(){});


