export function applyChromeTheme(element:HTMLElement){
  const css=getComputedStyle(element);
  document.documentElement.style.setProperty('--chrome-bg',css.getPropertyValue('--bg'));
  document.documentElement.style.setProperty('--chrome-fg',css.getPropertyValue('--fg'));
}