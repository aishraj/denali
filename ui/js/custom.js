


const NULL = "NULL";
const TRUE = "TRUE";
const FALSE = "FALSE";

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
  let pollTmpl = _.template($("#pollTemplate").html());
  $("#mainContainer").html(pollTmpl(pollItem));
  attachEvents();
}

function renderResults(resultData) {
  console.log(resultData);
  console.log(resultList);
}

function render(data) {
  pollData = data;
  renderPollItem("start");
}

function main() {
  DataProvider.getPollData(render);
}


main();
