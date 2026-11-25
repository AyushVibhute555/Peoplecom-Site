export function applyChromeTheme(element:HTMLElement,scene?:string){
  const css=getComputedStyle(element);
  document.documentElement.style.setProperty('--chrome-bg',css.getPropertyValue('--bg'));
  document.documentElement.style.setProperty('--chrome-fg',css.getPropertyValue('--fg'));
  if(scene)window.dispatchEvent(new CustomEvent('peoplecom:scene',{detail:scene}));
}