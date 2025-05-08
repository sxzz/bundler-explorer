export function useSourceFile(
  filename: string,
  code: string,
  isEntry?: boolean,
) {
  const sourceFile: SourceFile = {
    filename,
    code,
    isEntry,
    rename(newName: string) {
      this.filename = newName
    },
    toJSON() {
      return {
        n: this.filename,
        c: this.code,
        e: this.isEntry,
      }
    },
  }
  return sourceFile
}

export function useSourceFileFromJSON(json: any) {
  return useSourceFile(json.n, json.c, json.e)
}

export interface SourceFile {
  filename: string
  code: string
  isEntry?: boolean | undefined
  rename: (newName: string) => void
  toJSON: () => object
}

export type SourceFileMap = Map<string, SourceFile>
