import { useRef, WheelEvent } from 'react';
import { throttle } from 'lodash-es';
import { useDispatch, updateNav } from '../../store';
import './index.css';

export default () => {
  const ref = useRef(0);
  const dispatch = useDispatch();
  const throttled = useRef(
    throttle((event: WheelEvent<HTMLDivElement>) => {
      if (event.deltaY > 0) {
        ref.current = 0;
        return;
      }
      const deltaY = Math.abs(event.deltaY);
      const last = ref.current;
      const num = last + deltaY;
      if (num > 50) {
        dispatch(updateNav('introduction'));
        ref.current = 0;
      }
    }, 16.66)
  );

  return (
    <div className="technology" onWheel={throttled.current}>
      <div className="background"></div>
    </div>
  );
};
