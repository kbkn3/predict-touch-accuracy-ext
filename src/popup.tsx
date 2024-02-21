import { useState } from "react"

import { Device } from "~device"

function IndexPopup() {
  const [deviceState, setDeviceState] = useState(Device.iPhoneSE.getName())

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDevice = Device.create(e.target.value)
    setDeviceState(newDevice.getName())

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.debugger.attach(
          {
            tabId: tabs[0].id
          },
          "1.3",
          function () {
            void chrome.debugger.sendCommand(
              {
                tabId: tabs[0]?.id
              },
              "Emulation.setDeviceMetricsOverride",
              {
                width: newDevice.getWidth(),
                height: newDevice.getHeight(),
                deviceScaleFactor: newDevice.getViewport().deviceScaleFactor,
                mobile: true,
                fitWindow: true
              }
            )
          }
        )
      }
      setTimeout(() => {
        if (tabs[0]?.id) {
          const tabId = tabs[0].id
          const resetResponse = chrome.tabs.sendMessage(tabId, {
            type: "reset"
          })
          const response = chrome.tabs.sendMessage(tabId, {
            type: "run",
            message: "click",
            deviceName: newDevice.getName()
          })
        }
      }, 1000)
    })
  }

  const handleClickAnalyze = () => {
    const newDevice = Device.create(deviceState)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.debugger.attach(
          {
            tabId: tabs[0].id
          },
          "1.3",
          function () {
            void chrome.debugger.sendCommand(
              {
                tabId: tabs[0]?.id
              },
              "Emulation.setDeviceMetricsOverride",
              {
                width: newDevice.getWidth(),
                height: newDevice.getHeight(),
                deviceScaleFactor: newDevice.getViewport().deviceScaleFactor,
                mobile: true,
                fitWindow: true
              }
            )
          }
        )
      }
      if (tabs[0]?.id) {
        const tabId = tabs[0].id
        const resetResponse = chrome.tabs.sendMessage(tabId, {
          type: "reset"
        })
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
          const response = chrome.tabs.sendMessage(tabId, {
            type: "run",
            message: "click",
            deviceName: deviceState
          })
        }, 1000)
      }
    })
  }

  const handleClickReset = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // debuggerをデタッチする
      void chrome.debugger.detach({ tabId: tabs[0]?.id })
      if (tabs[0]?.id) {
        const response = chrome.tabs.sendMessage(tabs[0].id, {
          type: "reset"
        })
      }
    })
  }

  const screenShot = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // レイアウト情報取得
      chrome.debugger.sendCommand(
        { tabId: tabs[0]?.id },
        "Page.getLayoutMetrics",
        {},
        (metrics) => {
          const newDevice = Device.create(deviceState)
          // スクリーンショットパラメータ作成
          const params = {
            format: "png",
            quality: 50,
            clip: {
              x: 0,
              y: 0,
              width: newDevice.getWidth(),
              height: newDevice.getHeight(),
              scale: 1
            },
            captureBeyondViewport: true
          }
          // スクリーンショット撮影
          chrome.debugger.sendCommand(
            { tabId: tabs[0]?.id },
            "Page.captureScreenshot",
            params,
            (result) => {
              if (result) {
                // 画像保存
                const downloadEle = document.createElement("a")
                downloadEle.href = "data:image/png;base64," + result.data
                downloadEle.download = "screenshot.png"
                downloadEle.click()
              }
            }
          )
        }
      )
    })
  }

  return (
    <div>
      <style>
        {`
        body {
          font-family: "Arial", sans-serif;
          font-size: 16px;
          background-color: #F7F7F9;
        }
        button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          background-color: #007bff;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
        button:active {
          background-color: #004286;
        }
        button:focus {
          outline: none;
        }
        select {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          border: 1px solid #ccc;
        }
        select:focus {
          outline: none;
        }
        a {
          font-size: 0.8rem;
          color: #007bff;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      `}
      </style>
      <div
        style={{
          padding: 8,
          width: 250,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff"
        }}>
        <h1
          style={{
            marginBottom: 8
          }}>
          Tapper
        </h1>
        <p
          style={{
            margin: "10px 16px",
            fontSize: "0.8rem"
          }}>
          スマートフォンのウェブ画面上のボタンやリンクなどの大きさを分析し、タップの成功率を表示するツールです。
        </p>
        <label
          style={{
            fontSize: "0.8rem",
            marginBottom: 8
          }}
          htmlFor="device-select">
          分析する端末を選択してください
        </label>
        <select
          name="smartphone"
          id="device-select"
          value={deviceState}
          onChange={handleChange}>
          {Device.getModelList().map((device) => (
            <option key={device.getName()} value={device.getName()}>
              {device.getName()}
            </option>
          ))}
        </select>
        <div
          style={{
            margin: "16px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 8
          }}>
          <button onClick={handleClickAnalyze}>分析</button>
          <button onClick={screenShot}>スクリーンショット</button>
          <button onClick={handleClickReset}>リセット</button>
        </div>
        <div>
          <a href="https://tappy.yahoo.co.jp/" target="_blank" rel="noreferrer">
            Inspired by Tappy from Yahoo
          </a>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
