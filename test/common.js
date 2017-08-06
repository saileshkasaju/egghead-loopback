'use strict';

const chai = require('chai');
const supertest = require('supertest');

const expect = chai.expect;
const app = require('../server/server');
const request = supertest(app)

module.exports = {
  app,
  expect,
  request,
};
