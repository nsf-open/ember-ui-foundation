import { get } from '@ember/object';

/**
 * A Transform is a type of method that takes one type of value and turns it
 * into something else. In other words, it _transforms_ it. Yup. Several token
 * rules use transforms to change the raw string value from the query into
 * a more usable format, e.g. the string "true" being cast to the boolean true.
 */
type Transform = (a: string) => unknown;

/**
 * An Operation is a type of method that takes two arguments and compares them
 * in some way. The comparison and logical token rules define such operators to
 * perform the computation of what the token represents, e.g. the AND token has
 * an operator that will return the value of two arguments (a && b).
 */
type Operation = (a: unknown, b: unknown) => boolean;

/**
 * An Evaluation method is what we're trying to get out of all that is going on
 * here. Given a record, return true/false whether it meets the query  criteria.
 */
type Evaluation = (record: EvaluatedRecord) => boolean;

/**
 * An EvaluatedRecord is a generic type of object that is to be provided for
 * comparison against the query.
 */
type EvaluatedRecord = Record<string, unknown>;

/**
 * A SimpleToken is created for each matched TokenRule within a query string
 * as that query is tokenized. It's pretty basic info, but this is only the
 * first step in processing.
 */
export type SimpleToken = {
  name: TokenKeys;
  value: string;
  start: number;
  end: number;
};

/**
 * A TokenRule defines a single concept that is expressible within a query,
 * something like "AND". It describes the regex to recognize it, and some
 * bits on what it means or how it might be manipulated.
 */
export type TokenRule = {
  name: TokenKeys;
  category: TokenCategories;
  regex: string;
  transform?: Transform;
  operation?: Operation;
};

/**
 * Categories are more generalized buckets that each TokenRule falls into
 * so that rule descriptions don't get too unwieldy.
 */
export enum TokenCategories {
  Constant = 'Constant',
  Variable = 'Variable',
  Logical = 'Logical',
  Comparison = 'Comparison',
  Grouping = 'Grouping',
}

/**
 * The TokenKeys enumeration contains the names of all the special concepts
 * that can be expressed within a query.
 */
export enum TokenKeys {
  StringLiteral = 'StringLiteral',
  BooleanLiteral = 'BooleanLiteral',
  NumberLiteral = 'NumberLiteral',
  NullLiteral = 'NullLiteral',
  UndefinedLiteral = 'UndefinedLiteral',
  ColumnIdentifier = 'ColumnIdentifier',
  LogicalAnd = 'LogicalAnd',
  LogicalOr = 'LogicalOr',
  EqualsComparison = 'EqualsComparison',
  StartsWithComparison = 'StartsWithComparison',
  EndsWithComparison = 'EndsWithComparison',
  IncludesComparison = 'IncludesComparison',
  NotEqualToComparison = 'NotEqualToComparison',
  DoesNotStartWithComparison = 'DoesNotStartWithComparison',
  DoesNotEndWithComparison = 'DoesNotEndWithComparison',
  DoesNotIncludeComparison = 'DoesNotIncludeComparison',
  IsLessThanComparison = 'IsLessThanComparison',
  IsGreaterThanComparison = 'IsGreaterThanComparison',
  LeftParen = 'LeftParen',
  RightParen = 'RightParen',
}

/**
 * The TokenRules array holds all TokenRule definitions, one for each TokenKey.
 * An important thing to note here that order is important since the regex snippets
 * are evaluated as they appear. Put a more general rule before a more specific one,
 * and you're liable to get weird results.
 */
export const TokenRules: TokenRule[] = [
  {
    name: TokenKeys.StringLiteral,
    category: TokenCategories.Constant,
    regex: `"(?<${TokenKeys.StringLiteral}>(?:\\\\.|[^"\\\\])*)"`,
  },
  {
    name: TokenKeys.BooleanLiteral,
    category: TokenCategories.Constant,
    regex: `(?<${TokenKeys.BooleanLiteral}>true|false|TRUE|FALSE)`,

    transform(a) {
      return a.toLowerCase() === 'true';
    },
  },
  {
    name: TokenKeys.NumberLiteral,
    category: TokenCategories.Constant,
    regex: `(?<${TokenKeys.NumberLiteral}>[\\d,]+\\.?\\d+)`,

    transform(a) {
      return parseFloat(a.replace(/[^\d.]/g, ''));
    },
  },
  {
    name: TokenKeys.NullLiteral,
    category: TokenCategories.Constant,
    regex: `(?<${TokenKeys.NullLiteral}>null|NULL)`,

    transform() {
      return null;
    },
  },
  {
    name: TokenKeys.UndefinedLiteral,
    category: TokenCategories.Constant,
    regex: `(?<${TokenKeys.UndefinedLiteral}>undefined|UNDEFINED)`,

    transform() {
      return undefined;
    },
  },
  {
    name: TokenKeys.LogicalAnd,
    category: TokenCategories.Logical,
    regex: `(?<${TokenKeys.LogicalAnd}>AND)`,

    operation(a, b) {
      return !!(a && b);
    },
  },
  {
    name: TokenKeys.LogicalOr,
    category: TokenCategories.Logical,
    regex: `(?<${TokenKeys.LogicalOr}>OR)`,

    operation(a, b) {
      return !!(a || b);
    },
  },

  // EQUALS
  {
    name: TokenKeys.EqualsComparison,
    regex: `(?<${TokenKeys.EqualsComparison}>EQUALS)`,
    category: TokenCategories.Comparison,

    operation(a, b) {
      return a === b;
    },
  },

  // DOES NOT EQUAL
  {
    name: TokenKeys.NotEqualToComparison,
    regex: `(?<${TokenKeys.NotEqualToComparison}>DOES NOT EQUAL)`,
    category: TokenCategories.Comparison,

    operation(a, b) {
      return a !== b;
    },
  },

  // STARTS WITH
  {
    name: TokenKeys.StartsWithComparison,
    regex: `(?<${TokenKeys.StartsWithComparison}>STARTS WITH)`,
    category: TokenCategories.Comparison,

    operation(a, b) {
      return typeof a === 'string' && typeof b === 'string' ? a.startsWith(b) : false;
    },
  },

  // DOES NOT START WITH
  {
    name: TokenKeys.DoesNotStartWithComparison,
    regex: `(?<${TokenKeys.DoesNotStartWithComparison}>DOES NOT START WITH)`,
    category: TokenCategories.Comparison,

    operation(a, b) {
      return typeof a === 'string' && typeof b === 'string' ? !a.startsWith(b) : false;
    },
  },

  // ENDS WITH
  {
    name: TokenKeys.EndsWithComparison,
    regex: `(?<${TokenKeys.EndsWithComparison}>ENDS WITH)`,
    category: TokenCategories.Comparison,

    operation(a, b) {
      return typeof a === 'string' && typeof b === 'string' ? a.endsWith(b) : false;
    },
  },

  // DOES NOT END WITH
  {
    name: TokenKeys.DoesNotEndWithComparison,
    regex: `(?<${TokenKeys.DoesNotEndWithComparison}>DOES NOT END WITH)`,
    category: TokenCategories.Comparison,

    operation(a, b) {
      return typeof a === 'string' && typeof b === 'string' ? !a.endsWith(b) : false;
    },
  },

  // INCLUDES
  {
    name: TokenKeys.IncludesComparison,
    regex: `(?<${TokenKeys.IncludesComparison}>INCLUDES)`,
    category: TokenCategories.Comparison,

    operation(a, b) {
      if (Array.isArray(a)) {
        return a.includes(b);
      }

      // .indexOf has shown to be the fastest substring search across
      // several browsers. Who'd have thought, eh?
      return typeof a === 'string' && typeof b === 'string' ? a.indexOf(b) > -1 : false;
    },
  },

  // DOES NOT INCLUDE
  {
    name: TokenKeys.DoesNotIncludeComparison,
    regex: `(?<${TokenKeys.DoesNotIncludeComparison}>DOES NOT INCLUDE)`,
    category: TokenCategories.Comparison,

    operation(a, b) {
      if (Array.isArray(a)) {
        return !a.includes(b);
      }

      // .indexOf has shown to be the fastest substring search across
      // several browsers. Who'd have thought, eh?
      return typeof a === 'string' && typeof b === 'string' ? a.indexOf(b) <= -1 : false;
    },
  },

  // IS LESS THAN
  {
    name: TokenKeys.IsLessThanComparison,
    regex: `(?<${TokenKeys.IsLessThanComparison}>IS LESS THAN)`,
    category: TokenCategories.Comparison,

    operation(a, b) {
      return typeof a === 'number' && typeof b === 'number' ? a < b : false;
    },
  },

  // IS GREATER THAN
  {
    name: TokenKeys.IsGreaterThanComparison,
    regex: `(?<${TokenKeys.IsGreaterThanComparison}>IS GREATER THAN)`,
    category: TokenCategories.Comparison,

    operation(a, b) {
      return typeof a === 'number' && typeof b === 'number' ? a > b : false;
    },
  },

  // LEFT PARENTHESIS
  {
    name: TokenKeys.LeftParen,
    category: TokenCategories.Grouping,
    regex: `(?<${TokenKeys.LeftParen}>\\()`,
  },

  // RIGHT PARENTHESIS
  {
    name: TokenKeys.RightParen,
    category: TokenCategories.Grouping,
    regex: `(?<${TokenKeys.RightParen}>\\))`,
  },

  // COLUMN IDENTIFIER
  {
    name: TokenKeys.ColumnIdentifier,
    category: TokenCategories.Variable,
    regex: `(?<${TokenKeys.ColumnIdentifier}>[\\w._]+)`,

    transform(a) {
      return function resolveColumnIdentifier(record: EvaluatedRecord) {
        return get(record, a);
      };
    },
  },
];

/**
 * @class QueryParser
 */
export default class QueryParser {
  public regex: RegExp;

  constructor() {
    // Is RegExp capture group naming supported?
    // istanbul ignore next
    if (!/(?<char>A)/.exec('A')?.groups) {
      throw new Error('Advanced queries are not supported by this browser.');
    }

    this.regex = new RegExp(TokenRules.map((rule) => rule.regex).join('|'), 'g');
  }

  /**
   * @method evaluate
   */
  public evaluate(query: string): Evaluation {
    return this.recurseEvalNode(this.tokenize(query.trim()));
  }

  /**
   * Breaks apart the query string into an array of SimpleToken objects.
   *
   * @method tokenize
   */
  public tokenize(query: string): SimpleToken[] {
    const tokens: SimpleToken[] = [];

    let sentinel = query.length;
    let match = this.regex.exec(query);

    try {
      while (match && sentinel > 0) {
        const start = match.index;
        const end = start + match[0].length - 1;
        const groups = match.groups as Record<string, string>;
        const [name, value] = Object.entries(groups).find(([, value]) => !!value) as [
          TokenKeys,
          string
        ];

        // FIXME The previous line fails when dealing with an empty sting literal "".
        //   The match group does exist, and the empty string is properly captured,
        //   but the use of Object.entries fails with an exception that groups cannot
        //   be iterated on. Very odd.

        tokens.push({ name, value, start, end });

        sentinel = sentinel - 1;
        match = this.regex.exec(query);
      }
    } catch (e) {
      this.regex.lastIndex = 0;
      throw new Error('Query cannot be parsed.');
    }

    if (sentinel === 0 || tokens.length === 0) {
      this.regex.lastIndex = 0;
      throw new Error('Query cannot be parsed.');
    }

    this.regex.lastIndex = 0;
    return tokens;
  }

  /**
   * @method buildEvalTree
   */
  protected recurseEvalNode(tokens: SimpleToken[], prevToken?: SimpleToken): Evaluation {
    /*
     * Check for a sub-expression.
     */
    if (tokens[0]?.name === TokenKeys.LeftParen) {
      const subset = this.extractTokenSequence(tokens, TokenKeys.LeftParen, TokenKeys.RightParen);

      if (!subset) {
        throw new SyntaxError(
          `The sub-expression beginning at position ${tokens[0].start} does not have a closing brace.`
        );
      }

      /*
       * Possible continuation with AND/OR. The extraction above chops off the parenthesis tokens for
       * convenience, so adding two here gets us back to where the next token might be.
       */
      const continueIdx = subset.length + 2;

      if (tokens[continueIdx]) {
        const logicalExpression = this.evaluateToken(tokens[continueIdx], tokens[continueIdx - 1], [
          TokenCategories.Logical,
        ]);
        const logicalOperation = logicalExpression.operation as Operation;

        return this.createEvaluationFunction(
          this.recurseEvalNode(subset, tokens[0]),
          logicalOperation,
          this.recurseEvalNode(tokens.slice(continueIdx + 1), tokens[continueIdx])
        );
      }

      return this.recurseEvalNode(subset, tokens[0]);
    }

    /*
     * The left side of the operation should always be a constant or variable
     */
    const leftRule = this.evaluateToken(tokens[0], prevToken, [
      TokenCategories.Constant,
      TokenCategories.Variable,
    ]);
    const leftValue = leftRule.transform ? leftRule.transform(tokens[0].value) : tokens[0].value;

    /*
     * The operation should always be a comparison of some sort
     */
    const operationRule = this.evaluateToken(tokens[1], tokens[0], [TokenCategories.Comparison]);
    const operationValue = operationRule.operation as Operation;

    /*
     * The right side of the operation should always be a constant or variable
     */
    const rightRule = this.evaluateToken(tokens[2], tokens[1], [
      TokenCategories.Constant,
      TokenCategories.Variable,
    ]);
    const rightValue = rightRule.transform ? rightRule.transform(tokens[2].value) : tokens[2].value;

    /*
     * Possible continuation with AND/OR
     */
    if (tokens[3]) {
      const logicalExpression = this.evaluateToken(tokens[3], tokens[2], [TokenCategories.Logical]);
      const logicalOperation = logicalExpression.operation as Operation;

      return this.createEvaluationFunction(
        this.createEvaluationFunction(leftValue, operationValue, rightValue),
        logicalOperation,
        this.recurseEvalNode(tokens.slice(4), tokens[3])
      );
    }

    return this.createEvaluationFunction(leftValue, operationValue, rightValue);
  }

  /**
   * @method getTokenRule
   * @protected
   */
  protected getTokenRule(name: TokenKeys): TokenRule {
    return TokenRules.find((rule) => rule.name === name) as TokenRule;
  }

  /**
   * @method getTokenRulesByCategory
   * @protected
   */
  protected getTokenRulesByCategory(category: TokenCategories): TokenRule[] {
    return TokenRules.filter((rule) => rule.category === category).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  /**
   * @method evaluateToken
   * @protected
   */
  protected evaluateToken(
    token: SimpleToken,
    prevToken?: SimpleToken,
    validCategories?: Array<TokenCategories>,
    validKeys?: Array<TokenKeys>
  ): TokenRule {
    let validTypes = validKeys || [];

    if (validCategories) {
      validCategories.forEach((category) => {
        validTypes = validTypes.concat(
          this.getTokenRulesByCategory(category).map((rule) => rule.name)
        );
      });
    }

    if (!token) {
      throw new SyntaxError(this.createMissingTokenMessage(prevToken || 0, validTypes));
    }

    const rule = this.getTokenRule(token.name);

    if (!validTypes.includes(rule.name)) {
      throw new SyntaxError(this.createInvalidTokenMessage(token, prevToken || 0, validTypes));
    }

    return rule;
  }

  /**
   * @method extractTokenSequence
   * @protected
   */
  protected extractTokenSequence(
    tokens: SimpleToken[],
    start: TokenKeys,
    end: TokenKeys
  ): SimpleToken[] | undefined {
    const startIdx = tokens[0].name === start ? 1 : 0;

    let depth = 1;
    let endIdx = 0;

    for (let i = startIdx; i < tokens.length; i += 1) {
      if (tokens[i].name === start) {
        depth += 1;
      } else if (tokens[i].name === end) {
        depth -= 1;

        if (depth === 0) {
          endIdx = i;
          break;
        }
      }
    }

    return depth === 0 ? tokens.slice(startIdx, endIdx) : undefined;
  }

  /**
   * Returns a function that will pass the `left` and `right` arguments through the `operand`
   * and return the result.
   *
   * @method createEvaluationFunction
   * @protected
   */
  protected createEvaluationFunction(
    left: unknown,
    operand: Operation,
    right: unknown
  ): Evaluation {
    return function queryEvaluation(record: EvaluatedRecord) {
      return operand(
        typeof left === 'function' ? left(record) : left,
        typeof right === 'function' ? right(record) : right
      );
    };
  }

  /**
   * @method createMissingTokenMessage
   * @protected
   */
  protected createMissingTokenMessage(
    prevTokenOrIndex: SimpleToken | number,
    expectedTypes: Array<string>
  ): string {
    const msgPrefix =
      expectedTypes.length === 1
        ? `A ${expectedTypes[0]} was expected`
        : `A ${expectedTypes.slice(0, -1).join(', ')} or ${
            expectedTypes[expectedTypes.length - 1]
          } was expected`;

    const msgSuffix =
      typeof prevTokenOrIndex === 'number'
        ? ` beginning at position ${prevTokenOrIndex}.`
        : ` after "${prevTokenOrIndex.value}", beginning at position ${prevTokenOrIndex.end + 2}.`;

    return `${msgPrefix} ${msgSuffix}`;
  }

  /**
   * @method createInvalidTokenMessage
   * @protected
   */
  protected createInvalidTokenMessage(
    token: SimpleToken,
    prevTokenOrIndex: SimpleToken | number,
    expectedTypes: Array<string>
  ): string {
    return `Unexpected value "${token.value}". ${this.createMissingTokenMessage(
      prevTokenOrIndex,
      expectedTypes
    )}`;
  }
}
