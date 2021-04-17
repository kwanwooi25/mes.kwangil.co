import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const useVirtualInfiniteScroll = ({
  nodePositions,
  itemCount,
  itemHeight,
  threshold = 10,
}: {
  nodePositions: number[];
  itemCount: number;
  itemHeight: number;
  threshold?: number;
}) => {
  const thresholdMargin = threshold * 2 * itemHeight;
  const animationFrame = useRef<number>();
  const containerRef = useRef<any>();
  const contentTotalRef = useRef<any>();
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [shouldLoadMore, setShouldLoadMore] = useState<boolean>(false);

  const firstVisibleNode = useMemo(() => getFirstVisibleNode(nodePositions, itemCount, scrollTop), [
    nodePositions,
    itemCount,
    scrollTop,
  ]);

  const startNode = Math.max(0, firstVisibleNode - threshold);

  const lastVisibleNode = useMemo(() => getLastVisibleNode(nodePositions, itemCount, startNode, containerHeight), [
    nodePositions,
    itemCount,
    startNode,
    containerHeight,
  ]);

  const endNode = Math.min(itemCount - 1, lastVisibleNode + threshold);

  const onScroll = useCallback((e) => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    animationFrame.current = requestAnimationFrame(() => {
      const { scrollTop, offsetHeight } = e.target;
      setScrollTop(scrollTop);
      const currentPosition = scrollTop + offsetHeight;
      const totalHeight = contentTotalRef.current.offsetHeight;
      if (currentPosition + thresholdMargin > totalHeight) {
        setShouldLoadMore(true);
      }
    });
  }, []);

  useEffect(() => {
    const scrollContainer = containerRef.current;

    if (scrollContainer) {
      scrollContainer.parentElement && setContainerHeight(scrollContainer.parentElement.offsetHeight);
      setScrollTop(scrollContainer.scrollTop);
      scrollContainer.addEventListener('scroll', onScroll);
      return () => scrollContainer.removeEventListener('scroll', onScroll);
    }
  }, []);

  return { containerRef, containerHeight, contentTotalRef, startNode, endNode, shouldLoadMore, setShouldLoadMore };
};

function getFirstVisibleNode(nodePositions: number[], itemCount: number, scrollTop: number): number {
  let startRange = 0;
  let endRange = Math.max(itemCount - 1, 0);
  while (endRange !== startRange) {
    const middle = Math.floor((endRange - startRange) / 2 + startRange);

    if (nodePositions[middle] <= scrollTop && nodePositions[middle + 1] > scrollTop) {
      return middle;
    }

    if (middle === startRange) {
      return endRange;
    } else {
      if (nodePositions[middle] <= scrollTop) {
        startRange = middle;
      } else {
        endRange = middle;
      }
    }
  }

  return itemCount;
}

function getLastVisibleNode(nodePositions: number[], itemCount: number, startNode: number, height: number): number {
  let endNode: number;
  for (endNode = startNode; endNode < itemCount; endNode++) {
    if (nodePositions[endNode] > nodePositions[startNode] + height) {
      return endNode;
    }
  }
  return endNode;
}
