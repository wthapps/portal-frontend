export interface Result {
  name: OsNames | ClientNames;
  version?: number;
}

export interface Test {
  s: OsNames | ClientNames;
  v?: number;
  r: RegExp;
}

export enum OsNames {
  Windows,
  WindowsMobile,
  Android,
  OpenBSD,
  SunOs,
  Linux,
  iOS,
  MacOs,
  QNX,
  UNIX,
  BeOS,
  OS2,
  SearchBot,
  Electron
}

export enum ClientNames {
  Chrome,
  Safari,
  Firefox,
  IE,
  Edge,
  Opera,
  Electron
}

export class ClientDetectorService {
   osStrings: Array<Test> = [
    {s: OsNames.Windows, v: 10, r: /(Windows 10.0|Windows NT 10.0)/},
    {s: OsNames.Windows, v: 8.1, r: /(Windows 8.1|Windows NT 6.3)/},
    {s: OsNames.Windows, v: 8, r: /(Windows 8|Windows NT 6.2)/},
    {s: OsNames.Windows, v: 7, r: /(Windows 7|Windows NT 6.1)/},
    {s: OsNames.Windows, v: 6, r: /Windows NT 6.0/},
    {s: OsNames.Windows, v: 0, r: /Windows NT 5.2/},
    {s: OsNames.Windows, v: 0, r: /(Windows NT 5.1|Windows XP)/},
    {s: OsNames.Windows, v: 0, r: /(Windows NT 5.0|Windows 2000)/},
    {s: OsNames.Windows, v: 0, r: /(Win 9x 4.90|Windows ME)/},
    {s: OsNames.Windows, v: 0, r: /(Windows 98|Win98)/},
    {s: OsNames.Windows, v: 0, r: /(Windows 95|Win95|Windows_95)/},
    {s: OsNames.Windows, v: 0, r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
    {s: OsNames.Windows, v: 0, r: /Windows CE/},
    {s: OsNames.Windows, v: 0, r: /Win16/},
    {s: OsNames.WindowsMobile, v: 0, r: /Windows Phone|iemobile/},
    {s: OsNames.Android, v: 0, r: /Android/},
    {s: OsNames.OpenBSD, v: 0, r: /OpenBSD/},
    {s: OsNames.SunOs, v: 0, r: /SunOS/},
    {s: OsNames.Linux, v: 0, r: /(Linux|X11)/},
    {s: OsNames.iOS, v: 0, r: /(iPhone|iPad|iPod)/},
    {s: OsNames.MacOs, v: 10, r: /Mac OS X/},
    {s: OsNames.MacOs, v: 0, r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
    {s: OsNames.QNX, v: 0, r: /QNX/},
    {s: OsNames.UNIX, v: 0, r: /UNIX/},
    {s: OsNames.BeOS, v: 0, r: /BeOS/},
    {s: OsNames.OS2, v: 0, r: /OS\/2/},
    {s: OsNames.SearchBot, v: 0, r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/},
    {s: OsNames.Electron, v: 0, r: /Electron/}
  ];

  clientStrings: Array<Test> = [
    {s: ClientNames.Electron, r: /Electron/},
    {s: ClientNames.Chrome, r: /Chrome/},
    {s: ClientNames.Safari, r: /Safari/},
    {s: ClientNames.Firefox, r: /Firefox/},
    {s: ClientNames.IE, r: /(MSIE|Trident)/},
    {s: ClientNames.Edge, r: /Edge/},
    {s: ClientNames.Opera, r: /OPR/}
  ];

  test<T extends Result>(array: Array<Test>): T {
    const result: T = <T>{};

    array.forEach((osItem: any) => {
      // console.log(osItem);
      if (osItem.r.test(navigator.userAgent) && !result.name) {
        // console.log(result);
        result.name = osItem.s;
        result.version = osItem.v;
      }
    });
    return result;
  }

  getOs(): Result {
    return this.test(this.osStrings);
  }

  getClient(): Result {
    return this.test(this.clientStrings);
  }

  isMobileDevice(): boolean {
    return this.getOs().name === OsNames.Android ||
      this.getOs().name === OsNames.iOS ||
      this.getOs().name === OsNames.WindowsMobile;
  }

  isPhone(): boolean {
    return this.isMobileDevice() && window.screen.width < 770;
  }
}
