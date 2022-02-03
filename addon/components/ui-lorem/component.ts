import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import { capitalize } from '@ember/string';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import template from './template';

export enum Units {
  PARAGRAPH = 'paragraph',
  SENTENCE = 'sentence',
  WORD = 'word',
}

const WORDS = [
  'ad',
  'adipisicing',
  'aliqua',
  'aliquip',
  'amet',
  'anim',
  'aute',
  'cillum',
  'commodo',
  'consectetur',
  'consequat',
  'culpa',
  'cupidatat',
  'deserunt',
  'do',
  'dolor',
  'dolore',
  'duis',
  'ea',
  'eiusmod',
  'elit',
  'enim',
  'esse',
  'est',
  'et',
  'eu',
  'ex',
  'excepteur',
  'exercitation',
  'fugiat',
  'id',
  'in',
  'incididunt',
  'ipsum',
  'irure',
  'labore',
  'laboris',
  'laborum',
  'Lorem',
  'magna',
  'minim',
  'mollit',
  'nisi',
  'non',
  'nostrud',
  'nulla',
  'occaecat',
  'officia',
  'pariatur',
  'proident',
  'qui',
  'quis',
  'reprehenderit',
  'sint',
  'sit',
  'sunt',
  'tempor',
  'ullamco',
  'ut',
  'velit',
  'veniam',
  'voluptate',
];

function makeArrayOfLength(length = 0): number[] {
  // eslint-disable-next-line prefer-spread
  return Array.apply(null, Array(length)).map((_: unknown, index: number) => index);
}

function makeArrayOfStrings(length: number, makeString: () => string): string[] {
  const arr = makeArrayOfLength(length);
  return arr.map(() => makeString());
}

function generateRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function pluckRandomWord(): string {
  return WORDS[generateRandomInteger(0, WORDS.length - 1)];
}

/**
 * A simple Lorem Ipsum generator that can generate filler words, sentences, and
 * whole paragraphs. It's for developers!
 *
 * ```hbs
 *
 * <UiLorem @count={{2}} @units="paragraph" />
 * ```
 */
@tagName('')
@layout(template)
export default class UiLorem extends Component {
  public static readonly positionalParams = ['count', 'units'];

  /**
   * The number of whatever is set in "units" that will be produced. This may also
   * be set as the first positional parameter of the component.
   */
  public count = 1;

  /**
   * The type of Ipsum to create. May be either "paragraph", "sentence", or "word".
   * This may also be set as the second positional parameter of the component.
   */
  public units = Units.PARAGRAPH;

  /**
   * A hash describing the lower and upper bounds of the number of randomly generated words
   * within any given sentence.
   */
  public wordsPerSentence: { min: number; max: number } = { min: 5, max: 15 };

  /**
   * A hash describing the lower and upper bounds of the number of randomly generated
   * sentences within any given paragraph.
   */
  public sentencesPerParagraph: { min: number; max: number } = { min: 3, max: 7 };

  @equal('units', Units.PARAGRAPH)
  public declare readonly isParagraph: boolean;

  @computed('units', 'count')
  public get content() {
    return this.generate(this.count);
  }

  generateRandomWords(num?: number): string {
    const { min, max } = this.wordsPerSentence;
    const length = num || generateRandomInteger(min, max);

    return makeArrayOfLength(length)
      .reduce((accumulator: string) => `${pluckRandomWord()} ${accumulator}`, '')
      .trim();
  }

  generateRandomSentence(num?: number): string {
    return `${capitalize(this.generateRandomWords(num))}.`;
  }

  generateRandomParagraph(num?: number): string {
    const { min, max } = this.sentencesPerParagraph;
    const length = num || generateRandomInteger(min, max);

    return makeArrayOfLength(length)
      .reduce((accumulator: string) => `${this.generateRandomSentence()} ${accumulator}`, '')
      .trim();
  }

  generate(num: number): string | string[] {
    switch (this.units) {
      case Units.WORD:
        return this.generateRandomWords(num);
      case Units.SENTENCE:
        return this.generateRandomParagraph(num);
      default:
        return makeArrayOfStrings(num, () => this.generateRandomParagraph());
    }
  }
}
