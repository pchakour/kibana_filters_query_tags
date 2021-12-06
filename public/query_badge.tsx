import { CoreStart } from '../../../src/core/public';
import { Embeddable } from '../../../src/plugins/embeddable/public';
import { Action } from '../../../src/plugins/ui_actions/public';
import { UISETTINGS_SHOW_TAGS } from '../common';

const QUERY_BADGE = 'QUERY_BADGE';

interface ActionContext {
  embeddable: Embeddable;
}

export class QueryBadge implements Action<ActionContext> {
  public readonly type = QUERY_BADGE;
  public readonly id = QUERY_BADGE;
  public order = 7;

  constructor(private core: CoreStart) {}

  public getDisplayName({ embeddable }: ActionContext) {
    const query = embeddable.vis.data.searchSource.fields.query;

    return query.query;
  }

  public getIconType() {
    return 'kqlSelector';
  }

  public async isCompatible({ embeddable }: ActionContext) {
    const showFiltersQueryTags = this.core.uiSettings.get(UISETTINGS_SHOW_TAGS, true);
    return Boolean(
      showFiltersQueryTags &&
        embeddable &&
        embeddable.vis.data.searchSource.fields.query?.query !== ''
    );
  }

  public async execute({ embeddable }: ActionContext) {
    window.location.href = embeddable.getOutput().editUrl;
  }
}
