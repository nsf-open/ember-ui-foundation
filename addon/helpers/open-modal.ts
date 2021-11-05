import type ModalService from '@nsf/ui-foundation/services/modal';
import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

/**
 * The OpenUiModalHelper creates an action that can be used to open a modal window
 * based on its name. This lets the developer side-step having to create their own
 * boolean value + toggle method most of the time.
 *
 * ```handlebars
 * <UiButton @variant="primary" @onClick={{open-modal "confirm"}}>
 *   Confirm Your Choices
 * </UiButton>
 *
 * <UiModal @name="confirm" @title="Currently Selected Choices">
 *   <p>...</p>
 * </UiModal>
 * ```
 *
 * An arbitrary `data` object, and the modal's title can also be provided via the action
 * as second and third positional params. This provides for a lot of flexibility in modal
 * applications where the content to be shown is highly contextual. For example, consider a
 * table wherein each row has its own "Show Details" button.
 *
 * ```handlebars
 * <UiButton
 *   @variant="info"
 *   @onClick={{open-modal "details" row.content (concat "Details for " row.content.name)}}
 * >
 *   Show Details
 * </UiButton>
 *
 * {{!-- The `data` object is always yielded back as "data",
 * and the title will be set with the provided string --}}
 *
 * <UiModal @name="details" as |modal|>
 *   <ul>
 *     <li>Name: {{modal.data.name}}</li>
 *     <li>Occupation: {{modal.data.occupation}}</li>
 *   </ul>
 * </UiModal>
 * ```
 * @class OpenUiModalHelper
 */
export default class OpenUiModalHelper extends Helper {
  @service
  declare modal: ModalService;

  compute([name, data, title]: [string, unknown?, string?]): (data?: unknown) => void {
    return (dataArg?: unknown) => {
      this.modal.open(name, data ?? dataArg, title);
    };
  }
}
