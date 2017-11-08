# Code Splitting + SSR with RRv4 demo

This is a demo repository set up to demo code splitting by route on React Router v4 with server rendered React components.

Running the demo:

```
git clone git@github.com:gdborton/rrv4-ssr-and-code-splitting.git
cd rrv4-ssr-and-code-splitting/
npm install
npm start
open http://localhost:3000
```

## What's async loaded?

The list of todos that exists between the input bar and the footer of stack of todos. If you open your network tab before navigating between All/Active/Completed, you'll notice requests for `0.index.bundle.js`, `1.index.bundle.js`, and `2.index.bundle.js` respectively.

![async-component](./async-highlight.png)

## Things of note:
 - The contents of this repo were based on the [TodoMVC code](https://github.com/tastejs/todomvc/tree/master/examples/react) originally written by [Pete Hunt](https://github.com/petehunt).
 - We're using babel-eslint to enable `import()`.
 - We're using the Airbnb dynamic import plugins, webpack's `import()` creates references to `window` that don't work in node:
   - [babel-plugin-dynamic-import-webpack](https://github.com/airbnb/babel-plugin-dynamic-import-webpack) for client side code.
   - [babel-plugin-dynamic-import-node](https://github.com/airbnb/babel-plugin-dynamic-import-node) for server side code.
 - We have two webpack configs:
   - One for server (`libraryTarget = commonjs2` and `babel-plugin-dynamic-import-node`).
   - Another for client (`babel-plugin-dynamic-import-webpack`).
 - The server, starts with some static data, **and is never updated**, you'll lose your changes if you reload the page.
