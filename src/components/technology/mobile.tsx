import { useCallback, useRef, TouchEvent } from 'react';
import { useDispatch, updateNav } from '../../store';
import './index.css';

export default () => {
  const ref = useRef(0);
  const point = useRef(0);
  const pointAct = useRef(false);
  const dispatch = useDispatch();

  const onTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    pointAct.current = true;
    point.current = event.touches[0].clientY;
  }, []);
  const onTouchMove = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (!pointAct.current) {
        return;
      }
      let deltaY = point.current - event.touches[0].clientY;

      if (deltaY > 0) {
        ref.current = 0;
        return;
      }
      deltaY = Math.abs(deltaY);
      if (deltaY < 200) {
        return;
      }
      dispatch(updateNav('introduction'));
      pointAct.current = false;
    },
    [dispatch]
  );
  const onTouchEnd = useCallback((event: TouchEvent<HTMLDivElement>) => {
    pointAct.current = false;
    point.current = 0;
  }, []);
  return (
    <div className="technology" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchCancel={onTouchEnd} onTouchEnd={onTouchEnd}>
      <div className="background"></div>
    </div>
  );
};
