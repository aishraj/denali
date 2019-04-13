


const NULL = "NULL";
const TRUE = "true";
const FALSE = "false";

let pollStack = [];
let resultList = [];
let pollData = {};

const DataProvider = {
  getPollData: function(callback){
    $.getJSON("../json/poll.json", callback);
  },

  getResultData: function(callback){
    $.getJSON("../json/result.json", callback);
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
    let uri = new URL('http://localhost:3000/training');
    let params =  {training_id: training_id};
    Object.keys(params).forEach(key => uri.searchParams.append(key, params[key]));
    return await fetch(uri).then(response => response.json());
  },

  createListings: async function(training_id = 6) {
    let body = {training_id: training_id};
    return await this.postData('http://localhost:3000/sendinvite', body)
    .then(data => JSON.stringify(data));
  },

  updateListing: async function(training_id = 6, user_id = 2, status = 3) {
    let body = {training_id: training_id, user_id: user_id, status: status};
    return await this.postData('http://localhost:3000/training', body)
      .then(data => JSON.stringify(data));
  }
};


function attachEvents() {
  $('#next_button').click(function(e){
    e.preventDefault();
    const formInputs = $(".form-check-input");
    _.each(formInputs, function(input){
      if (input.checked) {
        if ($(input).data('key') != NULL) {
          resultList.push($(input).data('key'));
        }
        if ($(input).data('next') != NULL) {
          pollStack.push($(input).data('next'));
        }
      }
    })
    if (pollStack.length > 0) {
      renderPollItem(pollStack.pop());
    } else {
      DataProvider.getResultData(renderResults);
    }
  });
}

function renderPollItem(pollKey) {
  const pollItem = pollData[pollKey];
  const pollTmpl = _.template($("#pollTemplate").html());
  $("#mainContainer").html(pollTmpl(pollItem));
  attachEvents();
}

function renderResults(resultData) {
  let finalResults = [];
  _.each(resultList, function(resultKey){
    if (_.has(resultData, resultKey)) {
      let resultItem = resultData[resultKey];
      let subRules = [];
      let isComplete = true;
      _.each(resultList, function(resultKeySubItem){
        if (_.has(resultItem.sub_rules, resultKeySubItem)) {
          subRules.push(resultItem.sub_rules[resultKeySubItem]);
          if (resultItem.sub_rules[resultKeySubItem].is_complete == FALSE) {
            isComplete = false;
          }
        }
      });

      finalResults.push({
        "text": resultItem.text,
        "is_complete": isComplete,
        "sub_rules": subRules,
      });
    }
  });
  const resultTmpl = _.template($("#resultTemplate").html());
  $("#mainContainer").html(resultTmpl({"result": finalResults}));
}

function render(data) {
  pollData = data;
  renderPollItem("start");
}

function main() {
  console.log(DataProvider.getListingForId(6));
  DataProvider.getPollData(render);
}


main();
