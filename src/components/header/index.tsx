import { useCallback, useEffect, useRef, useState, MouseEvent } from 'react';
import { useDispatch, useContextData, updateNav } from '../../store';
import './index.less';

const Header = () => {
  const ref = useRef<HTMLDivElement>(null);
  const data = useContextData();
  const [width, setLine] = useState(0);
  const dispatch = useDispatch();
  const onClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const { nav } = event.currentTarget.dataset;
      dispatch(updateNav(nav as 'introduction' | 'technology'));
    },
    [dispatch]
  );
  useEffect(() => {
    const num = Math.abs(data.distance) * widthRef.current;
    if (Math.abs(widthRef.current - num) < 0.5) {
      dispatch(updateNav('introduction'));
    }
    setLine(num);
  }, [data.distance, dispatch]);
  const widthRef = useRef(0);
  useEffect(() => {
    if (ref.current) {
      widthRef.current = ref.current.getBoundingClientRect().width;
    }
  }, []);
  return (
    <header className="header">
      <button className="logo" />
      <div className="navigation">
        <div className="group active" data-page-id="homepage-page">
          <ul className="group-box">
            <li className="group-item">
              <button className={data.nav === 'introduction' ? 'group-item-active nav-btn' : 'nav-btn'} data-nav="introduction" onClick={onClick}>
                Introduction
                <div className="progress-border" ref={ref}>
                  <div className="progress-line" style={{ width: width + 'px' }}></div>
                </div>
              </button>
            </li>
            <li className="group-item">
              <button className={data.nav === 'technology' ? 'group-item-active nav-btn' : 'nav-btn'} data-nav="technology" onClick={onClick}>
                The Technology
              </button>
            </li>
            <li className="group-item">
              <button className="nav-btn">
                Tech Spotlight
                <div className="progress-border">
                  <div className="progress-line"></div>
                </div>
              </button>
            </li>
            <li className="group-item">
              <button className="nav-btn">Why Music?</button>
            </li>
          </ul>
        </div>
      </div>
      <button className="toggle-button">
        <span className="lines"></span>
      </button>
    </header>
  );
};

export default Header;
