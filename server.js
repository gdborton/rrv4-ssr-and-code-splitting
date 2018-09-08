const serverless = require('serverless-http');
const fs = require('fs');
const express = require('express');
const ReactDOMServer = require('react-dom/server');
const App = require('./dist/index.server.bundle.js');

//const express = require('serverless-express/express');
//const handler = require('serverless-express/handler')

const PORT = 3000;

const app = express();
const template = fs.readFileSync('./index.html', 'utf8'); // stupid simple template.

const todos = [
  { id: 'ed0bcc48-bbbe-5f06-c7c9-2ccb0456ceba', title: 'Wake Up.', completed: true },
  { id: '42582304-3c6e-311e-7f88-7e3791caf88c', title: 'Grab a brush and put a little makeup.', completed: true },
  { id: '036af7f9-1181-fb8f-258f-3f06034c020f', title: 'Write a blog post.', completed: false },
  { id: '1cf63885-5f75-8deb-19dc-9b6765deae6c', title: 'Create a demo repository.', completed: false },
  { id: '63a871b2-0b6f-4427-9c35-304bc680a4b7', title: '??????', completed: false },
  { id: '63a871b2-0b6f-4422-9c35-304bc680a4b7', title: 'Profit.', completed: false },
];

// express.static was only working for some requests, but not others.
app.use('/dist', express.static(`${__dirname}/dist`));
app.use('/css', express.static(`${__dirname}/css`));

app.get('*', (req, res) => {
  const props = { todos };

  App.default(req.url, props).then((reactComponent) => {
    const result = ReactDOMServer.renderToString(reactComponent);
    const html = template.replace('{{thing}}', result).replace('{{props}}', JSON.stringify(props));
    res.send(html);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});

module.exports.serverless = serverless(app);
//module.exports.serverless = handler(app);

