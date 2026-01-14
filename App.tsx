import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { INITIAL_MARKDOWN } from './constants';
import JSZip from 'jszip';

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(INITIAL_MARKDOWN);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
  };

  const handleExport = async () => {
    const previewElement = document.getElementById('nexmark-preview-content');
    
    if (!previewElement) {
        alert("Could not generate export. Preview not found.");
        return;
    }

    setIsExporting(true);

    try {
        const zip = new JSZip();
        const filesFolder = zip.folder("files");
        
        // 1. Fetch External Assets for Offline Use
        // We fetch them now to bundle them into the zip
        const [tailwindRes, katexRes] = await Promise.all([
            fetch('https://cdn.tailwindcss.com'),
            fetch('https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css')
        ]);

        if (!tailwindRes.ok || !katexRes.ok) throw new Error("Failed to download assets for offline mode.");

        const tailwindCode = await tailwindRes.text();
        const katexCode = await katexRes.text();

        // 2. Add Assets to Zip
        if (filesFolder) {
            filesFolder.file("tailwind.js", tailwindCode);
            filesFolder.file("katex.min.css", katexCode);
            
            // 3. Create Custom CSS file for Variables
            const cssVariables = `
            :root {
                --color-canvas-default: #22272e;
                --color-canvas-overlay: #2d333b;
                --color-canvas-subtle: #373e47;
                --color-fg-default: #adbac7;
                --color-fg-muted: #768390;
                --color-fg-subtle: #545d68;
                --color-border-default: #444c56;
                --color-border-muted: #373e47;
                --color-btn-text: #adbac7;
                --color-btn-bg: #373e47;
                --color-btn-border: rgba(205, 217, 229, 0.1);
                --color-btn-hover-bg: #444c56;
                --color-accent-fg: #539bf5;
                --color-success-fg: #57ab5a;
                --color-danger-fg: #e5534b;
            }
            [data-theme="light"] {
                --color-canvas-default: #ffffff;
                --color-canvas-overlay: #f6f8fa;
                --color-canvas-subtle: #eaeef2;
                --color-fg-default: #24292f;
                --color-fg-muted: #57606a;
                --color-fg-subtle: #6e7781;
                --color-border-default: #d0d7de;
                --color-border-muted: #d8dee4;
                --color-btn-text: #24292f;
                --color-btn-bg: #f6f8fa;
                --color-btn-border: rgba(27, 31, 36, 0.15);
                --color-btn-hover-bg: #f3f4f6;
                --color-accent-fg: #0969da;
                --color-success-fg: #1a7f37;
                --color-danger-fg: #cf222e;
            }
            body {
                background-color: var(--color-canvas-default);
                color: var(--color-fg-default);
                transition: background-color 0.3s, color 0.3s;
            }
            /* Custom Scrollbar */
            ::-webkit-scrollbar { width: 10px; height: 10px; }
            ::-webkit-scrollbar-track { background: var(--color-canvas-default); }
            ::-webkit-scrollbar-thumb { background: var(--color-border-default); border-radius: 5px; border: 2px solid var(--color-canvas-default); }
            ::-webkit-scrollbar-thumb:hover { background: var(--color-fg-subtle); }

            /* Theme Toggle Button Style in Export */
            .theme-toggle-fab {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: var(--color-canvas-overlay);
                border: 1px solid var(--color-border-default);
                color: var(--color-fg-default);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                z-index: 50;
                font-size: 24px;
                transition: all 0.2s;
            }
            .theme-toggle-fab:hover {
                transform: scale(1.1);
                background-color: var(--color-canvas-subtle);
            }
            `;
            filesFolder.file("nexmark.css", cssVariables);
        }

        // 4. Generate Export Script
        const exportScript = `
        <script>
            function toggleExportTheme() {
            const body = document.body;
            const currentTheme = body.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            body.setAttribute('data-theme', newTheme);
            
            // Update prose class for text contrast inversion
            const container = document.getElementById('nexmark-container');
            if (newTheme === 'dark') {
                container.classList.add('prose-invert');
            } else {
                container.classList.remove('prose-invert');
            }
            }
        <\/script>
        `;

        // 5. Build HTML
        let contentHtml = previewElement.innerHTML;
        const initialProseClass = theme === 'dark' ? 'prose-invert' : '';

        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NexMark Export</title>
    <!-- Offline Assets from ./files/ -->
    <script src="./files/tailwind.js"></script>
    <link rel="stylesheet" href="./files/katex.min.css">
    <link rel="stylesheet" href="./files/nexmark.css">
    
    <script>
        // Configure Tailwind with Variables
        tailwind.config = {
            theme: {
            extend: {
                colors: {
                canvas: { default: 'var(--color-canvas-default)', overlay: 'var(--color-canvas-overlay)', subtle: 'var(--color-canvas-subtle)' },
                fg: { default: 'var(--color-fg-default)', muted: 'var(--color-fg-muted)', subtle: 'var(--color-fg-subtle)' },
                border: { default: 'var(--color-border-default)', muted: 'var(--color-border-muted)' },
                btn: { text: 'var(--color-btn-text)', bg: 'var(--color-btn-bg)', border: 'var(--color-btn-border)', hoverBg: 'var(--color-btn-hover-bg)' },
                accent: { fg: 'var(--color-accent-fg)' },
                success: { fg: 'var(--color-success-fg)' },
                danger: { fg: 'var(--color-danger-fg)' }
                },
                fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji'],
                mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
                }
            }
            }
        }
    </script>
</head>
<body class="bg-canvas-default text-fg-default min-h-screen p-4 md:p-8" data-theme="${theme}">
    
    <div id="nexmark-container" class="max-w-3xl mx-auto prose prose-sm md:prose-base ${initialProseClass} prose-pre:bg-canvas-subtle prose-pre:border prose-pre:border-border-default prose-headings:text-fg-default prose-p:text-fg-default prose-strong:text-fg-default prose-code:text-accent-fg prose-a:text-accent-fg hover:prose-a:underline prose-li:text-fg-default prose-table:border-border-default prose-th:border-border-default prose-td:border-border-default prose-blockquote:border-l-accent-fg prose-blockquote:bg-canvas-overlay prose-blockquote:not-italic prose-blockquote:py-1 prose-blockquote:px-4 prose-hr:border-border-default">
        ${contentHtml}
    </div>

    <button onclick="toggleExportTheme()" class="theme-toggle-fab" title="Toggle Theme">
        🌗
    </button>

    <footer class="mt-12 text-center text-xs text-fg-muted font-mono border-t border-border-muted pt-4">
        Generated with NexMark
    </footer>

    ${exportScript}
</body>
</html>`;

        zip.file("index.html", htmlContent);

        // 6. Generate Zip Blob and Download
        const blob = await zip.generateAsync({type:"blob"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nexmark-export-${new Date().toISOString().slice(0, 10)}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Export failed:", error);
        alert("Failed to export offline files. Check your internet connection (needed once to bundle assets).");
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-canvas-default text-fg-default font-sans overflow-hidden transition-colors duration-300">
      <Header onExport={handleExport} theme={theme} toggleTheme={toggleTheme} />
      
      <main className="flex-1 flex overflow-hidden relative">
        <section 
          className={`
            flex-1 h-full border-r border-border-default flex flex-col transition-colors duration-300
            ${showPreview ? 'hidden md:flex' : 'flex'}
          `}
        >
          <div className="bg-canvas-overlay px-4 py-2 border-b border-border-default text-xs font-bold text-fg-muted uppercase tracking-wider flex justify-between items-center transition-colors duration-300">
            <span>Input (Markdown + LaTeX)</span>
            <span className="md:hidden text-accent-fg" onClick={() => setShowPreview(true)}>
              View Preview &rarr;
            </span>
          </div>
          <Editor value={markdown} onChange={handleMarkdownChange} />
        </section>

        <section 
          className={`
            flex-1 h-full flex flex-col bg-canvas-default transition-colors duration-300
            ${!showPreview ? 'hidden md:flex' : 'flex'}
          `}
        >
          <div className="bg-canvas-overlay px-4 py-2 border-b border-border-default text-xs font-bold text-fg-muted uppercase tracking-wider flex justify-between items-center transition-colors duration-300">
             <span>Rendered Output</span>
             <span className="md:hidden text-accent-fg" onClick={() => setShowPreview(false)}>
              &larr; Edit
            </span>
          </div>
          <Preview content={markdown} theme={theme} />
        </section>

      </main>

      <footer className="h-6 bg-canvas-overlay border-t border-border-default flex items-center px-4 text-[10px] text-fg-muted justify-between select-none transition-colors duration-300">
         <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isExporting ? 'bg-accent-fg animate-pulse' : 'bg-success-fg'}`}></span>
            <span>{isExporting ? 'Bundling Offline Files...' : 'NexMark Ready'}</span>
         </div>
         <div>
            Markdown & LaTeX Supported
         </div>
      </footer>
    </div>
  );
};

export default App;