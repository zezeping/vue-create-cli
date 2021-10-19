export function getScrollParent (el, root = document.documentElement) {
  let node = el
  while (node !== root) {
    const { overflowY } = window.getComputedStyle(node)
    if (/scroll|auto/i.test(overflowY)) {
      return node
    }
    node = node.parentNode
  }
  return root
}