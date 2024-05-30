import { useRef, ReactNode } from 'react';
import { CSSTransition } from 'react-transition-group';
import './index.css';
export default ({ visible, children, style = {} }: { visible: boolean; children: ReactNode; style?: { [key: string]: string } }) => {
  const nodeRef = useRef(null);
  return (
    <CSSTransition nodeRef={nodeRef} classNames="fade" timeout={1000} in={visible} appear={true}>
      <div ref={nodeRef} className="transition" style={style}>
        {children}
      </div>
    </CSSTransition>
  );
};
