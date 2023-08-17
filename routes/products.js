const express = require('express');
const router = express.Router();

const products = 'products';

module.exports = function (db) {
  router
    .route(`/${products}`)
    .get((req, res) => {
      res.send(db.get(products).value());
    })
    .post((req, res) => {
      const newProduct = req.body;
      res.send(db.get(products).insert(newProduct).write());
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

[
  {
    'name': 'Essential Backpack',
    'price': 259.99,
    'quantity': 5,
    'color': 'orange',
    'id': '0124081a-4daa-425a-bb40-d5c016893fe3',
    'description':
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue. Risus quis varius quam quisque. Quis risus sed vulputate odio. Ultrices eros in cursus turpis. Est velit egestas dui id ornare arcu. Sem fringilla ut morbi tincidunt augue interdum velit euismod. Dictumst quisque sagittis purus sit amet volutpat. Sed libero enim sed faucibus turpis in eu. Dui vivamus arcu felis bibendum ut tristique et egestas.',
  },
  {
    'name': 'Rugged Hiking Boots',
    'price': 59.99,
    'quantity': 25,
    'id': '59ca6ff2-7af1-4ebb-b1a4-2e6c14488c52',
  },
];
