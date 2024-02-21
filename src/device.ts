import { knownDevices } from "~Puppeteer/Device"
import type {Viewport} from "~Puppeteer/Viewport"

// 主要なスマートフォンの解像度情報を定義
// Define resolution information for major smartphones

// Viewport情報は2024年2月時点のPuppeteer, Playwrightの情報を使用
// Viewport information uses information from Puppeteer and Playwright as of February 2024

export class Device {

  public static readonly iPhoneSE = new Device(
    "iPhone SE",
    knownDevices.find((device) => device.name === "iPhone SE")?.viewport as Viewport,
    326
  )
  public static readonly iPhoneXR = new Device(
    "iPhone XR",
    knownDevices.find((device) => device.name === "iPhone XR")?.viewport as Viewport,
    326
  )
  public static readonly iPhone12 = new Device(
    "iPhone 12",
    knownDevices.find((device) => device.name === "iPhone 12")?.viewport as Viewport,
    460
  )
  public static readonly iPhone12Pro = new Device(
    "iPhone 12 Pro",
    knownDevices.find((device) => device.name === "iPhone 12 Pro")?.viewport as Viewport,
    460
  )
  public static readonly iPhone14ProMax = new Device(
    "iPhone 14 Pro Max",
    {
      width: 430,
      height: 740,
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      isLandscape: false
    } as Viewport,
    460
  )
  public static readonly Pixel7 = new Device(
    "Pixel 7",
    {
      width: 412,
      height: 839,
      deviceScaleFactor: 2.625,
      isMobile: true,
      hasTouch: true,
      isLandscape: false
    } as Viewport,
    416
  )
  public static readonly GalaxyS8Plus = new Device(
    "Galaxy S8 Plus",
    {
      width: 360,
      height: 740,
      deviceScaleFactor: 4,
      isMobile: true,
      hasTouch: true,
      isLandscape: false
    } as Viewport,
    529
  )
  public static readonly GalaxyS20Ultra = new Device(
    "Galaxy S20 Ultra",
    {
      width: 412,
      height: 915,
      deviceScaleFactor: 3.5,
      isMobile: true,
      hasTouch: true,
      isLandscape: false
    } as Viewport,
    511
  )

  private static readonly MODEL_LIST = new Map<string, Device>([
    [Device.iPhoneSE.name, Device.iPhoneSE],
    [Device.iPhoneXR.name, Device.iPhoneXR],
    [Device.iPhone12.name, Device.iPhone12],
    [Device.iPhone12Pro.name, Device.iPhone12Pro],
    [Device.iPhone14ProMax.name, Device.iPhone14ProMax],
    [Device.Pixel7.name, Device.Pixel7],
    [Device.GalaxyS8Plus.name, Device.GalaxyS8Plus],
    [Device.GalaxyS20Ultra.name, Device.GalaxyS20Ultra]
  ])
  /**
   * @param name スマートフォンのモデル名 - Name of the smartphone
   * @param viewport スマートフォンの解像度情報 - Resolution information of the smartphone
   * @param ppi スマートフォンのppi - Pixels per inch of the smartphone
   */
  private constructor(
    private readonly name: string,
    private readonly viewport: Viewport,
    private readonly ppi: number
  ) {}

  public static create(name: string): Device {
    const instance = Device.MODEL_LIST.get(name)
    if (instance) {
      return instance
    }
    throw new Error(`定義されていないdeviceの値が入力されました`)
  }
  public getPpi(): number {
    return this.ppi
  }
  public getName(): string {
    return this.name
  }
  public getViewport(): Viewport {
    return this.viewport
  }
  public getWidth(): number {
    return this.viewport.width
  }
  public getHeight(): number {
    return this.viewport.height
  }
  public static getModelList(): Device[] {
    return Array.from(Device.MODEL_LIST.values())
  }
}
