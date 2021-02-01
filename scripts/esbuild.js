const ts = require("typescript");
const esbuild = require('esbuild');

const cwd = process.cwd();

function getTSConfig(_tsConfigFile = "tsconfig.json") {
  const tsConfigFile = ts.findConfigFile(cwd, ts.sys.fileExists, _tsConfigFile);
  if (!tsConfigFile) {
    throw new Error(`tsconfig.json not found in the current directory! ${cwd}`);
  }
  const configFile = ts.readConfigFile(tsConfigFile, ts.sys.readFile);
  const tsConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    cwd
  );
  return { tsConfig, tsConfigFile };
}

const { tsConfig, tsConfigFile } = getTSConfig();

esbuild.buildSync({
  outdir: 'dist_esbuild',
  entryPoints: tsConfig.fileNames,
  sourcemap: !!tsConfig.options.sourceMap,
  target: 'node14',
  tsconfig: tsConfigFile,
  bundle: false,
  format: "cjs",
  platform: "node",
})
