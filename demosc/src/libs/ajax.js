var commonURL = 'http://192.168.1.103:9090'
function get(url, data, callback,type) {
  var data = data;
  var token;
  if(url !='/admin/login'){
    token = localStorage.getItem('token')?localStorage.getItem('token'):''
    data.token = token;
  }
  if(type){
    if (url.indexOf('http') == -1) {
      url = url
    }
  }else if (url.indexOf('http') == -1) {
    url = commonURL + url
  }
  if (typeof data === "function") {
    callback = data;
  }

  if (typeof data === "object") {
    url = data ? url + '?' + urlCode(data) : url;
  }
  var xhr = new XMLHttpRequest();
  xhr.open('get', url);
  xhr.onload = function() {
    var json = JSON.parse(xhr.responseText)
    callback(json);
  }
  //xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.send();
}

function post(url, data, callback) {
  if(url !='/admin/login'){
   var token = localStorage.getItem('token')?localStorage.getItem('token'):''
    data.token = token;
  }
  if (typeof data === "function") {
    callback = data;
    data = null;
  }
  if (url.indexOf('http') == -1) {
    url = commonURL + url
  }
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.open('post', url);
  xhr.onload = function() {
    if (xhr.status == 200) {

      var json = JSON.parse(xhr.responseText)
      // if (json.code == -2) {
      //   location = '/pages/login.html'
      // }
      callback(json);


    } else {

    }

  };
  xhr.setRequestHeader('content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
}
function urlCode(data) {
  var str = '';
  if (!data) {
    return null;
  }
  for (var key in data) {
    if (typeof data[key] == 'string') {
      data[key] = data[key].trim()
    }
    str += key + '=' + encodeURIComponent(data[key]) + '&';
  }

  return str.substring(0, str.length - 1);
}
export {get,post}
