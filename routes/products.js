const express = require('express');
const router = express.Router();
const qs = require('qs');

const products = 'products';

module.exports = function (db) {
  router
    .route(`/${products}`)
    .get((req, res) => {
      res.send(db.get(products).value());
    })
    .post((req, res) => {
      const newProduct = req.body;
      const errors = [];
      if (!newProduct.name) {
        errors.push({
          field: 'name',
          error: 'required',
          message: 'Name is Required',
        });
      }

      if (newProduct.price && isNaN(Number(newProduct.price))) {
        errors.push({
          field: 'price',
          error: 'type',
          message: 'Price must be a number',
        });
      }

      if (newProduct.name > 25) {
        errors.push({
          field: 'name',
          error: 'length',
          message: 'Name cannot be longer than 25 characters',
        });
      }

      const allowedColors = ['red', 'blue', 'orange', 'black', 'brown', '', null, undefined];
      if (!allowedColors.some((i) => i === newProduct.color)) {
        errors.push({
          field: 'color',
          error: 'allowedValue',
          message: 'Must be one of the following colors: red, blue, orange, black, brown, or null',
        });
      }

      if (errors.length) {
        res.status(400).send(errors);
      } else {
        res.send(db.get(products).insert(newProduct).write());
      }
    });

  router.route('/products/search').get((req, res) => {
    const keywords = String(req.query.keywords.toLowerCase());
    const result = db.get('products').filter((_) => {
      const fullText =
        String(_.description).toLowerCase() + String(_.name).toLowerCase() + String(_.color).toLowerCase();
      return fullText.indexOf(keywords) !== -1;
    });

    res.send(result);
  });

  router.route('/products/detailSearch').get((req, res) => {
    const query = qs.parse(req.query);
    const results = db.get('products').filter((_) => {
      return Object.keys(query).reduce((found, key) => {
        {
          const obj = query[key];
          switch (obj.op) {
            case 'lt':
              found = found && _[key] < obj.val;
              break;
            case 'eq':
              found = found && _[key] === obj.val;
              break;
            default:
              found = found && String(_[key]).toLowerCase().indexOf(String(obj.val).toLowerCase()) !== -1;
              break;
          }
          return found;
        }
      }, true);
    });
    res.send(results);
  });

  router
    .route(`/${products}/:id`)
    .get((req, res) => {
      const result = db.get(products).find({ id: req.params.id }).value();
      if (result) {
        res.send(result);
      } else {
        res.status(404).send();
      }
    })
    .patch((req, res) => {
      res.send(db.get(products).find({ id: req.params.id }).assign(req.body).write());
    })
    .delete((req, res) => {
      db.get(products).remove({ id: req.params.id }).write();
      res.status(204).send();
    });

  return router;
};
