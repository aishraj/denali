


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
          let subRule = resultItem.sub_rules[resultKeySubItem];
          subRule["key"] = resultKeySubItem;
          subRules.push(subRule);
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
  $("#mainContainer").html(resultTmpl({"result": finalResults,"employer_id": new Date().getTime()}));
}

function render(data) {
  pollData = data;
  renderPollItem("start");
}

function main() {
  DataProvider.getPollData(render);
}

$( document ).ready(function() {
  main();
});
