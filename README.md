# be-lazy

[![Playwright Tests](https://github.com/bahrus/be-lazy/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-lazy/actions/workflows/CI.yml)

be-lazy loads a template into the live DOM tree only when it becomes visible (or is about to be visible based on threshold settings.)

<a href="https://nodei.co/npm/be-lazy/"><img src="https://nodei.co/npm/be-lazy.png"></a>

The consumer of be-lazy needs to use css to set the size to something approximating what it will be when instantiated:

```html
    <style>
        template[be-lazy], template[is-lazy]{
            display:block;
            height: 18px;
        }
    </style>
    <template be-lazy>
        <div>I am here</div>
    </template>
```

The role of be-lazy ends once it becomes viwable, and the content is instantiated.   In fact, the template is deleted at that point.

Options include setting [IntersectionObserverInit](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#creating_an_intersection_observer) settings:

```html
<template be-lazy='{
    "options": {
        "rootMargin": "0px",
        "threshold": "1.0"
    }
}'>
```

Other configuration settings include "enterDelay" and "exitDelay".  The idea behind those settings is if the user is scrolling very quickly, it can slow the scrolling down if it is instantiating templates that have already zoomed past.

be-lazy can hold its own against [content-visibility](https://web.dev/content-visibility/) in terms of performance.

It is most effective if content is "paged" -- be-lazy really shouldn't hold a single div tag as shown above, but the amount of content in should approximately fill the screen.

be-lazy is currently being used by one virtual list - [xtal-vlist](https://github.com/bahrus/xtal-vlist).   

[TODO]  Support doing transform during instantiation
[TODO]  Support instantiating within shadow DOM

## Viewing this element locally

Any web server than can serve static files will do, but...

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/dev in a modern browser.

## Running Tests

```
> npm run test
```