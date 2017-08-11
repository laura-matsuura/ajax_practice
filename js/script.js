
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');

    var streetviewURL = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location='
    + address + '';
    $body.append('<img class="bgimg" src="' + streetviewURL + '">');

  //NYTimes AJAX request

  var timesURL= "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
  cityStr + '&sort=newest&api-key=d93e24be0b4f47108b4d669a6a861ca1'

  $.getJSON( timesURL, function( data ) {
    $nytHeaderElem.text('New York Times Articles About ' + cityStr);

    articles = data.response.docs;
    for (var i = 0; i < articles.length; i++) {
      var article = articles[i];
      $nytElem.append('<li class="article">' + '<a href="' + article.web_url + '">' +
      article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');


      // $nytElem.append(`
      //   <li class="article">
      //     <a href="${article.web_url}">${article.headline.main}</a>
      //     <p>${article.snippet}</p>
      //   </li>`
      // );

    };

  }).error(function(){
      $nytElem.text('New York Times Article Could Not Be Loaded ');

    });

    var wikiURL = "http://en.wikipedia.org/w/api.php?action=opensearch&search="
    + cityStr + "&format=json&callback=wikiCallback";

    var wikiRequestTimeout = setTimeout(function(){
      $wikiElem.text("failed to get wikipedia resources");
    },8000);

    $.ajax({
      url: wikiURL,
      dataType: "jsonp",
      //jsonp: "callback"
      success: function(response){
        var articleList = response[1];

        for (var i=0; i < articleList.length; i++) {
          articleStr = articleList[i];
          var url = 'http://en.wikipedia.org/wiki/' + articleStr;
          $wikiElem.append('<li><a href="'+ url + '">' +
            articleStr + '</a></li>');

        };

        clearTimeout(wikiRequestTimeout);


      }




    })



  return false;
};


$('#form-container').submit(loadData);
