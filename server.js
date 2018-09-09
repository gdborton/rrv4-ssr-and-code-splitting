const serverless = require('serverless-http');
const fs = require('fs');
const cors = require('cors');
const express = require('express');
const ReactDOMServer = require('react-dom/server');
const App = require('./dist/index.server.bundle.js');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const app = express();
const template = fs.readFileSync(`${__dirname}/index.html`, 'utf8'); // stupid simple template.
const port = process.env.SERVER_PORT || 3000;
const tableName = process.env.TODO_TABLE || 'todos';
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const initialTodos = [
  { id: 'ed0bcc48-bbbe-5f06-c7c9-2ccb0456ceba', title: 'Wake Up.', completed: true },
  { id: '42582304-3c6e-311e-7f88-7e3791caf88c', title: 'Grab a brush and put a little makeup.', completed: true },
  { id: '036af7f9-1181-fb8f-258f-3f06034c020f', title: 'Write a blog post.', completed: false },
  { id: '1cf63885-5f75-8deb-19dc-9b6765deae6c', title: 'Create a demo repository.', completed: false },
  { id: '63a871b2-0b6f-4427-9c35-304bc680a4b7', title: '??????', completed: false },
  { id: '63a871b2-0b6f-4422-9c35-304bc680a4b7', title: 'Profit.', completed: false },
];

app.use(cors());
app.use(bodyParser.json({ strict: false }));

// Disable 304 support, works wrong IMO
app.set('etag', false);
// Always send last-modified as current time
app.get('/*', function(req, res, next){ 
  res.setHeader('Last-Modified', (new Date()).toUTCString());
  next(); 
});

// express.static was only working for some requests, but not others.
app.use('/dist', express.static(`${__dirname}/dist`, { etag: false }));
app.use('/css', express.static(`${__dirname}/css`, { etag: false }));
// root files
app.use(express.static(`${__dirname}/public`, { etag: false }));

// Obtain record
app.get('/api/todo/:id', function (req, res) {
  const params = {
    TableName: tableName,
    Key: {
      id: req.params.id,
    },
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log('Failed to get record id = ' + req.params.id, error);
      res.status(500).json({ error: 'Failed to get record id = ' + req.params.id });
      return;
    }

    if (result.Item) {
      const { id, title, completed } = result.Item;
      res.json({ id, title, completed });
    } else {
      res.status(404).json({ error: 'Record not found id = ' + req.params.id });
    }
  });
})

app.delete('/api/todo/:id', function (req, res) {
  console.log("Deleting ", req.params.id);
  dynamoDb.delete({ TableName: tableName, Key: { id: req.params.id }}).promise().then(() => {
    res.json({ deleted: "ok" })
  }).catch(error => {
    console.log('Failed to delete', error);
    res.status(500).json({ error: 'Failed to delete: ' + JSON.stringify(error) });
  })
})

app.post('/api/init', function (req, res) {
  dynamoDb.scan({ TableName: tableName }, (error, result) => {
    if (error) {
      console.log('Failed to get records', error);
      res.status(500).json({ error: 'Failed to get records: ' + JSON.stringify(error) });
      return;
    }

    // All promises to delete
    let del = [];
    if (result.Items && result.Items.length > 0) {
      del = result.Items.map(it => dynamoDb.delete({ TableName: tableName, Key: { id: it.id }}).promise())
    }    

    // Wait for delete
    console.log("Deleting " + del.length + " records");
    Promise.all(del).then(() => {
      console.log("Deleted " + del.length + " records");
      // Wait for create
      console.log("Adding " + initialTodos.length + " records");
      const add = initialTodos.map(it => dynamoDb.put({ TableName: tableName, Item: it }).promise());
      Promise.all(add).then(() => {
        res.json({ count: add.length });
      })
    })
  })
});

// List all records
app.get('/api/todo', function (req, res) {
  const params = {
    TableName: tableName
  }

  dynamoDb.scan(params, (error, result) => {
    if (error) {
      console.log('Failed to get records', error);
      res.status(500).json({ error: 'Failed to get records' });
      return;
    }

    if (result.Items && result.Items.length > 0) {
      const all = [];
      for (let i = 0; i < result.Items.length; i++) {
        const { id, title, completed } = result.Items[i];
        all[all.length] = { id, title, completed }; 
      }
      res.json(all);
    } else {
      res.json([]);
    }
  });
})

// Add new record
app.post('/api/todo', function (req, res) {
  let { id, title, completed } = req.body;
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'id must be a string: ' + JSON.stringify(req.body) });
    return;
  } else
  if (typeof title !== 'string') {
    res.status(400).json({ error: 'title must be a string: ' + JSON.stringify(req.body) });
    return;
  }

  completed = !!completed; // convert to boolean

  const params = {
    TableName: tableName,
    Item: {
      id, title, completed
    },
  };

  dynamoDb.put(params, (error, result) => {
    console.log('Got response to put', error, result);
    if (error) {
      console.log('Can`t add record: ' + JSON.stringify(params.Item), error);
      res.status(500).json({ error: 'Can`t add record: ' + JSON.stringify(params.Item) });
      return;
    }

    res.json({ id, title, completed });
  });
})

// Update existing record
app.post('/api/todo/:id', function (req, res) {
  let { id, title, completed } = req.body;
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'id must be a string: ' + JSON.stringify(req.body) });
    return;
  } else
  if (typeof title !== 'string') {
    res.status(400).json({ error: 'title must be a string: ' + JSON.stringify(req.body) });
    return;
  } else
  if (id !== req.params.id) {
    res.status(400).json({ error: 'id in body must match id in url' });
  }

  completed = !!completed; // convert to boolean

  const params = {
    TableName: tableName,
    Key: {
      id: req.params.id,
    },
    Item: {
      id, title, completed
    }
  }

  dynamoDb.put(params, (error, result) => {
    if (error) {
      console.log('Failed to update record id = ' + req.params.id, error);
      res.status(500).json({ error: 'Failed to update record id = ' + req.params.id });
      return;
    }

    res.json({ id, title, completed });
  });
})

app.get('/*', (req, res) => {
  const props = {}
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
  console.log('Hello Amazon!');
}

// Do something in serverless offline
if (process.env.IS_OFFLINE === 'true') {
  console.log('Hello offline!');
}

module.exports.serverless = serverless(app, {
  binary: headers => {
    let ct = headers['content-type'];
    if (ct === undefined) {
      console.error('No content-type header: ' + JSON.stringify(headers));
      return false;
    }
    // cut ; charset=UTF-8
    if (ct.indexOf(';') > 0) {
      ct = ct.substring(0, ct.indexOf(';'));
    }
    let binary = String(ct).match(/image\/.*/) ? true : false;
    console.log('Content-Type: ' + ct + ', binary: ' + binary);
    return binary;
  },

  request: function(request, event, context) {
    console.log(request);
  },

  response: function(response, event, context) {
    console.log(response);
  }
});

