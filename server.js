const serverless = require('serverless-http');
const fs = require('fs');
const cors = require('cors');
const express = require('express');
const ReactDOMServer = require('react-dom/server');
const App = require('./dist/index.server.bundle.js');

const app = express();
const template = fs.readFileSync(`${__dirname}/index.html`, 'utf8'); // stupid simple template.
const port = process.env.SERVER_PORT || 3000;

const todos = [
  { id: 'ed0bcc48-bbbe-5f06-c7c9-2ccb0456ceba', title: 'Wake Up.', completed: true },
  { id: '42582304-3c6e-311e-7f88-7e3791caf88c', title: 'Grab a brush and put a little makeup.', completed: true },
  { id: '036af7f9-1181-fb8f-258f-3f06034c020f', title: 'Write a blog post.', completed: false },
  { id: '1cf63885-5f75-8deb-19dc-9b6765deae6c', title: 'Create a demo repository.', completed: false },
  { id: '63a871b2-0b6f-4427-9c35-304bc680a4b7', title: '??????', completed: false },
  { id: '63a871b2-0b6f-4422-9c35-304bc680a4b7', title: 'Profit.', completed: false },
];

app.use(cors());
// express.static was only working for some requests, but not others.
app.use('/dist', express.static(`${__dirname}/dist`));
app.use('/css', express.static(`${__dirname}/css`));
// root files
app.use(express.static(`${__dirname}/public`));

app.get('*', (req, res) => {
  const props = { todos };

  App.default(req.url, props).then((reactComponent) => {
    const result = ReactDOMServer.renderToString(reactComponent);
    const html = template.replace('{{thing}}', result).replace('{{props}}', JSON.stringify(props));
    res.send(html);
    res.end();
  });
});

// Don`t listen in serverless
if (process.env._HANDLER !== 'server.serverless') {
  app.listen(port, () => {
    console.log(`listening on port: ${port}`);
  });
}

// Do something in AWS
if (process.env.AWS_EXECUTION_ENV !== undefined) {
  console.log("Hello Amazon!");
}

module.exports.serverless = serverless(app, {
  binary: headers => {
    const ct = headers['content-type'];
    if (ct === undefined) {
      console.error("No content-type header: " + JSON.stringify(headers));
      return false;
    }
    return String(ct).match(/text\/.*/) || ct == "application/json" ? false : true;
  },

  request: function(request, event, context) {
    console.log(request);
  },

  response: function(response, event, context) {
    console.log(response);
  }
});

