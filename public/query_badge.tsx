import { Embeddable } from '../../../src/plugins/embeddable/public';
import { IAction } from '../../../src/plugins/ui_actions/public';

const QUERY_BADGE = 'QUERY_BADGE';

interface ActionContext {
  embeddable: Embeddable;
}

export class QueryBadge implements IAction<ActionContext> {
  public readonly type = QUERY_BADGE;
  public readonly id = QUERY_BADGE;
  public order = 7;

  constructor({}: {}) {}

  public getDisplayName({ embeddable }: ActionContext) {
    const query = embeddable.savedVisualization.searchSource.fields.query;

    return query.query;
  }

  public getIconType() {
    return 'kqlSelector';
  }

  public async isCompatible({ embeddable }: ActionContext) {
    return Boolean(
      embeddable &&
        embeddable.savedVisualization &&
        embeddable.savedVisualization?.searchSource?.fields?.query &&
        embeddable.savedVisualization?.searchSource?.fields?.query?.query !== ''
    );
  }

  public async execute({ embeddable }: ActionContext) {
    window.location.href = embeddable.output.editUrl;
  }
}
