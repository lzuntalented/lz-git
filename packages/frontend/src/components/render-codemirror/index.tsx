import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import './index.css';

interface RenderCodeMirrorProps {
  data: string
}

function RenderCodeMirror({ data }: RenderCodeMirrorProps) {
  const codeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (codeRef.current) {
      Codemirror(codeRef.current, {
        value: data,
        lineNumbers: true,
        readOnly: true,
        mode: 'javascript',
      });
    }
  }, [data]);
  return (
    <div className="comp-render-codemirror" ref={codeRef} />
  );
}

export default RenderCodeMirror;
