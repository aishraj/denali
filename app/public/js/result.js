


const NULL = "NULL";
const TRUE = "true";
const FALSE = "false";

const host = "localhost";

const status = {
  INCOMPLETE: 0,
  COMPLETE: 1,
};

const DataProvider = {
  getPollData: function(callback){
    $.getJSON("../json/poll.json", callback);
  },

  getResultData: function(callback){
    $.getJSON("../json/resultDetail.json", callback);
  },

  postData: async function(url = ``, data = {}) {
  // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses JSON response into native Javascript objects
},

  getListingForId: async function(training_id = 6) {
    let uri = new URL('http://'+host+':3000/training');
    let params =  {training_id: training_id};
    Object.keys(params).forEach(key => uri.searchParams.append(key, params[key]));
    return await fetch(uri).then(response => response.json());
  },

  createListings: async function(training_id = 6) {
    let body = {training_id: training_id};
    return await this.postData('http://'+host+':3000/sendinvite', body)
    .then(data => JSON.stringify(data));
  },

  updateListing: async function(training_id = 6, user_id = 2, status = 3) {
    let body = {training_id: training_id, user_id: user_id, status: status};
    return await this.postData('http://'+host+':3000/training', body)
      .then(data => JSON.stringify(data));
  }
};

function getParam(paramName) {
  const url = new URL(window.location.toString());
  return url.searchParams.get(paramName);
}

function clearContent() {
  $("#mainContainer").html("");
}

function renderManageSection() {
  const employee_id = getParam("employee_id");
  const employer_id = getParam("employer_id");
  if (employee_id == null) {
    DataProvider.getListingForId(employer_id).then(response => {
      const manageTmpl = _.template($("#manageTemplate").html());
      $("#mainContainer").append(manageTmpl(response["response"]));
    });
  } else {
    DataProvider.updateListing(employer_id, employee_id, status.COMPLETE).then(
      response => console.log(response)
    );
  }
}

function renderResultDetail(resultData) {
  const resultTmpl = _.template($("#resultTemplate").html());
  $("#mainContainer").append(resultTmpl(resultData));
  renderManageSection();
}

function render(data) {
  renderResultDetail(data);
}

function main() {
  clearContent();
  DataProvider.getResultData(response => render(response[getParam("key")]));
}

$( document ).ready(function() {
  main();
});
