import ReactNativeBlobUtil from 'react-native-blob-util';

// RNFS-compatible shim backed by the maintained react-native-blob-util.
// react-native-fs is unmaintained / not New-Architecture friendly; this lets the
// export screens keep their existing `RNFS.*` logic with only an import swap.
const {fs} = ReactNativeBlobUtil;

const RNFS = {
  CachesDirectoryPath: fs.dirs.CacheDir,
  DocumentDirectoryPath: fs.dirs.DocumentDir,
  DownloadDirectoryPath: fs.dirs.DownloadDir,
  writeFile: (path, contents, encoding = 'utf8') =>
    fs.writeFile(path, contents, encoding),
  exists: path => fs.exists(path),
  mkdir: path => fs.mkdir(path),
  copyFile: (src, dest) => fs.cp(src, dest),
};

export default RNFS;
