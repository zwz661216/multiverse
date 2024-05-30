import Transition from './components/transition';
import Introduction from './components/introduction';
import Technology from './components/technology';
import { useContextData } from './store';
import Header from './components/header';
import './App.css';

export default function App() {
  const data = useContextData();
  return (
    <>
      <div className={data.loading ? 'loading' : 'loading none'}></div>
      <a href="http://www.awwwards.com/web-design-awards/feed-2" target="_blank" rel="noreferrer" className="awards"></a>
      <Header></Header>
      <Transition visible={data.nav === 'introduction'} style={{ height: '300%' }}>
        <div style={{ flex: 1, width: '100%', position: 'relative' }}>
          <Introduction></Introduction>
        </div>
        <div
          style={{
            height: '33.33%',
            width: '100%',
            background: 'rgb(230, 230, 230)',
          }}
        ></div>
        <div
          style={{
            height: '33.33%',
            width: '100%',
            background: 'rgb(53, 1, 127)',
          }}
        ></div>
      </Transition>
      <Transition
        visible={data.nav === 'technology'}
        style={{
          height: '300%',
          '--fade-start': 'translateY(33.33%)',
          '--fade-end': 'translateY(-66.66%)',
        }}
      >
        <div
          style={{
            height: '33.33%',
            width: '100%',
            background: 'rgb(230, 230, 230)',
          }}
        ></div>
        <div
          style={{
            height: '33.33%',
            width: '100%',
            background: 'rgb(53, 1, 127)',
          }}
        ></div>
        <div style={{ flex: 1, width: '100%', display: 'flex' }}>
          <Technology />
        </div>
      </Transition>
    </>
  );
}

// export default () => {
//   return (
//     <Provider>
//       <App />
//     </Provider>
//   );
// };
