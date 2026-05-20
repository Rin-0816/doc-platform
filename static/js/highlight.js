// highlight.js — Self-contained syntax highlighter for fenced code blocks.
// Only function declarations — no top-level executable statements.
// XSS safety: operates on textContent only, builds DOM nodes via createElement/createTextNode.
// Never calls innerHTML with user-derived text.

function highlightCodeBlocks(root) {
  if (!root) return;
  root.querySelectorAll("pre > code").forEach(function (codeEl) {
    // Skip mermaid blocks (they become diagrams in renderMarkdown)
    if (codeEl.classList.contains("language-mermaid")) return;
    const lang = detectHighlightLanguage(codeEl);
    const raw = codeEl.textContent;
    const tokens = tokenizeCode(raw, lang);
    if (!tokens) return;
    // Replace children with tokenized spans
    codeEl.replaceChildren(...tokens);
  });
}

function detectHighlightLanguage(codeEl) {
  for (const cls of codeEl.classList) {
    if (cls.startsWith("language-")) {
      return cls.slice("language-".length).toLowerCase();
    }
  }
  return "generic";
}

function tokenizeCode(source, lang) {
  // Returns an array of DOM nodes (Text or span elements).
  // All token content is set via textContent — never innerHTML — to prevent XSS.
  const rules = getLanguageRules(lang);
  if (!rules) return null;

  const nodes = [];
  let pos = 0;
  const len = source.length;

  outer: while (pos < len) {
    for (const rule of rules) {
      rule.re.lastIndex = pos;
      const m = rule.re.exec(source);
      if (m && m.index === pos) {
        const span = document.createElement("span");
        span.className = rule.cls;
        span.textContent = m[0];
        nodes.push(span);
        pos += m[0].length;
        continue outer;
      }
    }
    // No rule matched — emit one character as a text node (accumulate adjacent chars)
    let end = pos + 1;
    // Advance until next potential token start
    while (end < len) {
      let anyMatch = false;
      for (const rule of rules) {
        rule.re.lastIndex = end;
        const m2 = rule.re.exec(source);
        if (m2 && m2.index === end) { anyMatch = true; break; }
      }
      if (anyMatch) break;
      end++;
    }
    nodes.push(document.createTextNode(source.slice(pos, end)));
    pos = end;
  }

  return nodes;
}

function getLanguageRules(lang) {
  // Each rule: { re: RegExp (sticky-like via lastIndex), cls: string }
  // All regexes use the 'g' flag so lastIndex works correctly.

  // Generic fallback: just strings, numbers, comments (line-style)
  const strDQ = { re: /"(?:[^"\\]|\\.)*"/g, cls: "tok-str" };
  const strSQ = { re: /'(?:[^'\\]|\\.)*'/g, cls: "tok-str" };
  const strBT = { re: /`(?:[^`\\]|\\.)*`/g, cls: "tok-str" };
  const numLit = { re: /\b0x[\dA-Fa-f]+|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g, cls: "tok-num" };
  const hashCom = { re: /#[^\n]*/g, cls: "tok-com" };
  const slashCom = { re: /\/\/[^\n]*/g, cls: "tok-com" };
  const blockCom = { re: /\/\*[\s\S]*?\*\//g, cls: "tok-com" };
  const sqlDash = { re: /--[^\n]*/g, cls: "tok-com" };
  const htmlCom = { re: /<!--[\s\S]*?-->/g, cls: "tok-com" };

  function kwRule(words) {
    const pattern = "\\b(?:" + words.join("|") + ")\\b";
    return { re: new RegExp(pattern, "g"), cls: "tok-kw" };
  }

  const jsKw = kwRule([
    "break","case","catch","class","const","continue","debugger","default",
    "delete","do","else","export","extends","false","finally","for","function",
    "if","import","in","instanceof","let","new","null","of","return","static",
    "super","switch","this","throw","true","try","typeof","undefined","var",
    "void","while","with","yield","async","await",
  ]);
  const jsFn = { re: /\b([A-Za-z_$][\w$]*)\s*(?=\()/g, cls: "tok-fn" };

  const pyKw = kwRule([
    "False","None","True","and","as","assert","async","await","break","class",
    "continue","def","del","elif","else","except","finally","for","from",
    "global","if","import","in","is","lambda","nonlocal","not","or","pass",
    "raise","return","try","while","with","yield",
  ]);

  const cssKw = { re: /(?:^|\s)([\w-]+)\s*(?=:)/gm, cls: "tok-kw" };
  const cssVal = { re: /#[0-9A-Fa-f]{3,8}\b|(?:\b\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|pt|s|ms|deg)?\b)/g, cls: "tok-num" };

  const sqlKw = kwRule([
    "SELECT","FROM","WHERE","JOIN","LEFT","RIGHT","INNER","OUTER","ON","GROUP",
    "BY","ORDER","HAVING","LIMIT","OFFSET","INSERT","INTO","VALUES","UPDATE",
    "SET","DELETE","CREATE","TABLE","DROP","ALTER","INDEX","PRIMARY","KEY",
    "FOREIGN","REFERENCES","NOT","NULL","AND","OR","IN","IS","AS","DISTINCT",
    "COUNT","SUM","AVG","MAX","MIN","WITH","UNION","ALL","EXISTS","CASE","WHEN",
    "THEN","ELSE","END","BEGIN","COMMIT","ROLLBACK","CONSTRAINT","UNIQUE",
    "DEFAULT","AUTO_INCREMENT","AUTOINCREMENT","SERIAL","INTEGER","TEXT",
    "VARCHAR","BOOLEAN","FLOAT","DOUBLE","DECIMAL","DATE","TIMESTAMP",
    // lowercase variants
    "select","from","where","join","left","right","inner","outer","on","group",
    "by","order","having","limit","offset","insert","into","values","update",
    "set","delete","create","table","drop","alter","index","primary","key",
    "foreign","references","not","null","and","or","in","is","as","distinct",
    "count","sum","avg","max","min","with","union","all","exists","case","when",
    "then","else","end","begin","commit","rollback","constraint","unique",
    "default","integer","text","varchar","boolean","float","double","decimal",
    "date","timestamp",
  ]);

  const htmlTag = { re: /<\/?[A-Za-z][\w-]*(?:\s[^>]*)?\/?>/g, cls: "tok-kw" };
  const htmlAttr = { re: /\b([\w-]+)\s*=/g, cls: "tok-fn" };

  const jsonKey = { re: /"(?:[^"\\]|\\.)*"\s*(?=:)/g, cls: "tok-fn" };

  const bashKw = kwRule([
    "if","then","else","elif","fi","for","while","until","do","done","case",
    "esac","function","in","return","exit","echo","export","local","readonly",
    "declare","set","unset","shift","source","cd","ls","mkdir","rm","cp","mv",
    "grep","sed","awk","cat","head","tail","find","chmod","chown",
  ]);

  switch (lang) {
    case "js": case "javascript": case "ts": case "typescript": case "jsx": case "tsx":
      return [slashCom, blockCom, strBT, strDQ, strSQ, jsKw, numLit, jsFn];
    case "python": case "py":
      return [hashCom, strDQ, strSQ, strBT, pyKw, numLit];
    case "json":
      return [blockCom, strDQ, jsonKey, numLit,
        { re: /\b(?:true|false|null)\b/g, cls: "tok-kw" }];
    case "bash": case "sh": case "shell":
      return [hashCom, strDQ, strSQ, bashKw, numLit];
    case "html": case "xml":
      return [htmlCom, htmlTag, strDQ, strSQ];
    case "css": case "scss": case "less":
      return [blockCom, strDQ, strSQ, cssVal, cssKw];
    case "sql":
      return [sqlDash, blockCom, strDQ, strSQ, sqlKw, numLit];
    default:
      return [slashCom, hashCom, blockCom, strDQ, strSQ, numLit];
  }
}
