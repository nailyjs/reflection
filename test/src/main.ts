import "./metadata";

function Injectable() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (target: Function, ctx: DecoratorContext) => {};
}

class AppService {}

@Injectable()
export class TestService {
  @Injectable()
  private readonly app: string;

  @Injectable()
  set testMethodAsync(i: typeof AppService) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return [1, ""];
  }

  @Injectable()
  testMethodGenerator() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return [1, ""];
  }
}

console.dir(TestService[Symbol.metadata], {
  depth: null,
});
