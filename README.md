# Code Splitting + SSR with React Router demo

Forked from https://github.com/gdborton/rrv4-ssr-and-code-splitting.

This is a demo repository set up to demo code splitting by route on React Router 
with server rendered React components.

After you fetch server rendered HTML routes start fire __locally__.

## Running the demo:

```
git clone https://github.com/huksley/todo-react-ssr-serverless
cd todo-react-ssr-serverless
npm install
npm start
open http://localhost:3000
```

## Running in serverless local

Runs `serverless offline` with webpack support.

```
npm run sls
```

## Running in AWS

For proper paths, you __MUST__ define custom domain.

```
npm run sls:deploy
```

## What's async loaded?

The list of todos that exists between the input bar and the footer of stack of todos. 
If you open your network tab before navigating between All/Active/Completed, 
you'll notice requests for `0.index.bundle.js`, `1.index.bundle.js`, and `2.index.bundle.js` respectively.

![async-component](./async-highlight.png)

## Things of note:

 - The contents of this repo were based on the [TodoMVC code](https://github.com/tastejs/todomvc/tree/master/examples/react) originally written by [Pete Hunt](https://github.com/petehunt).
 - Upgraded to webpack v4 comparing to upstream repo
 - We have 3 webpack configs:
   - One for server
   - Another for client
   - Third one (./webpack.serverless.js) for running in serverless
 - The server, starts with some static data, **and is never updated**, you'll lose your changes if you reload the page.
