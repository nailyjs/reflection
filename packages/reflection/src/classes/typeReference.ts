import * as t from "@babel/types";
import { TypeAnnotationOperation } from "./typeAnnotation";
import { NodePath } from "@babel/core";

export class TypeReferenceOperation {
  constructor(private readonly classPath: NodePath<t.ClassDeclaration>) {}

  private getTSEntityName(typeNode: t.TSEntityName): t.ObjectExpression | t.Identifier {
    if (t.isTSQualifiedName(typeNode)) {
      return t.objectExpression([
        t.objectProperty(t.identifier("name"), t.stringLiteral(typeNode.type)),
        t.objectProperty(t.identifier("left"), this.getTSEntityName(typeNode.left)),
        t.objectProperty(t.identifier("right"), this.getTSEntityName(typeNode.right)),
      ]);
    } else if (t.isIdentifier(typeNode)) {
      return t.identifier(typeNode.name);
    }
  }

  private getTSEntityNameTypeName(typeNode: t.TSEntityName): string {
    if (t.isTSQualifiedName(typeNode)) {
      return this.getTSEntityNameTypeName(typeNode.left);
    } else if (t.isIdentifier(typeNode)) {
      return typeNode.name;
    }
  }

  public getTypeReferenceDetail(typeNode: t.TSTypeReference): t.ObjectExpression {
    const entityName = this.getTSEntityName(typeNode.typeName);
    const deStructEntityName = this.getTSEntityNameTypeName(typeNode.typeName);
    const structure = t.objectExpression([
      t.objectProperty(t.identifier("name"), t.stringLiteral(typeNode.type)),
      t.objectProperty(t.identifier("typeName"), t.stringLiteral(deStructEntityName)),
    ]);

    if (entityName && t.isIdentifier(entityName)) {
      const binding = this.classPath.scope.getBinding(entityName.name);
      // 兼容 class 的情况
      if (binding && binding.path && binding.path.isClassDeclaration()) {
        structure.properties.push(t.objectProperty(t.identifier("referenceItem"), entityName));
        // 兼容 import 的情况
      } else if (binding && binding.path && binding.path.isImportSpecifier() && binding.path.node.importKind === "value") {
        structure.properties.push(t.objectProperty(t.identifier("referenceItem"), entityName));
      }
    } else {
      structure.properties.push(t.objectProperty(t.identifier("referenceItem"), entityName));
    }

    if (typeNode.typeParameters && Array.isArray(typeNode.typeParameters.params)) {
      structure.properties.push(
        t.objectProperty(
          t.identifier("typeParameters"),
          t.arrayExpression(
            typeNode.typeParameters.params.map((param) => new TypeAnnotationOperation(this.classPath).getTypeAnnotationDetail(param)),
          ),
        ),
      );
    }

    return structure;
  }
}
