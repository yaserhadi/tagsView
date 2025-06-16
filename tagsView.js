$(function () {
  var visited = [];

  $('.menu-item').on('click', function (e) {
    e.preventDefault();
    var path  = $(this).attr('href');
    var title = $(this).text();

    $('.menu-item').removeClass('active');
    $(this).addClass('active');

    if (!visited.some(v => v.path === path)) {
      visited.push({ path, title });
      $('.tags-view-wrapper').append(
        '<span class="tags-view-item" data-path="'+path+'" data-title="'+title+'">'+
          title+' <span class="close">×</span></span>'
      );
    }
    setActiveTag(path);
    $('#hint').text('The selected page is ' + title);
  });

  $('.tags-view-wrapper')
    .on('click', '.close', function (e) {
      e.stopPropagation();
      var $tag = $(this).parent();
      var path = $tag.data('path');
      visited = visited.filter(v => v.path !== path);
      $tag.remove();
    })
    .on('click', '.tags-view-item', function () {
      var path  = $(this).data('path');
      var title = $(this).data('title');

      $('.menu-item').removeClass('active');
      $('.menu-item[href="'+path+'"]').addClass('active');

      setActiveTag(path);
      $('#hint').text('The selected page is ' + title);
    });

  function setActiveTag(path) {
    $('.tags-view-item').removeClass('active');
    $('.tags-view-item[data-path="'+path+'"]').addClass('active');
  }
});
