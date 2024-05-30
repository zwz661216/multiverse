import { useCallback, TouchEvent, ReactEventHandler, useEffect, useRef, useMemo, useState } from 'react';
import { json } from './const';
import intro from '../../assets/intro.mp4';
import { useDispatch, updateDistance, updateNav, updateLoading } from '../../store';
import './index.less';

export default () => {
  return (
    <>
      <Video url={intro}></Video>
      <Text />
    </>
  );
};

function Video({ url, type = 'video/mp4' }: { url: string; type?: string }) {
  const dispatch = useDispatch();

  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<[string, string, string, string]>(['100%', '100%', '0', '0']);
  const onLoadedData: ReactEventHandler<HTMLVideoElement> = useCallback(
    (event) => {
      const { videoWidth, videoHeight } = event.currentTarget;
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        if (videoWidth / videoHeight === width / height) {
          setRect([`${width}px`, `${height}px`, '0', '0']);
          dispatch(updateLoading(false));
          return;
        }
        if (videoWidth / videoHeight > width / height) {
          const curVideoWidth = (height * videoWidth) / videoHeight;
          setRect([`${curVideoWidth}px`, `${height}px`, '0', `-${(curVideoWidth - width) / 2}px`]);
          dispatch(updateLoading(false));
          return;
        }
        const curVideoHeight = (width * videoHeight) / videoWidth;
        setRect([`${width}px`, `${curVideoHeight}px`, `-${(curVideoHeight - height) / 2}px`, '0']);
        dispatch(updateLoading(false));
      }
    },
    [dispatch]
  );

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: -1 }} ref={ref}>
      <video
        style={{
          position: 'absolute',
          zIndex: 2,
          mixBlendMode: 'screen',
          width: rect[0],
          height: rect[1],
          marginTop: rect[2],
          marginLeft: rect[3],
        }}
        autoPlay
        loop
        muted
        controls={false}
        onLoadedData={onLoadedData}
      >
        <source src={url} type={type} />
      </video>
    </div>
  );
}

function Text() {
  const dispatch = useDispatch();
  const numRef = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLDivElement[]>([]);
  const rootHeight = useRef(0);
  const boxHeight = useRef(0);
  const lengthRef = useRef(745);
  const status = useRef<'top' | 'bottom' | ''>('bottom');
  const point = useRef(0);
  const pointAct = useRef(false);
  useEffect(() => {
    if (root.current && ref.current) {
      rootHeight.current = root.current.getBoundingClientRect().height;
      const rect = ref.current.getBoundingClientRect();
      boxHeight.current = rect.height;
      lengthRef.current = rect.width;
    }
  }, []);

  const onTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    pointAct.current = true;
    point.current = event.touches[0].clientY;
  }, []);
  const onTouchMove = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (!pointAct.current) {
        return;
      }
      const deltaY = event.touches[0].clientY - point.current;
      point.current = event.touches[0].clientY;

      if (deltaY > 0 && status.current === 'bottom') {
        return;
      }
      if (deltaY < 0 && status.current === 'top') {
        return;
      }
      const last = numRef.current;
      const num = last + deltaY;
      numRef.current = num;
      let totalTop = 0,
        totalbottom = 0;
      totalRef.current.forEach((r, index) => {
        if (json[index].min! > num * -1 && deltaY < 0) {
          return;
        }
        if (deltaY > 0 && num * -1 < json[index].min!) {
          r.style.setProperty('opacity', `${json[index].opacity}`);
          r.style.setProperty(
            'transform',
            `translate(0%, ${json[index].translateY}%) matrix(${json[index].scale}, 0, 0, ${json[index].scale}, 0, 0)`
          );
          totalbottom += 1;
          return;
        }

        if (deltaY < 0 && json[index].max! + json[index].min < num * -1) {
          r.style.setProperty('opacity', `0`);
          r.style.setProperty('transform', `translate(0%, -400%) matrix(1.4, 0, 0, 1.4, 0, 0)`);
          totalTop += 1;
          return;
        }
        r.style.setProperty('opacity', `${(rootHeight.current / 2 - (num * -1 - json[index].min)) / (rootHeight.current / 2)}`);
        r.style.setProperty(
          'transform',
          `translate3d(0,${((num + json[index].min!) / boxHeight.current) * 100 + json[index].translateY}%,0) scale(${
            (num * -1 + rootHeight.current - json[index].min!) / rootHeight.current
          })`
        );
      });
      if (totalTop === totalRef.current.length) {
        status.current = 'top';
        dispatch(updateDistance(numRef.current / lengthRef.current));
        lengthRef.current = numRef.current;
        dispatch(updateNav('technology'));
        return;
      }
      if (totalbottom === totalRef.current.length) {
        dispatch(updateDistance(numRef.current / lengthRef.current));
        status.current = 'bottom';
        return;
      }
      dispatch(updateDistance(numRef.current / lengthRef.current));
      status.current = '';

      // console.log(deltaY);
    },
    [dispatch]
  );
  const onTouchEnd = useCallback((event: TouchEvent<HTMLDivElement>) => {
    pointAct.current = false;
  }, []);
  const refFn = useCallback((ref: HTMLParagraphElement) => {
    if (ref && ref.dataset.index) {
      totalRef.current[Number(ref.dataset.index)] = ref;
    }
  }, []);

  return useMemo(
    () => (
      <div
        className="starwars-container"
        ref={root}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchCancel={onTouchEnd}
        onTouchEnd={onTouchEnd}
      >
        <div className="starwars-wrapper" ref={ref}>
          {json.map((item, index) => {
            return (
              <p key={index} ref={refFn} data-index={index} style={item.style}>
                {item.element}
              </p>
            );
          })}
        </div>
      </div>
    ),
    [refFn, onTouchStart, onTouchMove, onTouchEnd]
  );
}
