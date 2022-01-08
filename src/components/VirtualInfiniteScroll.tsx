import React, { ReactElement, memo, useEffect, useMemo } from 'react';
import { createStyles, makeStyles } from '@material-ui/core';

import { useVirtualInfiniteScroll } from 'hooks/useVirtualInfiniteScroll';

const useStyles = makeStyles(() =>
  createStyles({
    virtualInfiniteScroll: {
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
  }),
);

export interface VirtualInfiniteScrollProps {
  itemCount: number;
  itemHeight: number;
  renderItem: (index: number) => false | ReactElement;
  threshold?: number;
  onLoadMore?: () => void;
}

function VirtualInfiniteScroll({
  itemCount,
  itemHeight,
  renderItem,
  threshold = 10,
  onLoadMore = () => {},
}: VirtualInfiniteScrollProps) {
  const classes = useStyles();

  const nodePositions = useMemo(() => {
    const positions = [0];
    for (let i = 1; i < itemCount; i += 1) {
      positions.push(positions[i - 1] + itemHeight);
    }
    return positions;
  }, [itemHeight, itemCount]);

  const totalHeight = itemCount * itemHeight;

  const {
    containerRef,
    containerHeight,
    contentTotalRef,
    startNode,
    endNode,
    shouldLoadMore,
    setShouldLoadMore,
  } = useVirtualInfiniteScroll({
    nodePositions,
    itemCount,
    itemHeight,
    threshold,
  });

  const visibleNodeCount = endNode - startNode + 1;
  const offsetY = nodePositions[startNode];

  const visibleNodes = useMemo(
    () => new Array(visibleNodeCount).fill(null).map((_, i) => renderItem(startNode + i)),
    [visibleNodeCount, renderItem, startNode],
  );

  useEffect(() => {
    if (shouldLoadMore) {
      onLoadMore();
      setShouldLoadMore(false);
    }
  }, [shouldLoadMore]);

  return (
    <div
      className={classes.virtualInfiniteScroll}
      style={{ height: containerHeight }}
      ref={containerRef}
    >
      <div ref={contentTotalRef} className={classes.contentTotal} style={{ height: totalHeight }}>
        <div className={classes.contentVisible} style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleNodes}
        </div>
      </div>
    </div>
  );
}

export default memo(VirtualInfiniteScroll);
