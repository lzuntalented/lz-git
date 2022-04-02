import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import rehypeRaw from 'rehype-raw';

interface RenderMarkdownProps {
  data: string
}
function RenderMarkdown({ data }: RenderMarkdownProps) {
  const code = ({
    inline, className, children, ...props
  }: {inline?: boolean, className?: string, children?: any}) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        // style={dark}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };
  return (
    <ReactMarkdown
      components={{ code }}
      rehypePlugins={[rehypeRaw]}
    >
      {data}
    </ReactMarkdown>
  );
}

export default RenderMarkdown;
