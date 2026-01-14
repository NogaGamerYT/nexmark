import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PreviewProps {
  content: string;
  theme: 'light' | 'dark';
}

const Preview: React.FC<PreviewProps> = ({ content, theme }) => {
  return (
    <div className="w-full h-full p-4 md:p-8 overflow-y-auto bg-canvas-default transition-colors duration-300">
      <div 
        id="nexmark-preview-content"
        className={`
          max-w-3xl mx-auto prose prose-sm md:prose-base 
          ${theme === 'dark' ? 'prose-invert' : ''}
          prose-pre:bg-canvas-subtle prose-pre:border prose-pre:border-border-default 
          prose-headings:text-fg-default prose-p:text-fg-default prose-strong:text-fg-default 
          prose-code:text-accent-fg prose-a:text-accent-fg hover:prose-a:underline 
          prose-li:text-fg-default prose-table:border-border-default 
          prose-th:border-border-default prose-td:border-border-default 
          prose-blockquote:border-l-accent-fg prose-blockquote:bg-canvas-overlay 
          prose-blockquote:not-italic prose-blockquote:py-1 prose-blockquote:px-4 
          prose-hr:border-border-default
        `}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div className="rounded-md overflow-hidden border border-border-default my-4">
                    <div className="bg-canvas-overlay px-3 py-1 text-xs text-fg-muted border-b border-border-default font-mono flex justify-between">
                        <span>{match[1]}</span>
                    </div>
                    <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: '#1c2128', // Always dark for code blocks (better contrast usually)
                        fontSize: '0.9rem',
                    }}
                    {...props}
                    >
                    {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                </div>
              ) : (
                <code className="bg-canvas-subtle px-1.5 py-0.5 rounded text-[0.85em] font-mono border border-border-muted text-fg-default" {...props}>
                  {children}
                </code>
              );
            },
            // Custom Table rendering to match Github style
            table({ children }) {
                return (
                    <div className="overflow-x-auto my-6 border border-border-default rounded-md">
                        <table className="min-w-full divide-y divide-border-default text-sm text-left">
                            {children}
                        </table>
                    </div>
                )
            },
            thead({ children }) {
                return <thead className="bg-canvas-overlay">{children}</thead>
            },
            th({ children }) {
                return <th className="px-4 py-3 font-semibold text-fg-default whitespace-nowrap">{children}</th>
            },
            td({ children }) {
                return <td className="px-4 py-3 border-t border-border-muted text-fg-muted">{children}</td>
            },
            blockquote({ children }) {
                return (
                    <blockquote className="border-l-4 border-border-muted pl-4 italic text-fg-muted my-4">
                        {children}
                    </blockquote>
                )
            },
            a({ node, href, children, ...props }) {
                return (
                    <a href={href} className="text-accent-fg hover:underline" target="_blank" rel="noopener noreferrer" {...props}>
                        {children}
                    </a>
                )
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Preview;