import {
  PANEL_BADGE_TRIGGER,
  IEmbeddableSetup,
  IEmbeddableStart,
} from '../../../src/plugins/embeddable/public';
import { IUiActionsStart, IUiActionsSetup, IAction } from '../../../src/plugins/ui_actions/public';
import { CoreSetup, CoreStart, Plugin } from '../../../src/core/public';
import { FiltersBadge } from './filters_badge';
import { QueryBadge } from './query_badge';

interface SetupDependencies {
  embeddable: IEmbeddableSetup; // Embeddable are needed because they register basic triggers/actions.
  uiActions: IUiActionsSetup;
}

interface StartDependencies {
  embeddable: IEmbeddableStart;
  uiActions: IUiActionsStart;
}

export type KibanaFiltersQueryTagsPluginSetup = void;
export type KibanaFiltersQueryTagsPluginStart = void;

export class KibanaFiltersQueryTagsPlugin
  implements
    Plugin<
      KibanaFiltersQueryTagsPluginSetup,
      KibanaFiltersQueryTagsPluginStart,
      SetupDependencies,
      StartDependencies
    > {
  public setup(core: CoreSetup): KibanaFiltersQueryTagsPluginSetup {}

  public start(
    core: CoreStart,
    { uiActions }: StartDependencies
  ): KibanaFiltersQueryTagsPluginStart {
    // @ts-ignore
    const filtersBadge: IAction = new FiltersBadge({});
    uiActions.registerAction(filtersBadge);
    uiActions.attachAction(PANEL_BADGE_TRIGGER, filtersBadge.id);

    const queryBadge: IAction = new QueryBadge({});
    uiActions.registerAction(queryBadge);
    uiActions.attachAction(PANEL_BADGE_TRIGGER, queryBadge.id);
  }

  public stop() {}
}
