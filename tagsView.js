function initTagsView(options) {
  options = options || {};
  var menuItemSelector = options.menuItemSelector || '.menu-item';
  var leftMenuSelector = options.leftMenuSelector || '.left-menu';

  var visited = [];

  $('.tags-view-container').css('left', $(leftMenuSelector).outerWidth(true));

  var $contextMenu = $('<ul class="context-menu">\n' +
    '  <li data-action="font">Font Color</li>\n' +
    '  <li data-action="background">Background Color</li>\n' +
    '  <li data-action="close-all">Close All</li>\n' +
    '</ul>').appendTo('body').hide();
  var $menuTarget = null;

  function updateScrollButtons() {
    var $scroll = $('.tags-view-scroll');
    var scrollWidth = $scroll.get(0).scrollWidth;
    var clientWidth = $scroll.get(0).clientWidth;
    var scrollLeft = $scroll.scrollLeft();

    if (scrollWidth > clientWidth) {
      $('.scroll-button').show();
      $('.scroll-button.left').toggle(scrollLeft > 0);
      $('.scroll-button.right').toggle(scrollLeft + clientWidth < scrollWidth);
    } else {
      $('.scroll-button').hide();
    }
  }

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
      stop: function () {
        refreshVisited();
        updateScrollButtons();
      }
    }).disableSelection();
  } else {
    console.error('jQuery UI not loaded. Sortable disabled.');
  }

  $('.scroll-button.left').on('click', function () {
    var $scroll = $('.tags-view-scroll');
    $scroll.animate({ scrollLeft: '-=100' }, 100, updateScrollButtons);
  });

  $('.scroll-button.right').on('click', function () {
    var $scroll = $('.tags-view-scroll');
    $scroll.animate({ scrollLeft: '+=100' }, 100, updateScrollButtons);
  });

  $(menuItemSelector).on('click', function (e) {
    e.preventDefault();
    var path  = $(this).attr('href');
    var title = $(this).text();

    $(menuItemSelector).removeClass('active');
    $(this).addClass('active');

    if (!visited.some(v => v.path === path)) {
      visited.push({ path, title });
      $('.tags-view-wrapper').append(
        '<span class="tags-view-item" data-path="'+path+'" data-title="'+title+'">'+
          title+' <span class="close">×</span></span>'
      );
      updateScrollButtons();
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
      updateScrollButtons();
    })
    .on('contextmenu', '.tags-view-item', function (e) {
      e.preventDefault();
      $menuTarget = $(this);
      $contextMenu.css({ top: e.pageY, left: e.pageX }).show();
    })
    .on('click', '.tags-view-item', function () {
      var path  = $(this).data('path');
      var title = $(this).data('title');

      $(menuItemSelector).removeClass('active');
      $(menuItemSelector+'[href="'+path+'"]').addClass('active');

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
      updateScrollButtons();
    }
    $contextMenu.hide();
  });

  $('.tags-view-scroll').on('scroll', updateScrollButtons);
  $(window).on('resize', updateScrollButtons);
  updateScrollButtons();
}

window.initTagsView = initTagsView;
