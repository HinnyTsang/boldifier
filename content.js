function isEnglish(text) {
  // Simple heuristic: check for Latin letters and common English words
  const commonWords = ["the", "and", "is", "in", "it", "of", "to", "a"];
  const wordMatches = text.match(/\b\w+\b/g);
  if (!wordMatches) return false;
  let englishCount = 0;
  for (const word of wordMatches) {
    if (/^[a-zA-Z]+$/.test(word)) englishCount++;
    if (commonWords.includes(word.toLowerCase())) englishCount++;
  }
  return englishCount > wordMatches.length / 2;
}

function boldifyTextNode(node) {
  const text = node.nodeValue;
  if (!isEnglish(text)) return;
  const replaced = text.replace(/\b(\w{2})(\w*)\b/g, (match, p1, p2) => {
    return `<span style=\"font-weight:bold;\">${p1}</span>${p2}`;
  });
  if (replaced !== text) {
    const span = document.createElement('span');
    span.innerHTML = replaced;
    node.parentNode.replaceChild(span, node);
  }
}

function walk(node) {
  if (node.nodeType === 3) {
    boldifyTextNode(node);
  } else if (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
    for (let child = node.firstChild; child; child = child.nextSibling) {
      walk(child);
    }
  }
}

walk(document.body);
