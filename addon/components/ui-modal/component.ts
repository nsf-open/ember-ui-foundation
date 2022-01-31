import type { Task } from 'ember-concurrency';
import ModalContainer from '../-internals/modal-container';
import { task } from 'ember-concurrency';
import { or } from '@ember/object/computed';
import { layout } from '@ember-decorators/component';
import template from './template';
import { SizeVariants } from '@nsf/ui-foundation/constants';

/**
 *
 *
 * @yield {hash}      modal
 * @yield {any}       modal.data         The `data` argument given.
 * @yield {Function}  modal.close        The modal’s `onClose` handler; useful for passing to children components.
 * @yield {Function}  modal.submit       The modal’s `onSubmit` handler; useful for passing to children components.
 * @yield {Component} modal.closeButton  A pre-configured close button for the modal.
 * @yield {Component} modal.submitButton A pre-configured submit button for the modal.
 */
@layout(template)
export default class UiModal extends ModalContainer {
  public static readonly positionalParams = ['title'];

  /**
   * Boolean determining vertical position of the modal window. True centers the
   * modal window. False defaults it to top.
   */
  public centered = false;

  /**
   * The width of the modal window. Can be one of either "sm", "md", or "lg".
   */
  public size: SizeVariants = SizeVariants.Medium;

  /**
   * Boolean. Whether the close UI (the header and optionally yielded button) are disabled.
   */
  public closeDisabled = false;

  /**
   * The value of the element's `data-test-id` attribute, if required.
   */
  public testId?: string;

  /**
   * Use the onSubmit callback in conjunction with the yielded "submitButton".
   */
  public onSubmit?: ((...args: unknown[]) => void | Promise<unknown>) | Task<unknown, unknown[]>;

  @or('closeDisabled', 'handleSubmit.isRunning')
  declare readonly disableCloseOptions: boolean;

  @task
  *handleSubmit(...rest: unknown[]) {
    try {
      const args = [...rest, this.data];
      // TODO: Generalize this for other components?

      // ui-buttons return the event instance from their onClick, no problem there.
      // For the sake of simplicity though, we're going to make sure the event is
      // at the end of arguments list.
      // const event = args.find((item) => {
      //   return (
      //     item instanceof Event || ('originalEvent' in item && item.originalEvent instanceof Event)
      //   );
      // });
      //
      // if (event) {
      //   const idx = args.indexOf(event);
      //   args.splice(idx, 1);
      //   args.push(event);
      // }

      if (this.onSubmit) {
        yield 'unlinked' in this.onSubmit
          ? this.onSubmit.unlinked().perform(...args)
          : this.onSubmit(...args);
      }

      // TODO: Some generic success "thumbs up" as it closes?

      yield this.close();
    } catch (err) {
      // no-op
    }
  }
}
