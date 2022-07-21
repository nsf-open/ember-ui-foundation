import type { TokenRule } from '@nsf-open/ember-ui-foundation/lib/QueryParser';
import QueryParser, { TokenKeys, TokenRules } from '@nsf-open/ember-ui-foundation/lib/QueryParser';
import { module, test } from 'qunit';

function getTokenRule(name: TokenKeys) {
  return TokenRules.find((rule) => rule.name === name) as TokenRule;
}

function testOperation(
  assert: Assert,
  name: TokenKeys,
  expect: ['true' | 'false', unknown, unknown][]
) {
  const rule = TokenRules.find((rule) => rule.name === name) as TokenRule;

  for (let i = 0; i < expect.length; i += 1) {
    const [testFn, left, right] = expect[i];
    assert[testFn](rule.operation?.(left, right), `${rule.name}(${left}, ${right}); // ${testFn}`);
  }
}

module('Unit | Lib | QueryParser', function () {
  // const recordA = {
  //   name: 'John Doe',
  //   isAdmin: false,
  //   age: 42,
  //   expiration: null,
  //   permissions: ['read', 'write'],
  //   nickname: 'Goose',
  // };
  //
  // const recordB = {
  //   name: 'Jane Dae',
  //   isAdmin: true,
  //   age: 34,
  //   permissions: ['log'],
  //   nickname: 'Maverick',
  // };
  //
  // const recordC = {
  //   name: 'Tom John',
  //   isAdmin: true,
  //   age: '34',
  //   expiration: '01/01/1970',
  //   nickname: 'Tom John',
  // };
  //
  // const recordSet = [recordA, recordB, recordC];

  // test('it creates a filter function based on a crafted string query', function (assert) {
  //   assert.expect(21);
  //
  //   const parser = new QueryParser();
  //
  //   function testQuery(query: string, expect: unknown[]) {
  //     assert.deepEqual(
  //       recordSet.filter(parser.evaluate(query)),
  //       expect,
  //       `The query - ${query} - returned ${expect.length} record(s)`
  //     );
  //   }
  //
  //   assert.throws(() => parser.evaluate(''), 'It throws on an empty string');
  //   assert.throws(() => parser.evaluate('name EQU'), 'It throws on an incomplete query');
  //   assert.throws(
  //     () => parser.evaluate('(name EQUALS "Bob"'),
  //     'It throws on an unclosed parenthesis'
  //   );
  //
  //   testQuery('foo EQUALS "bar"', []);
  //   testQuery('foo EQUALS bar', [recordA, recordB, recordC]);
  //   testQuery('name EQUALS nickname', [recordC]);
  //   testQuery('name EQUALS "John Doe"', [recordA]);
  //   testQuery('name STARTS WITH "Jane"', [recordB]);
  //   testQuery('name ENDS WITH "ohn"', [recordC]);
  //   testQuery('name INCLUDES " D"', [recordA, recordB]);
  //   testQuery('permissions INCLUDES "write"', [recordA]);
  //   testQuery('isAdmin EQUALS true', [recordB, recordC]);
  //   testQuery('isAdmin EQUALS false', [recordA]);
  //   testQuery('expiration EQUALS null', [recordA]);
  //   testQuery('expiration EQUALS undefined', [recordB]);
  //   testQuery('age EQUALS 34', [recordB]);
  //   testQuery('age EQUALS 34 OR age EQUALS 42', [recordA, recordB]);
  //   testQuery('isAdmin EQUALS true AND name STARTS WITH "Tom"', [recordC]);
  //   testQuery('(isAdmin EQUALS true)', [recordB, recordC]);
  //   testQuery('(isAdmin EQUALS true) AND (name STARTS WITH "Tom")', [recordC]);
  //   testQuery('(isAdmin EQUALS true AND name STARTS WITH "Tom") OR nickname EQUALS "Maverick"', [
  //     recordB,
  //     recordC,
  //   ]);
  // });

  test('AND operator', function (assert) {
    assert.expect(4);

    testOperation(assert, TokenKeys.LogicalAnd, [
      ['true', true, true],
      ['false', false, true],
      ['false', true, false],
      ['false', false, false],
    ]);
  });

  test('OR operator', function (assert) {
    assert.expect(4);

    testOperation(assert, TokenKeys.LogicalOr, [
      ['true', true, true],
      ['true', false, true],
      ['true', true, false],
      ['false', false, false],
    ]);
  });

  test('EQUALS comparison', function (assert) {
    assert.expect(7);

    testOperation(assert, TokenKeys.EqualsComparison, [
      ['true', 1, 1],
      ['true', 'a', 'a'],
      ['true', true, true],
      ['true', false, false],
      ['false', 1, 2],
      ['false', 'a', 'b'],
      ['false', true, false],
    ]);
  });

  test('DOES NOT EQUAL comparison', function (assert) {
    assert.expect(7);

    testOperation(assert, TokenKeys.NotEqualToComparison, [
      ['false', 1, 1],
      ['false', 'a', 'a'],
      ['false', true, true],
      ['false', false, false],
      ['true', 1, 2],
      ['true', 'a', 'b'],
      ['true', true, false],
    ]);
  });

  test('STARTS WITH comparison', function (assert) {
    const rule = getTokenRule(TokenKeys.StartsWithComparison);

    assert.true(rule.operation?.('Hello World', 'Hello'));

    assert.false(rule.operation?.('Hello World', 'World'));
    assert.false(rule.operation?.('Hello World', 1));
    assert.false(rule.operation?.(1, 'Hello'));
    assert.false(rule.operation?.(1, 1));
  });

  test('DOES NOT START WITH comparison', function (assert) {
    const rule = getTokenRule(TokenKeys.DoesNotStartWithComparison);

    assert.true(rule.operation?.('Hello World', 'World'));

    assert.false(rule.operation?.('Hello World', 'Hello'));
    assert.false(rule.operation?.('Hello World', 1));
    assert.false(rule.operation?.(1, 'Hello'));
    assert.false(rule.operation?.(1, 1));
  });

  test('ENDS WITH comparison', function (assert) {
    const rule = getTokenRule(TokenKeys.EndsWithComparison);

    assert.true(rule.operation?.('Hello World', 'World'));

    assert.false(rule.operation?.('Hello World', 'Hello'));
    assert.false(rule.operation?.('Hello World', 1));
    assert.false(rule.operation?.(1, 'Hello'));
    assert.false(rule.operation?.(1, 1));
  });

  test('DOES NOT END WITH comparison', function (assert) {
    const rule = getTokenRule(TokenKeys.DoesNotEndWithComparison);

    assert.true(rule.operation?.('Hello World', 'Hello'));

    assert.false(rule.operation?.('Hello World', 'World'));
    assert.false(rule.operation?.('Hello World', 1));
    assert.false(rule.operation?.(1, 'Hello'));
    assert.false(rule.operation?.(1, 1));
  });

  test('INCLUDES comparison', function (assert) {
    const rule = getTokenRule(TokenKeys.IncludesComparison);

    assert.true(rule.operation?.('Hello World', 'llo W'));
    assert.true(rule.operation?.(['Hello', 'World'], 'World'));

    assert.false(rule.operation?.('Hello World', 'Foo'));
    assert.false(rule.operation?.(['Hello', 'World'], 'Bar'));
    assert.false(rule.operation?.('Hello World', 1));
    assert.false(rule.operation?.(1, 'Hello'));
    assert.false(rule.operation?.(1, 1));
  });

  test('DOES NOT INCLUDE comparison', function (assert) {
    const rule = getTokenRule(TokenKeys.DoesNotIncludeComparison);

    assert.true(rule.operation?.('Hello World', 'Foo'));
    assert.true(rule.operation?.(['Hello', 'World'], 'Bar'));

    assert.false(rule.operation?.('Hello World', 'llo W'));
    assert.false(rule.operation?.(['Hello', 'World'], 'World'));
    assert.false(rule.operation?.('Hello World', 1));
    assert.false(rule.operation?.(1, 'Hello'));
    assert.false(rule.operation?.(1, 1));
  });

  test('IS LESS THAN comparison', function (assert) {
    const rule = getTokenRule(TokenKeys.IsLessThanComparison);

    assert.true(rule.operation?.(1, 2));

    assert.false(rule.operation?.(2, 1));
    assert.false(rule.operation?.('foo', 2));
    assert.false(rule.operation?.(1, 'bar'));
    assert.false(rule.operation?.('foo', 'bar'));
  });

  test('IS GREATER THAN comparison', function (assert) {
    const rule = getTokenRule(TokenKeys.IsGreaterThanComparison);

    assert.true(rule.operation?.(2, 1));

    assert.false(rule.operation?.(1, 2));
    assert.false(rule.operation?.('foo', 2));
    assert.false(rule.operation?.(1, 'bar'));
    assert.false(rule.operation?.('foo', 'bar'));
  });

  test('tokenize()', function (assert) {
    const parser = new QueryParser();

    function testTokenizer(query: string, expected: TokenKeys[]) {
      const tokens = parser.tokenize(query);

      assert.deepEqual(
        tokens.map((item) => item.name),
        expected,
        expected.join(' -> ')
      );

      return tokens;
    }

    testTokenizer('name EQUALS "Bob"', [
      TokenKeys.ColumnIdentifier,
      TokenKeys.EqualsComparison,
      TokenKeys.StringLiteral,
    ]);

    testTokenizer('(name EQUALS "Bob")', [
      TokenKeys.LeftParen,
      TokenKeys.ColumnIdentifier,
      TokenKeys.EqualsComparison,
      TokenKeys.StringLiteral,
      TokenKeys.RightParen,
    ]);

    testTokenizer('age DOES NOT EQUAL 42', [
      TokenKeys.ColumnIdentifier,
      TokenKeys.NotEqualToComparison,
      TokenKeys.NumberLiteral,
    ]);

    testTokenizer('age DOES NOT EQUAL 42', [
      TokenKeys.ColumnIdentifier,
      TokenKeys.NotEqualToComparison,
      TokenKeys.NumberLiteral,
    ]);
  });
});
