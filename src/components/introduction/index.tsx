import { useCallback, WheelEvent, useEffect, useRef, useMemo, useState } from "react";
import { throttle } from "lodash-es"; 
import { json } from "./const";
import "./index.css";
export default ({change}:{change:(num:number)=>void}) => {
  return (
    <>
      <Video url={'http://www.feedmusic.com/videos/intro.mp4'}></Video>
      <Text change={change}></Text>
    </>
  );
};

function Video({ url, type = "video/mp4" }: { url: string; type?: string }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: -1 }}>
      <video
        style={{
          position: "absolute",
          zIndex: 2,
          mixBlendMode: "screen",
          height: "100%",
        }}
        autoPlay
        loop
        muted
        controls={false}
      >
        <source src={url} type={type} />
      </video>
    </div>
  );
}

function Text({change}:{change:(num:number)=>void}) {
  const numRef = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLDivElement[]>([]);
  const rootHeight = useRef(0);
  const boxHeight = useRef(0);
  const lengthRef = useRef(745)
  const status = useRef<"top" | "bottom" | "">("bottom");
  useEffect(() => {
    if (root.current && ref.current) {
      rootHeight.current = root.current.getBoundingClientRect().height;
      const rect = ref.current.getBoundingClientRect();
       boxHeight.current = rect.height
      lengthRef.current = rect.width;
    }
  }, []);
  const onWheel = useCallback(
    throttle((event: WheelEvent<HTMLDivElement>) => {
      const deltaY = event.deltaY * -1;
      if (deltaY > 0 && status.current === "bottom") {
        return;
      }
      if (deltaY < 0 && status.current === "top") {
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
          r.style.setProperty("opacity", `${json[index].opacity}`);
          r.style.setProperty(
            "transform",
            `translate(0%, ${json[index].translateY}%) matrix(${json[index].scale}, 0, 0, ${json[index].scale}, 0, 0)`
          );
          totalbottom += 1;
          return;
        }
         
        if (deltaY < 0 && json[index].max! + json[index].min < num * -1) {
          r.style.setProperty("opacity", `0`);
          r.style.setProperty(
            "transform",
            `translate(0%, -400%) matrix(1.4, 0, 0, 1.4, 0, 0)`
          );
          totalTop += 1;
          return;
        }
        r.style.setProperty(
          "opacity",
          `${
            (rootHeight.current / 2 - (num * -1 - json[index].min)) /
            (rootHeight.current / 2)
          }`
        );
        r.style.setProperty(
          "transform",
          `translate3d(0,${
            ((num + json[index].min!) / boxHeight.current) * 100 +
            json[index].translateY
          }%,0) scale(${
            (num * -1 + rootHeight.current - json[index].min!) /
            rootHeight.current
          })`
        );
      });
      if (totalTop === totalRef.current.length) {
        status.current = "top";
        lengthRef.current = numRef.current
        change(numRef.current/lengthRef.current)
        return;
      }
      if (totalbottom === totalRef.current.length) {
        change(numRef.current/lengthRef.current)
        status.current = "bottom";
        return;
      }

      change(numRef.current/lengthRef.current)

      status.current = "";
    }, 16.66),
    []
  );
  const refFn = useCallback((ref: HTMLParagraphElement) => {
    if (ref && ref.dataset.index) {
      totalRef.current[Number(ref.dataset.index)] = ref;
    }
  }, []);
  return useMemo(
    () => (
      <div className="starwars-container" onWheel={onWheel} ref={root}>
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
    [refFn]
  );
}
