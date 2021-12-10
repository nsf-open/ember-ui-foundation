import type ProgressManager from '@nsf/ui-foundation/lib/ProgressManager';
import type ProgressItem from '@nsf/ui-foundation/lib/ProgressItem';
import Component from '@ember/component';

/**
 * Components rendered via workflows that leverage a ProgressManager will receive
 * the additional properties described in this interface.
 */
export interface IProgressComponent<Data> extends Component {
  readonly progressItem: ProgressItem<Data>;
  readonly progressManager: ProgressManager<Data>;
  readonly progressData: Data;
}

/**
 * A concrete implementation of the IProgressComponent interface.
 */
export default class ProgressComponent<Data = unknown>
  extends Component
  implements IProgressComponent<Data>
{
  public declare readonly progressManager: ProgressManager<Data>;

  public declare readonly progressItem: ProgressItem<Data>;

  public declare readonly progressData: Data;
}
