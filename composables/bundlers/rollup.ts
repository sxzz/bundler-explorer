import { rollup as build, type LogLevel, type RollupLog } from '@rollup/browser'
import type { Bundler } from './index'
import ts from 'typescript';

export const rollup: Bundler = {
  id: 'rollup',
  name: 'Rollup',
  icon: 'i-logos:rollupjs',
  pkgName: '@rollup/browser',
  async build(code, config) {
    const entry = '_virtual-entry.ts'
    const warnings: string[] = []
    const bundle = await build({
      input: [entry],
      onLog(level: LogLevel, log: RollupLog, logger) {
        if (level === 'warn') {
          warnings.push(String(log))
        } else {
          logger(level, log)
        }
      },
      ...config,
      plugins: [
        {
          name: 'entry',
          resolveId(source) {
            return source === entry ? source : null
          },
          load(id) {
            return id === entry ? code : null
          },
        },
        {
          name: 'typescript',
          filter: /\.ts$/,
          transform(code) {
            const result = ts.transpileModule(code, {
              compilerOptions: {
                module: ts.ModuleKind.ESNext,
                target: ts.ScriptTarget.ESNext,
                sourceMap: true,
              },
            });
            return {
              code: result.outputText,
              map: result.sourceMapText ? JSON.parse(result.sourceMapText) : null,
            };
          }
        },
        config?.plugins,
      ],
    })
    const result = await bundle.generate({
      format: 'esm',
      ...config?.output,
    })
    return {
      code: result.output[0].code,
      warnings,
    }
  },
}
