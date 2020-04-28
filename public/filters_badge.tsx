import React from 'react';
import { Embeddable } from '../../../src/plugins/embeddable/public';
import { IAction } from '../../../src/plugins/ui_actions/public';
import { esFilters } from '../../../src/plugins/data/common/es_query';
import { FilterLabel } from '../../../src/plugins/data/public/ui/filter_bar/filter_editor/lib/filter_label';
import { mapFilter } from '../../../src/plugins/data/public/query/filter_manager/lib/map_filter';

const FILTERS_BADGE = 'FILTERS_BADGE';

interface ActionContext {
  embeddable: Embeddable;
}

export class FiltersBadge implements IAction<ActionContext> {
  public readonly type = FILTERS_BADGE;
  public readonly id = FILTERS_BADGE;
  public order = 7;

  constructor({}: {}) {}

  private getFilterStyle(position: 'left' | 'middle' | 'right' | 'none') {
    const filterStyle = {
      padding: 5,
    };

    const filterStyleBorderRight = {
      borderRight: '1px solid #777777',
    };

    const filterStyleBorderLeft = {
      borderLeft: '1px solid #777777',
    };

    if (position === 'left') {
      return {
        ...filterStyle,
        ...filterStyleBorderRight,
      };
    } else if (position === 'right') {
      return {
        ...filterStyle,
        ...filterStyleBorderLeft,
      };
    } else if (position === 'middle') {
      return {
        ...filterStyle,
        ...filterStyleBorderRight,
        ...filterStyleBorderLeft,
      };
    }

    return filterStyle;
  }

  public getDisplayName({ embeddable }: ActionContext) {
    const filters = embeddable.savedVisualization.searchSource.fields.filter;

    return (
      <>
        {filters.map((filter, index) => (
          <span
            style={this.getFilterStyle(
              (filters.length === 1 && 'none') ||
                (index + 1 === filters.length && 'right') ||
                (index === 0 && 'left') ||
                'middle'
            )}
          >
            <FilterLabel
              filter={mapFilter(filter)}
              valueLabel={esFilters.getDisplayValueFromFilter(filter, [
                embeddable.savedVisualization.searchSource.fields.index,
              ])}
            />
          </span>
        ))}
      </>
    );
  }

  public getIconType() {
    return 'filter';
  }

  public async isCompatible({ embeddable }: ActionContext) {
    return Boolean(
      embeddable &&
        embeddable.savedVisualization?.searchSource?.fields?.filter?.length &&
        embeddable.savedVisualization?.searchSource?.fields?.index
    );
  }

  public async execute({ embeddable }: ActionContext) {
    window.location.href = embeddable.output.editUrl;
  }
}
