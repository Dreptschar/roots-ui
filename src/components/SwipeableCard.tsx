import { useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

type SwipeToDeleteProps = {
  children: React.ReactNode;
  onDelete: () => void | Promise<void>;
};

const DELETE_THRESHOLD = 0.65;

export function SwipeableCard({ children, onDelete }: SwipeToDeleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [offset, setOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlers = useSwipeable({
    onSwipeStart: () => {
      if (!isDeleting) {
        setIsSwiping(true);
      }
    },

    onSwiping: ({ deltaX, dir }) => {
      if (isDeleting) {
        return;
      }

      // Only allow swiping from right to left.
      if (dir !== 'Left') {
        setOffset(0);
        return;
      }

      const width = containerRef.current?.offsetWidth ?? 0;

      // deltaX is negative when swiping left.
      setOffset(Math.max(deltaX, -width));
    },

    onSwiped: async ({ deltaX, dir }) => {
      setIsSwiping(false);

      const width = containerRef.current?.offsetWidth ?? 0;
      const shouldDelete = dir === 'Left' && Math.abs(deltaX) >= width * DELETE_THRESHOLD;

      if (!shouldDelete) {
        setOffset(0);
        return;
      }

      // Finish moving the row completely off screen.
      setIsDeleting(true);
      setOffset(-width);

      // Allow the exit animation to finish.
      await new Promise((resolve) => setTimeout(resolve, 180));

      try {
        await onDelete();
      } catch (error) {
        console.error('Could not delete action plan', error);

        // Bring the card back if deletion failed.
        setIsDeleting(false);
        setOffset(0);
      }
    },

    delta: 10,
    preventScrollOnSwipe: true,
    trackTouch: true,

    // Useful for testing on desktop. Remove this if you only want touch.
    trackMouse: true,
  });

  const progress = Math.min(Math.abs(offset) / Math.max(containerRef.current?.offsetWidth ?? 1, 1), 1);

  return (
    <div ref={containerRef} className={`swipeRow ${isDeleting ? 'swipeRowDeleting' : ''}`}>
      <div
        className="swipeDeleteBackground"
        aria-hidden="true"
        style={{
          opacity: Math.max(0.3, progress),
        }}
      >
        <span>Delete</span>
      </div>

      <div
        {...handlers}
        className="swipeRowContent"
        style={{
          transform: `translateX(${offset}px)`,
          transition: isSwiping ? 'none' : 'transform 180ms ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
