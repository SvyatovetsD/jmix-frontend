import * as ts from "typescript";
import {EnumDeclaration} from "typescript";
import {ProjectEntityInfo} from "./model/entities-generation";
import {BASE_ENTITIES_DIR, ENUMS_DIR, ENUMS_FILE} from "./common";
import {getEntityModulePath} from "./utils";
import * as path from "path";

export type ImportInfo = {
  className: string;
  importPath: string;
}

export function createIncludes(importInfos: ImportInfo[], current?: ImportInfo): ts.ImportDeclaration[] {

  //filter unique and exclude current entity, group by importPath
  const importByPathMap: Map<string, ImportInfo[]> = new Map();
  importInfos
    .filter(imp => !isImportEquals(imp, current))
    .forEach(imp => {
      const importByPath = importByPathMap.get(imp.importPath);
      if (importByPath) {
        if (!importByPath.some(i => isImportEquals(i, imp))) {
          importByPath.push(imp);
        }
      } else {
        importByPathMap.set(imp.importPath, [imp]);
      }
    });

  return [...importByPathMap.entries()]
    .map(([importPath, importInfos]) => {

      const elements = importInfos.map(ii =>
        ts.createImportSpecifier(undefined, ts.createIdentifier(ii.className)));

      return ts.createImportDeclaration(
        undefined,
        undefined,
        ts.createImportClause(
          undefined,
          ts.createNamedImports(elements)
        ),
        ts.createLiteral(importPath),
      );
    });
}

export function entityImportInfo(importedEntity: ProjectEntityInfo, prefix: string = ''): ImportInfo {
  const basePrefix = importedEntity.isBaseProjectEntity ? '' + BASE_ENTITIES_DIR : '';
  return {
    importPath: './' + getEntityModulePath(importedEntity.entity, path.join(prefix, basePrefix)),
    className: importedEntity.entity.className
  };
}

export function enumImportInfo(ed: EnumDeclaration, pathPrefix?: string) {
  return {
    className: ed.name.text,
    importPath: './' + path.join(pathPrefix ? pathPrefix : '', `${ENUMS_DIR}/${ENUMS_FILE}`)
  };
}


export function isImportEquals(ii1: ImportInfo | undefined, ii2: ImportInfo | undefined): boolean {
  if (ii1 == undefined && ii2 == undefined) return true;
  if (ii1 == undefined || ii2 == undefined) return false;
  return ii1.importPath == ii2.importPath && ii1.className == ii2.className;
}
