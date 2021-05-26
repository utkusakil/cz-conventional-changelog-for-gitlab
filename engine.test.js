var chai = require('chai');
var chalk = require('chalk');
var engine = require('./engine');
var mock = require('mock-require');
var semver = require('semver');

var types = require('conventional-commit-types').types;

var expect = chai.expect;
chai.should();

var defaultOptions = {
  types,
  maxLineWidth: 100,
  maxHeaderWidth: 100
};

var type = 'func';
var scope = 'everything';
var subject = 'testing123';
var longBody =
  'a a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a' +
  'a a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a' +
  'a a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a';
var longBodySplit =
  longBody.slice(0, defaultOptions.maxLineWidth).trim() +
  '\n' +
  longBody
    .slice(defaultOptions.maxLineWidth, 2 * defaultOptions.maxLineWidth)
    .trim() +
  '\n' +
  longBody.slice(defaultOptions.maxLineWidth * 2, longBody.length).trim();
var body = 'A quick brown fox jumps over the dog';
var issues = '#12';
var multipleIssues = '#1 #14';
var issuesWithProject = 'project#12';
var invalidIssues = '1';
var breakingChange = 'BREAKING CHANGE: ';
var breaking = 'asdhdfkjhbakjdhjkashd adhfajkhs asdhkjdsh ahshd';

describe('commit message', function() {
  it('only header w/ out scope', function() {
    expect(
      commitMessage({
        type,
        subject
      })
    ).to.equal(`${type}: ${subject}`);
  });
  it('only header w/ scope', function() {
    expect(
      commitMessage({
        type,
        scope,
        subject
      })
    ).to.equal(`${type}(${scope}): ${subject}`);
  });
  it('header and body w/ out scope', function() {
    expect(
      commitMessage({
        type,
        subject,
        body
      })
    ).to.equal(`${type}: ${subject}\n\n${body}`);
  });
  it('header and body w/ scope', function() {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body
      })
    ).to.equal(`${type}(${scope}): ${subject}\n\n${body}`);
  });
  it('header and body w/ uppercase scope', function() {
    var upperCaseScope = scope.toLocaleUpperCase();
    expect(
      commitMessage(
        {
          type,
          scope: upperCaseScope,
          subject,
          body
        },
        {
          ...defaultOptions,
          disableScopeLowerCase: true
        }
      )
    ).to.equal(`${type}(${upperCaseScope}): ${subject}\n\n${body}`);
  });
  it('header and body w/ uppercase subject', function() {
    var upperCaseSubject = subject.toLocaleUpperCase();
    expect(
      commitMessage(
        {
          type,
          scope,
          subject: upperCaseSubject,
          body
        },
        {
          ...defaultOptions,
          disableSubjectLowerCase: true
        }
      )
    ).to.equal(`${type}(${scope}): ${upperCaseSubject}\n\n${body}`);
  });
  it('header, body and issues w/ out scope', function() {
    expect(
      commitMessage({
        type,
        issues,
        subject,
        body
      })
    ).to.equal(`${issues} ${type}: ${subject}\n\n${body}`);
  });
  it('header, body and issues w/ scope', function() {
    expect(
      commitMessage({
        type,
        issues,
        scope,
        subject,
        body
      })
    ).to.equal(`${issues} ${type}(${scope}): ${subject}\n\n${body}`);
  });
  it('header, body and multiple issues w/ out scope', function() {
    expect(
      commitMessage({
        type,
        subject,
        body,
        issues: multipleIssues
      })
    ).to.equal(`${multipleIssues} ${type}: ${subject}\n\n${body}`);
  });
  it('header, body and multiple issues w/ scope', function() {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body,
        issues: multipleIssues
      })
    ).to.equal(
      `${multipleIssues} ${type}(${scope}): ${subject}\n\n${body}`
    );
  });
  it('header and long body w/ out scope', function() {
    expect(
      commitMessage({
        type,
        subject,
        body: longBody
      })
    ).to.equal(`${type}: ${subject}\n\n${longBodySplit}`);
  });
  it('header and long body w/ scope', function() {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody
      })
    ).to.equal(`${type}(${scope}): ${subject}\n\n${longBodySplit}`);
  });
  it('header, long body and issues w/ out scope', function() {
    expect(
      commitMessage({
        type,
        subject,
        body: longBody,
        issues
      })
    ).to.equal(`${issues} ${type}: ${subject}\n\n${longBodySplit}`);
  });
  it('header, long body and issues w/ scope', function() {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        issues
      })
    ).to.equal(
      `${issues} ${type}(${scope}): ${subject}\n\n${longBodySplit}`
    );
  });
  it('header, long body and multiple issues w/ out scope', function() {
    expect(
      commitMessage({
        type,
        subject,
        body: longBody,
        issues: multipleIssues
      })
    ).to.equal(`${multipleIssues} ${type}: ${subject}\n\n${longBodySplit}`);
  });
  it('header, long body and issues with project w/ scope', function() {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        issues: issuesWithProject
      })
    ).to.equal(
      `${issuesWithProject} ${type}(${scope}): ${subject}\n\n${longBodySplit}`
    );
  });
  it('header, long body, breaking change, and multiple issues w/ scope', function() {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        breaking,
        issues: multipleIssues
      })
    ).to.equal(
      `${multipleIssues} ${type}(${scope}): ${subject}\n\n${longBodySplit}\n\n${breakingChange}${breaking}`
    );
  });
  it('header, long body, breaking change (with prefix entered), and issues with project w/ scope', function() {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        breaking: `${breakingChange}${breaking}`,
        issues: issuesWithProject
      })
    ).to.equal(
      `${issuesWithProject} ${type}(${scope}): ${subject}\n\n${longBodySplit}\n\n${breakingChange}${breaking}`
    );
  });
});

describe('validation', function() {
  it('subject exceeds max length', function() {
    expect(() =>
      commitMessage({
        type,
        scope,
        subject: longBody
      })
    ).to.throw(
      'length must be less than or equal to ' +
        `${defaultOptions.maxLineWidth - type.length - scope.length - 4}`
    );
  });
  it('empty subject', function() {
    expect(() =>
      commitMessage({
        type,
        scope,
        subject: ''
      })
    ).to.throw('subject is required');
  });
  it('issues does not match regex', function() {
    expect(() =>
      commitMessage({
        type,
        issues: invalidIssues,
        scope,
        subject: body
      })
    ).to.throw('Issues must match the stated format');
  });
  it('empty issues', function() {
    expect(() =>
      commitMessage({
        type,
        issues: '',
        scope,
        subject: body
      })
    ).to.throw('Issue is required');
  });
});

describe('defaults', function() {
  it('defaultType default', function() {
    expect(questionDefault('type')).to.be.undefined;
  });
  it('defaultType options', function() {
    expect(
      questionDefault('type', customOptions({ defaultType: type }))
    ).to.equal(type);
  });
  it('defaultScope default', function() {
    expect(questionDefault('scope')).to.be.undefined;
  });
  it('defaultScope options', () =>
    expect(
      questionDefault('scope', customOptions({ defaultScope: scope }))
    ).to.equal(scope));

  it('defaultSubject default', () =>
    expect(questionDefault('subject')).to.be.undefined);
  it('defaultSubject options', function() {
    expect(
      questionDefault(
        'subject',
        customOptions({
          defaultSubject: subject
        })
      )
    ).to.equal(subject);
  });
  it('defaultBody default', function() {
    expect(questionDefault('body')).to.be.undefined;
  });
  it('defaultBody options', function() {
    expect(
      questionDefault('body', customOptions({ defaultBody: body }))
    ).to.equal(body);
  });
  it('disableScopeLowerCase default', function() {
    expect(questionDefault('disableScopeLowerCase')).to.be.undefined;
  });
  it('disableSubjectLowerCase default', function() {
    expect(questionDefault('disableSubjectLowerCase')).to.be.undefined;
  });
});

describe('prompts', function() {
  it('commit subject prompt for commit w/ out scope', function() {
    expect(questionPrompt('subject', { type })).to.contain(
      `(max ${defaultOptions.maxHeaderWidth - type.length - 2} chars)`
    );
  });
  it('commit subject prompt for commit w/ scope', function() {
    expect(questionPrompt('subject', { type, scope })).to.contain(
      `(max ${defaultOptions.maxHeaderWidth -
        type.length -
        scope.length -
        4} chars)`
    );
  });
});

describe('transformation', function() {
  it('subject w/ character count', () =>
    expect(
      questionTransformation('subject', {
        type,
        subject
      })
    ).to.equal(chalk.green(`(${subject.length}) ${subject}`)));
  it('long subject w/ character count', () =>
    expect(
      questionTransformation('subject', {
        type,
        subject: longBody
      })
    ).to.equal(chalk.red(`(${longBody.length}) ${longBody}`)));
});

describe('filter', function() {
  it('lowercase scope', () =>
    expect(questionFilter('scope', 'HelloMatt')).to.equal('hellomatt'));
  it('lowerfirst subject trimmed and trailing dots striped', () =>
    expect(questionFilter('subject', '  A subject...  ')).to.equal(
      'a subject'
    ));
});

describe('when', function() {
  it('breaking by default', () =>
    expect(questionWhen('breaking', {})).to.be.undefined);
  it('breaking when isBreaking', () =>
    expect(
      questionWhen('breaking', {
        isBreaking: true
      })
    ).to.be.true);
});

describe('commitlint config header-max-length', function() {
  //commitlint config parser only supports Node 6.0.0 and higher
  if (semver.gte(process.version, '6.0.0')) {
    function mockOptions(headerMaxLength) {
      var options = undefined;
      mock('./engine', function(opts) {
        options = opts;
      });
      if (headerMaxLength) {
        mock('cosmiconfig', function() {
          return {
            load: function(cwd) {
              return {
                filepath: cwd + '/.commitlintrc.js',
                config: {
                  rules: {
                    'header-max-length': [2, 'always', headerMaxLength]
                  }
                }
              };
            }
          };
        });
      }

      mock.reRequire('./index');
      try {
        return mock
          .reRequire('@commitlint/load')()
          .then(function() {
            return options;
          });
      } catch (err) {
        return Promise.resolve(options);
      }
    }

    afterEach(function() {
      delete require.cache[require.resolve('./index')];
      delete require.cache[require.resolve('@commitlint/load')];
      delete process.env.CZ_MAX_HEADER_WIDTH;
      mock.stopAll();
    });

    it('with no environment or commitizen config override', function() {
      return mockOptions(72).then(function(options) {
        expect(options).to.have.property('maxHeaderWidth', 72);
      });
    });

    it('with environment variable override', function() {
      process.env.CZ_MAX_HEADER_WIDTH = '105';
      return mockOptions(72).then(function(options) {
        expect(options).to.have.property('maxHeaderWidth', 105);
      });
    });

    it('with commitizen config override', function() {
      mock('commitizen', {
        configLoader: {
          load: function() {
            return {
              maxHeaderWidth: 103
            };
          }
        }
      });
      return mockOptions(72).then(function(options) {
        expect(options).to.have.property('maxHeaderWidth', 103);
      });
    });
  } else {
    //Node 4 doesn't support commitlint so the config value should remain the same
    it('default value for Node 4', function() {
      return mockOptions(72).then(function(options) {
        expect(options).to.have.property('maxHeaderWidth', 100);
      });
    });
  }
});
function commitMessage(answers, options) {
  options = options || defaultOptions;
  var result = null;
  engine(options).prompter(
    {
      prompt: function(questions) {
        return {
          then: function(finalizer) {
            processQuestions(questions, answers, options);
            finalizer(answers);
          }
        };
      }
    },
    function(message) {
      result = message;
    }
  );
  return result;
}

function processQuestions(questions, answers, options) {
  for (var i in questions) {
    var question = questions[i];
    var answer = answers[question.name];
    var validation =
      answer === undefined || !question.validate
        ? true
        : question.validate(answer, answers);
    if (validation !== true) {
      throw new Error(
        validation ||
          `Answer '${answer}' to question '${question.name}' was invalid`
      );
    }
    if (question.filter && answer) {
      answers[question.name] = question.filter(answer);
    }
  }
}

function getQuestions(options) {
  options = options || defaultOptions;
  var result = null;
  engine(options).prompter({
    prompt: function(questions) {
      result = questions;
      return {
        then: function() {}
      };
    }
  });
  return result;
}

function getQuestion(name, options) {
  options = options || defaultOptions;
  var questions = getQuestions(options);
  for (var i in questions) {
    if (questions[i].name === name) {
      return questions[i];
    }
  }
  return false;
}

function questionPrompt(name, answers, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return question.message && typeof question.message === 'string'
    ? question.message
    : question.message(answers);
}

function questionTransformation(name, answers, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return (
    question.transformer &&
    question.transformer(answers[name], answers, options)
  );
}

function questionFilter(name, answer, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return (
    question.filter &&
    question.filter(typeof answer === 'string' ? answer : answer[name])
  );
}

function questionDefault(name, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return question.default;
}

function questionWhen(name, answers, options) {
  options = options || defaultOptions;
  var question = getQuestion(name, options);
  return question.when(answers);
}

function customOptions(options) {
  Object.keys(defaultOptions).forEach(key => {
    if (options[key] === undefined) {
      options[key] = defaultOptions[key];
    }
  });
  return options;
}
