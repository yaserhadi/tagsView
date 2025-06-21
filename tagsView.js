$(function () {
  var visited = [];

  var $contextMenu = $('<ul class="context-menu">\n' +
    '  <li data-action="font">Font Color</li>\n' +
    '  <li data-action="background">Background Color</li>\n' +
    '  <li data-action="close-all">Close All</li>\n' +
    '</ul>').appendTo('body').hide();
  var $menuTarget = null;

  function refreshVisited() {
    visited = $('.tags-view-item').map(function () {
      return { path: $(this).data('path'), title: $(this).data('title') };
    }).get();
  }

  if ($.fn.sortable) {
    $('.tags-view-wrapper').sortable({
      items: '.tags-view-item',
      tolerance: 'pointer',
      placeholder: 'tags-view-placeholder',
      forcePlaceholderSize: true,
      revert: 100,
      stop: refreshVisited
    }).disableSelection();
  } else {
    console.error('jQuery UI not loaded. Sortable disabled.');
  }

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
    .on('contextmenu', '.tags-view-item', function (e) {
      e.preventDefault();
      $menuTarget = $(this);
      $contextMenu.css({ top: e.pageY, left: e.pageX }).show();
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

  $(document).on('click', function () {
    $contextMenu.hide();
  });

  $contextMenu.on('click', 'li', function () {
    var action = $(this).data('action');
    if (action === 'font') {
      var color = prompt('Font color (#rrggbb or name)');
      if (color) {
        ($menuTarget || $('.tags-view-item')).css('color', color);
      }
    } else if (action === 'background') {
      var color = prompt('Background color (#rrggbb or name)');
      if (color) {
        ($menuTarget || $('.tags-view-item')).css('background', color);
      }
    } else if (action === 'close-all') {
      visited = [];
      $('.tags-view-wrapper').empty();
    }
    $contextMenu.hide();
  });
});
