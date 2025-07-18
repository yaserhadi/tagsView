# Tags View Demo

This project shows a simple page with a left menu and a tag bar that tracks
visited menu items. Selecting a menu link adds a tag to the bar. Clicking a tag
or its close icon allows switching between or removing visited pages.

Right-click any tag to change its font color, background color, or to close all
tags at once.

The reusable JavaScript and CSS live in the `src` directory. The `examples`
folder contains an HTML file demonstrating how to use them.

## How to open

No build step is required. Open `examples/index.html` in a web browser or serve
the repository with any static file server. The demo page includes the
JavaScript and CSS from the `src` folder and calls
`initTagsView({menuItemSelector: '.nav-item', leftMenuSelector: '#sidebar'})`
after loading `src/tagsView.js`.
