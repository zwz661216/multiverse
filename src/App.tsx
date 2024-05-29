import { useCallback, useEffect, useRef, useState } from "react";
import Transition from "./components/transition";
import Introduction from "./components/introduction";
import Technology from "./components/technology";
import "./App.css";

function App() {
  const [active, setActive] = useState<"introduction" | "technology">(
    "introduction"
  );
  const ref = useRef<HTMLDivElement>(null);

  const [width, setLine] = useState(0);
  const widthRef = useRef(0);
  const change = useCallback((val: number) => {
    const num = Math.abs(val) * widthRef.current 
    if (Math.abs(widthRef.current - num) < 0.5) {
      onClick()
    }
    setLine(num);
  }, []);
  const onClick = useCallback(() => {
    setActive((item) =>
      item === "introduction" ? "technology" : "introduction"
    );
  }, []);
  useEffect(() => {
    widthRef.current = ref.current!.getBoundingClientRect().width;
  }, []);
  return (
    <>
      <header>
        <a href="#/" className="logo"></a>
        <div className="navigation">
          <div className="group active" data-page-id="homepage-page">
            <ul>
              <li>
                <a
                  className={active === "introduction" ? "active" : ""}
                  onClick={onClick}
                >
                  Introduction
                  <div className="progress-border" ref={ref}>
                    <div
                      className="progress-line"
                      style={{ width: width + "px" }}
                    ></div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  className={active === "technology" ? "active" : ""}
                  onClick={onClick}
                >
                  The Technology
                </a>
              </li>
              <li>
                <a href="#homepage-tech-spotlight">
                  Tech Spotlight
                  <div className="progress-border">
                    <div className="progress-line"></div>
                  </div>
                </a>
              </li>
              <li>
                <a href="#homepage-why-music">Why Music?</a>
              </li>
            </ul>
          </div>
        </div>
        <a href="#" className="toggle-button">
          <span className="lines"></span>
        </a>
      </header>

      <Transition
        visible={active === "introduction"}
        style={{ height: "300%" }}
      >
        <div style={{ flex: 1, width: "100%" }}>
          <Introduction change={change}></Introduction>
        </div>
        <div
          style={{
            height: "33.33%",
            width: "100%",
            background: "rgb(230, 230, 230)",
          }}
        ></div>
        <div
          style={{
            height: "33.33%",
            width: "100%",
            background: "rgb(53, 1, 127)",
          }}
        ></div>
      </Transition>
      <Transition
        visible={active === "technology"}
        style={{
          height: "300%",
          "--fade-start": "translateY(33.33%)",
          "--fade-end": "translateY(-66.66%)",
        }}
      >
        <div
          style={{
            height: "33.33%",
            width: "100%",
            background: "rgb(230, 230, 230)",
          }}
        ></div>
        <div
          style={{
            height: "33.33%",
            width: "100%",
            background: "rgb(53, 1, 127)",
          }}
        ></div>
        <div style={{ flex: 1, width: "100%", display: "flex" }}>
          <Technology />
        </div>
      </Transition>
    </>
  );
}

export default App;
