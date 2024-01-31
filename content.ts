import type { PlasmoCSConfig } from "plasmo"
 
export const config: PlasmoCSConfig = {
  matches: ["https://github.com/PlasmoHQ/plasmo"],
  all_frames: true
}

// contentScript.ts
document.querySelectorAll('button').forEach((element) => {
  // クリッカブル要素のサイズを取得
  const rect = element.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  if (width === 0 || height === 0) {
    return;
  }
  // 要素に枠を追加し、サイズ情報を表示
  const borderDiv = document.createElement('div');
  borderDiv.style.border = '2px solid red';
  borderDiv.style.position = 'absolute';
  borderDiv.style.left = `${rect.left}px`;
  borderDiv.style.top = `${rect.top}px`;
  borderDiv.style.width = `${width}px`;
  borderDiv.style.height = `${height}px`;
  borderDiv.style.boxSizing = 'border-box';
  borderDiv.style.zIndex = '10000';
  borderDiv.textContent = `${width}x${height}`;
  borderDiv.style.color = 'red';
  borderDiv.style.fontSize = '12px';
  borderDiv.style.fontWeight = 'bold';
  // borderDiv.style.backgroundColor = 'white';
  borderDiv.style.padding = '2px';

  document.body.appendChild(borderDiv);
});
