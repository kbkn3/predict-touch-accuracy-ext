import type { PlasmoCSConfig } from "plasmo"

import { Device } from "~device"

export const config: PlasmoCSConfig = {
  all_frames: true
}

export type Message = {
  type?: "run" | "reset"
  deviceName?: string
}

/**
 * メッセージを受信し、メッセージのタイプに応じて処理を実行します。
 * Receives messages and performs processing according to the message type.
 */
chrome.runtime.onMessage.addListener(function (
  message: Message,
  _sender,
  _sendResponse
) {
  if (message.type === "run") {
    if (message.deviceName) {
      const deviceName = message.deviceName
      renderTouchAccuracy(deviceName)
      return true
    }
  } 
  if (message.type === "reset") {
    const numberDivs = document.querySelectorAll(".tapper-number")
    numberDivs.forEach((numberDiv) => {
      numberDiv.remove()
    })
    const borderDivs = document.querySelectorAll(".tapper-border")
    borderDivs.forEach((borderDiv) => {
      borderDiv.remove()
    })
  }

  return true
})

/**
 * 指定されたデバイスのタッチ精度をレンダリングします。 - Renders touch accuracy for the specified device.
 * @param deviceName - デバイスの名前。 - The name of the device.
 */
const renderTouchAccuracy = (deviceName: string) => {
  const device = Device.create(deviceName)
  const clickableSelectors = [
    "a",
    "button",
    'input[type="button"]',
    'input[type="submit"]'
  ] // Add other selectors as needed
  const clickableElements = document.querySelectorAll(
    clickableSelectors.join(",")
  )

  const visibleElements = Array.from(clickableElements).filter((element) => {
    const style = window.getComputedStyle(element)
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0"
    )
  })

  visibleElements.forEach((element) => {
    // クリッカブル要素のサイズを取得
    const rect = element.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    if (width === 0 || height === 0) {
      return
    }
    // タップ成功率を求める
    const tapSuccessRate = calcTapSuccessRateRodShaped(
      pxToMm(width, device.getPpi()),
      pxToMm(height, device.getPpi())
    )

    // 要素に枠を追加する。
    const borderDiv = document.createElement("div")
    borderDiv.className = "tapper-border"
    borderDiv.style.border = "1px solid lime"
    borderDiv.style.position = "absolute"
    borderDiv.style.left = `${rect.left}px`
    borderDiv.style.top = `${rect.top}px`
    borderDiv.style.width = `${width}px`
    borderDiv.style.height = `${height}px`
    borderDiv.style.boxSizing = "border-box"
    borderDiv.style.zIndex = "10000"
    borderDiv.style.padding = "2px"
    borderDiv.style.pointerEvents = "none"

    // 枠にテキスト欄を追加し、要素のサイズを表示する。
    const numberDiv = document.createElement("div")
    numberDiv.className = "tapper-number"
    numberDiv.textContent = (tapSuccessRate * 100).toFixed(2)
    numberDiv.style.backgroundColor = "lime"
    numberDiv.style.color = "black"
    numberDiv.style.fontSize = "0.5em"
    numberDiv.style.position = "absolute"
    numberDiv.style.right = "0"
    numberDiv.style.bottom = "0"
    numberDiv.style.padding = "2px"
    numberDiv.style.pointerEvents = "none"

    borderDiv.appendChild(numberDiv)
    document.body.appendChild(borderDiv)
  })
}

/**
 * ピクセルをミリメートルに変換 - Converts pixels to millimeters.
 * @param px - The number of pixels.
 * @param ppi - The pixels per inch.
 * @returns 同等なミリメートルの値 - The equivalent value in millimeters.
 */
const pxToMm = (px: number, ppi: number) => {
  return (px / ppi) * 25.4
}
/**
 * 横長の棒状ターゲットのタップ成功率を求める関数。
 * 成功率はオブジェクトの向き（縦長か横長か）に依存します。
 * Calculates the tap success rate for a rod-shaped object given its width and height.
 * The success rate depends on the orientation of the object (whether it is taller or wider).
 *
 * @param width - オブジェクトの幅。 (mm)  - The width of the object. (mm)
 * @param height - オブジェクトの高さ。 (mm) - The height of the object. (mm)
 * @param device - タップ成功率を求めるためのデバイス情報。 - Device information for calculating the tap success rate.
 * @returns 特定の計算後の成功率を返します。 - Returns the success rate after a specific calculation.
 */
const calcTapSuccessRateRodShaped = (width: number, height: number) => {
  const sigma_x_2 = 1.037 + 0.0084 * width ** 2
  const sigma_y_2 = 1.0539 + 0.011 * height ** 2
  return (
    erf(width / (2 * Math.sqrt(2) * Math.sqrt(sigma_x_2))) *
    erf(height / (2 * Math.sqrt(2) * Math.sqrt(sigma_y_2)))
  )
}

/**
 * 指定された数値の誤差関数（erf）を計算します。 - Calculates the error function (erf) of a given number.
 * @param x - 誤差関数を計算する数値。 - The number to calculate the error function for.
 * @returns 指定された数値の誤差関数の値。 - The error function value of the given number.
 */
const erf = (x: number): number => {
  // constants
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  // sign of x
  const sign = x < 0 ? -1 : 1
  x = Math.abs(x)

  // A&S formula 7.1.26
  const t = 1.0 / (1.0 + p * x)
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

  return sign * y
}
