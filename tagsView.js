+42
-0

$(function () {
  var visited = [];

  $('.menu-item').on('click', function (e) {
    e.preventDefault();
    var path = $(this).attr('href');
    var title = $(this).text();

    $('.menu-item').removeClass('active');
    $(this).addClass('active');

    if (!visited.some(function(v){ return v.path === path; })) {
      visited.push({ path: path, title: title });
      $('.tags-view-wrapper').append('<span class="tags-view-item" data-path="' + path + '">' + title + ' <span class="close">×</span></span>');
    }
    setActiveTag(path);
    $('#hint').text('The selected page is ' + title);
  });

  $('.tags-view-wrapper').sortable({
    items: '.tags-view-item',
    tolerance: 'pointer'
  });

  $('.tags-view-wrapper').on('click', '.close', function (e) {
    e.stopPropagation();
    var $tag = $(this).parent();
    var path = $tag.data('path');
    visited = visited.filter(function(v){ return v.path !== path; });
    $tag.remove();
  });

  $('.tags-view-wrapper').on('click', '.tags-view-item', function () {
    var path = $(this).data('path');
    $('.menu-item[href="' + path + '"]').trigger('click');
  });

  function setActiveTag(path) {
    $('.tags-view-item').removeClass('active');
    $('.tags-view-item[data-path="' + path + '"]').addClass('active');
  }
});