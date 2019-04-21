import {PrimitiveType, TargetComponent} from '../src/api';
import {createProgramForFixture} from './helpers';

beforeAll(() => {
  // Allow 1 minute per test.
  jest.setTimeout(6e5);
});

/**
 * @internal
 */
const findProperty = (component: TargetComponent, name: string) =>
  component.properties.find((property) => property.name === name)!;

describe('compiler program', () => {
  test('valid program', async () => {
    const program = await createProgramForFixture('Valid');
    expect(program.targetComponents.size).toBe(3);
    expect(program.localComponentNames).toEqual(['Valid']);

    const validComponent = program.targetComponents.get('Valid')!;
    expect(validComponent).toBeDefined();
    expect(validComponent.properties.length).toBe(10);

    expect(findProperty(validComponent, 'int').type).toBe(PrimitiveType.Int);
    expect(findProperty(validComponent, 'int').depth).toBe(0);
    expect(findProperty(validComponent, 'number').type).toBe(PrimitiveType.Float);
    expect(findProperty(validComponent, 'float').type).toBe(PrimitiveType.Float);
    expect(findProperty(validComponent, 'string').type).toBe(PrimitiveType.String);
    expect(findProperty(validComponent, 'boolean').type).toBe(PrimitiveType.Boolean);

    expect(findProperty(validComponent, 'stringEnum').type).toBe(PrimitiveType.String);
    expect(findProperty(validComponent, 'numberEnum').type).toBe(PrimitiveType.Float);

    const list1 = findProperty(validComponent, 'validListDepth1');
    const list2 = findProperty(validComponent, 'validListDepth2');
    expect(list1.type).toBe(PrimitiveType.Float);
    expect(list2.type).toBe(PrimitiveType.String);
    expect(list1.depth).toBe(1);
    expect(list2.depth).toBe(2);

    const warnings = validComponent.warnings;
    expect(warnings.ambiguousTypes.has('invalidEnum')).toBe(true);
    expect(warnings.ambiguousTypes.has('unknown')).toBe(true);
    expect(warnings.ambiguousTypes.has('any')).toBe(true);
    expect(warnings.ambiguousTypes.has('union')).toBe(true);
    expect(warnings.ambiguousTypes.has('invalidListUniformDepth')).toBe(true);
    expect(warnings.ambiguousTypes.has('invalidListUniformType')).toBe(true);

    const child = findProperty(validComponent, 'child');
    expect(child.type).toBe('ChildComponent');
    expect(child.isComponent).toBe(true);

    const childComponent = program.targetComponents.get('ChildComponent')!;
    expect(childComponent).toBeDefined();
    expect(childComponent.properties.length).toBe(1);
    expect(childComponent.warnings.ambiguousTypes.size).toBe(0);

    const grandchild = findProperty(childComponent, 'grandchild');
    expect(grandchild.type).toBe('GrandchildComponent');
    expect(grandchild.isComponent).toBe(true);

    const grandchildComponent = program.targetComponents.get('GrandchildComponent')!;
    expect(grandchildComponent).toBeDefined();
    expect(grandchildComponent.properties.length).toBe(1);
    expect(grandchildComponent.warnings.ambiguousTypes.size).toBe(0);

    const diez = findProperty(grandchildComponent, 'diez');
    expect(diez.type).toBe(PrimitiveType.String);
    expect(diez.isComponent).toBe(false);
  });
});