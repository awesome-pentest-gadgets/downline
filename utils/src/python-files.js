// From https://www.pypy.org/download.html
export
  const pythonFiles = [
    {
      url: "https://downloads.python.org/pypy/pypy3.9-v7.3.11-linux64.tar.bz2",
      isNative: () => process.platform === "linux" && process.arch === "x64",
    },
    {
      url: "https://downloads.python.org/pypy/pypy3.9-v7.3.11-win64.zip",
      isNative: () => process.platform === "win32" && process.arch === "x64",
    },
    {
      url: "https://downloads.python.org/pypy/pypy3.9-v7.3.11-macos_arm64.tar.bz2",
      isNative: () => process.platform === "darwin" && process.arch === "arm64",
    }
    ,
    {
      url: "https://downloads.python.org/pypy/pypy3.9-v7.3.11-macos_x86_64.tar.bz2",
      isNative: () => process.platform === "darwin" && process.arch === "x64",
    },
    {
      url: "https://downloads.python.org/pypy/pypy3.9-v7.3.11-aarch64.tar.bz2",
      isNative: () => process.platform === "linux" && process.arch === "arm64",
    }
  ];
