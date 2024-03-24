import * as t from "@babel/types";
import { Transformer } from "unplugin-ast";
import { ClassMethodOperation } from "./classMethod";
import { ClassPropertyOperation } from "./classProperty";

export const classNames: { [id: string]: string[] }[] = [];
export function isInclude(className: string, id: string): boolean {
  return classNames[id].includes(className);
}

export const Reflection = [
  {
    onNode({ type }) {
      if (type === "ClassDeclaration") return true;
      return false;
    },
    transform(node, code, { id }) {
      if (!classNames[id]) classNames[id] = [];
      (classNames[id] as string[]).push(node.id.name);
      if (!node.decorators) return node;
      node.decorators.unshift(
        t.decorator(
          t.callExpression(t.identifier("Reflect.metadata"), [
            t.stringLiteral("design:naily:methods"),
            t.objectExpression([
              t.objectProperty(t.identifier("type"), t.stringLiteral("class")),
              t.objectProperty(t.identifier("name"), t.stringLiteral(node.id.name)),
              t.objectProperty(
                t.identifier("items"),
                t.arrayExpression(
                  node.body.body.map((node) => {
                    if (t.isClassMethod(node)) return new ClassMethodOperation(id).getClassMethod(node);
                    if (t.isClassProperty(node)) return new ClassPropertyOperation().getClassProperty(node);
                    return t.objectExpression([t.objectProperty(t.identifier("type"), t.stringLiteral("undefined"))]);
                  }),
                ),
              ),
            ]),
          ]),
        ),
      );
      return node;
    },
  },
] satisfies Transformer<t.ClassDeclaration>[];
