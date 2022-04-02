/**
 * 浏览器中复制文本
 * 创建一个不可见的输入框，并将文本赋值
 * 若浏览器不绘制dom，则选取无法建立
 * @param {Object} text
 */
export function isUndefined(o: any) {
  return typeof o === 'undefined';
}

export function copy(text: string) {
  const id = 'lz-copy-hide-dom';
  let elem = document.getElementById(id) as HTMLInputElement;
  if (!elem) {
    elem = document.createElement('input');
    elem.style.height = '0px';
    elem.style.outline = '0px';
    elem.style.borderWidth = '0px';
    elem.style.padding = '0 0';
    elem.style.margin = '0 0';
    elem.style.position = 'fixed';
    document.body.appendChild(elem);
  }

  elem.value = text;
  elem.select();
  elem.setSelectionRange(0, elem.value.length);
  document.execCommand('copy');
}

export function debounce(func: Function, time = 300) {
  let handler = null as any;
  return (...arg: any) => {
    if (handler) {
      window.clearTimeout(handler);
    }
    handler = setTimeout(() => {
      func.apply(arg);
    }, time);
  };
}
