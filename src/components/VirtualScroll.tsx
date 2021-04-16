import React, { ReactElement, memo, useMemo } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core';

import { useVirtualScroll } from 'hooks/useVirtualScroll';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    virtualScroll: {
      overflow: 'auto',
    },
    contentTotal: {
      overflow: 'hidden',
      willChange: 'transform',
      position: 'relative',
    },
    contentVisible: {
      willChange: 'transform',
    },
  })
);

export interface VirtualScrollProps {
  itemCount: number;
  itemHeight: number;
  renderItem: (index: number) => false | ReactElement;
  threshold?: number;
}

const VirtualScroll = ({ itemCount, itemHeight, renderItem, threshold = 10 }: VirtualScrollProps) => {
  const classes = useStyles();

  const nodePositions = useMemo(() => {
    let positions = [0];
    for (let i = 1; i < itemCount; i++) {
      positions.push(positions[i - 1] + itemHeight);
    }
    return positions;
  }, [itemHeight, itemCount]);

  const totalHeight = itemCount * itemHeight;

  const { containerRef, containerHeight, startNode, endNode } = useVirtualScroll({
    nodePositions,
    itemCount,
    threshold,
  });

  const visibleNodeCount = endNode - startNode + 1;
  const offsetY = nodePositions[startNode];

  const visibleNodes = useMemo(() => new Array(visibleNodeCount).fill(null).map((_, i) => renderItem(startNode + i)), [
    visibleNodeCount,
    renderItem,
    startNode,
  ]);

  return (
    <div className={classes.virtualScroll} style={{ height: containerHeight }} ref={containerRef}>
      <div className={classes.contentTotal} style={{ height: totalHeight }}>
        <div className={classes.contentVisible} style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleNodes}
        </div>
      </div>
    </div>
  );
};

export default memo(VirtualScroll);
