process.env.TS_NODE_TRANSPILE_ONLY = 'true'
process.env.TS_NODE_PROJECT = 'tsconfig.node.json'
process.env.NODE_ENV = 'test'
const register = require('@babel/register').default
register({extensions: ['.ts', '.tsx', '.js', '.jsx']})
const chai = require('chai')

// add global expect
global.expect = chai.expect
