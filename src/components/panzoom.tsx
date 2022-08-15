import React, { useRef, useEffect, PropsWithChildren } from "react";

const { Panzoom } = require("@fancyapps/ui/dist/panzoom.umd");

import "@fancyapps/ui/dist/panzoom.css";

function ReactPanzoom(props: PropsWithChildren<{ options?: any }>) {
  const wrapper = useRef(null);

  useEffect(() => {
    const instance = new Panzoom(wrapper.current, props.options || {});

    return () => {
      instance.destroy();
    };
  }, []);

  return (
    <div className="panzoom" ref={wrapper}>
      <div className="panzoom__content">{props.children}</div>
    </div>
  );
}

export default ReactPanzoom;
