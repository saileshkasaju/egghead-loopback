'use strict';

module.exports = function(Product) {
  
  Product.observe('before save', function(ctx, next) {
    if (ctx.instance && ctx.instance.categoryId) {
      return Product.app.models.Category
      .count({ id: ctx.instance.categoryId })
      .then(res => {
        if (res < 1) {
          return Promise.reject('Error adding product to existing category')
        }
      })
    }
    return next();
  });
  
  /**
  * Return true if input is a positive integer
  * @param {number} quantity Number to validate 
  **/
  const positiveInteger = /^[0-9]*$/;
  const validQuantity = quantity =>
   // Boolean(quantity > 0) &&
   positiveInteger.test(quantity);

  /**
   * Buy this product
   * @param {number} quantity Number of products
   * @param {Function(Error, object)} callback
   */
  Product.prototype.buy = function(quantity, callback) {
    if (!validQuantity(quantity)) {
      return callback(`Invalid quantity ${quantity}`);
    }
    var result = {
      status: `You bought ${quantity} product(s)`,
    };
    // TODO
    callback(null, result);
  };

  // Validate minimal length of name
  Product.validatesLengthOf('name', {
    min: 3,
    message: {
      min: 'Name should be at least 3 characters',
    },
  });

  // Validate the name to be unique
  Product.validatesUniquenessOf('name');

  // Validate price to be positive integer
  const validatePositiveInteger = function(err) {
    if (!positiveInteger.test(this.price)) {
      err();
    }
  };

  Product.validate('price', validatePositiveInteger, {
    message: 'Price should be a positive integer',
  });

  // async Validation
  function validateMinimalPrice(err, done) {
    const price = this.price;

    process.nextTick(() => {
      const minimalPriceFromDB = 99;
      if (price < minimalPriceFromDB) {
        err();
      }
      done();
    });
  };

  Product.validateAsync('price', validateMinimalPrice, {
    message: 'Price should be higher than the minimal price in the DB',
  });
};
