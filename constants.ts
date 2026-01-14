export const INITIAL_MARKDOWN = `# Welcome to NexMark 🚀

NexMark is a clean, developer-focused editor using the **GitHub Dark Dimmed** theme. 

## Features
- **Markdown**: Full GFM support.
- **LaTeX**: Mathematical rendering via KaTeX.
- **Syntax Highlighting**: Code blocks look great.

---

## LaTeX Math Examples 📐

Inline math is easy: $E = mc^2$.

Block math is supported too:

$$
\\frac{1}{\\sigma\\sqrt{2\\pi}} \\int_{-\\infty}^{\\infty} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}} dx = 1
$$

Maxwell's Equations:
$$
\\begin{aligned}
\\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\varepsilon_0} \\\\
\\nabla \\cdot \\mathbf{B} &= 0 \\\\
\\nabla \\times \\mathbf{E} &= -\\frac{\\partial \\mathbf{B}}{\\partial t} \\\\
\\nabla \\times \\mathbf{B} &= \\mu_0\\mathbf{J} + \\mu_0\\varepsilon_0\\frac{\\partial \\mathbf{E}}{\\partial t}
\\end{aligned}
$$

---

## Code Blocks 💻

\`\`\`typescript
interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
}

const nex: User = {
  id: 1,
  name: "Nex",
  role: 'admin'
};

console.log(\`Hello \${nex.name}!\`);
\`\`\`

## Tables 📊

| Command | Description | Shortcut |
| :--- | :--- | :--- |
| \`git status\` | List all new or modified files | \`gs\` |
| \`git diff\` | Show file differences | \`gd\` |
| \`git add\` | Add file to staging | \`ga\` |

Enjoy writing! ✍️
`;