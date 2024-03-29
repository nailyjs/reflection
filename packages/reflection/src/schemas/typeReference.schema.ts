import { ReflectionObject } from "./typeAnnotation.schema";

export interface ReflectionReferenceObject {
  name: "TSTypeReference";
  /**
   * Examples:
   * - `Promise<string>` => `'Promise'`
   * - `class Test` => `'Test'`
   * - `Test<string>` => `'Test'`
   *
   * @author Zero <gczgroup@qq.com>
   * @date 2024/03/29
   * @type {string}
   * @memberof ReflectionReferenceObject
   */
  typeName: string;
  /**
   * If type has type parameters, this property will be set, otherwise it will be `undefined`.
   * Examples:
   * - `Promise<string>` => `['TSStringKeyword']`
   *
   * @author Zero <gczgroup@qq.com>
   * @date 2024/03/29
   * @type {ReflectionObject[]}
   * @memberof ReflectionReferenceObject
   */
  typeParameters?: ReflectionObject[];
  /**
   * If type is a class, this property will be set, otherwise it will be `undefined`.
   * Examples:
   * - `class Test` => `Test's constructor`
   *
   * @author Zero <gczgroup@qq.com>
   * @date 2024/03/29
   * @type {ReflectionObject}
   * @memberof ReflectionReferenceObject
   */
  referenceItem?: abstract new (...args: any[]) => any;
}
