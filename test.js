'use strict';

require('mocha');
var assert = require('assert');
var isPosixBracket = require('./');

describe('isPosixBracket', function() {
  it('should not match non-character classes:', function() {
    assert.equal(isPosixBracket('foo[[lower:]]bar'), false);
    assert.equal(isPosixBracket('foo[[lower]]bar'), false);
  });

  it('should not match imbalanced character classes:', function() {
    assert.equal(isPosixBracket('foo[:[lower:]]bar'), false);
    assert.equal(isPosixBracket('foo[:[:lower]]bar'), false);
    assert.equal(isPosixBracket('foo[:[:lower]]:bar'), false);
    // this one's a maybe
    assert.equal(isPosixBracket('foo[:[:lower]:]bar'), false);
  });

  it('should match character classes:', function() {
    assert.equal(isPosixBracket('foo[:[:lower:]:]bar'), true);
    assert.equal(isPosixBracket('foo[[:lower:]]bar'), true);
    assert.equal(isPosixBracket('foo[[:lower:][:upper:]]bar'), true);
    assert.equal(isPosixBracket('[[:alpha:]123]'), true);
    assert.equal(isPosixBracket('[[:lower:]]'), true);
    assert.equal(isPosixBracket('[![:lower:]]'), true);
    assert.equal(isPosixBracket('[[:digit:][:upper:][:space:]]'), true);
    assert.equal(isPosixBracket('[[:xdigit:]]'), true);
    assert.equal(isPosixBracket('[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:graph:][:lower:][:print:][:punct:][:space:][:upper:][:xdigit:]]'), true);
    assert.equal(isPosixBracket('[^[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]'), true);
    assert.equal(isPosixBracket('[a-c[:digit:]x-z]'), true);
    assert.equal(isPosixBracket('[:al:]'), true);
    assert.equal(isPosixBracket('[abc[:punct:][0-9]'), true);
  });

  it('should return `true` when the pattern matches:', function() {
    assert.equal(isPosixBracket('[[:lower:]]'), true);
    assert.equal(isPosixBracket('[[:upper:]]'), true);
    assert.equal(isPosixBracket('[[:digit:][:upper:][:space:]]'), true);
    assert.equal(isPosixBracket('[[:digit:][:upper:][:space:]]'), true);
    assert.equal(isPosixBracket('[[:digit:][:upper:][:space:]]'), true);
    assert.equal(isPosixBracket('[[:xdigit:]]'), true);
    assert.equal(isPosixBracket('[[:xdigit:]]'), true);
    assert.equal(isPosixBracket('[[:xdigit:]]'), true);
    assert.equal(isPosixBracket('[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:graph:][:lower:][:print:][:punct:][:space:][:upper:][:xdigit:]]'), true);
    assert.equal(isPosixBracket('[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:graph:][:lower:][:print:][:punct:][:space:][:upper:][:xdigit:]]'), true);
    assert.equal(isPosixBracket('[^[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]'), true);
    assert.equal(isPosixBracket('[a-c[:digit:]x-z]'), true);
    assert.equal(isPosixBracket('[a-c[:digit:]x-z]'), true);
    assert.equal(isPosixBracket('[a-c[:digit:]x-z]'), true);
  });

  it('should return `false` when the pattern does not match:', function() {
    assert.equal(isPosixBracket('[[:lower:]]'), true);
    assert.equal(isPosixBracket('[![:lower:]]'), true);
    assert.equal(isPosixBracket('[[:upper:]]'), true);
    assert.equal(isPosixBracket('[[:digit:][:upper:][:space:]]'), true);
    assert.equal(isPosixBracket('[[:digit:][:upper:][:space:]]'), true);
    assert.equal(isPosixBracket('[[:alnum:][:alpha:][:blank:][:cntrl:][:digit:][:lower:][:space:][:upper:][:xdigit:]]'), true);
    assert.equal(isPosixBracket('[a-c[:digit:]x-z]'), true);
    assert.equal(isPosixBracket('[[:alpha:]][[:digit:]][[:upper:]]'), true);
    assert.equal(isPosixBracket('[[:digit:][:punct:][:space:]]'), true);
  });
});

describe('POSIX: From the test suite for the POSIX.2 (BRE) pattern matching code:', function() {
  it('First, test POSIX.2 character classes', function() {
    assert.equal(isPosixBracket('[[:xdigit:]]'), true);
    assert.equal(isPosixBracket('[[:xdigit:]]'), true);
    assert.equal(isPosixBracket('[[:alpha:]123]'), true);
    assert.equal(isPosixBracket('[[:alpha:]123]'), true);
  });

  it('should match with POSIX.2 negation patterns', function() {
    assert.equal(isPosixBracket('[![:alpha:]]'), true);
  });

  it('invalid character class expressions are just characters to be matched', function() {
    assert.equal(isPosixBracket('[:al:]'), true);
    assert.equal(isPosixBracket('[[:al:]'), true);
    assert.equal(isPosixBracket('[abc[:punct:][0-9]'), true);
  });

  it('should match the start of a valid sh identifier', function() {
    assert.equal(isPosixBracket('[_[:alpha:]]*'), true);
  });

  it('how about A?', function() {
    assert.equal(isPosixBracket('[[:digit:]]'), true);
    assert.equal(isPosixBracket('[[:digit:]]'), true);
    assert.equal(isPosixBracket('[[:lower:]][[:upper:]]'), true);
    assert.equal(isPosixBracket('[_[:alpha:]][_[:alnum:]][_[:alnum:]]*'), true);
    assert.equal(isPosixBracket('[[:alpha:][:digit:]]'), true);
    assert.equal(isPosixBracket('[[:alpha:]\\]'), true);
  });

  it('OK, what\'s a tab?  is it a blank? a space?', function() {
    assert.equal(isPosixBracket('[[:blank:]]'), true);
    assert.equal(isPosixBracket('[[:space:]]'), true);
    assert.equal(isPosixBracket('[[:space:]]'), true);
  });

  it('let\'s check out characters in the ASCII range', function() {
    assert.equal(isPosixBracket('[[:ascii:]]'), true);
    assert.equal(isPosixBracket('[1[:alpha:]123]'), true);
  });

  it('punctuation', function() {
    assert.equal(isPosixBracket('[[:punct:]]'), true);
  });

  it('graph', function() {
    assert.equal(isPosixBracket('[[:graph:]]'), true);
    assert.equal(isPosixBracket('[[:graph:]]'), true);
    assert.equal(isPosixBracket('[[:graph:]]'), true);
    assert.equal(isPosixBracket('[[:graph:]]'), true);
  });

  it('and finally, test POSIX.2 equivalence classes', function() {
    assert.equal(isPosixBracket('[[:alpha:]][[=b=]][[:ascii:]]'), true);
    assert.equal(isPosixBracket('[[:alpha:]][[=B=]][[:ascii:]]'), true);
  });

  it('an incomplete equiv class is just a string', function() {
    assert.equal(isPosixBracket('[[=b=]'), true);
    assert.equal(isPosixBracket('[=b=]]'), true);
  });
});
