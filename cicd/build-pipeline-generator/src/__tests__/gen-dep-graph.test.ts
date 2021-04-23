import mockFs from 'mock-fs'

import generateDepGraph from '../gen-dep-graph'
import { mockComponent } from './__helpers__/mockComponent'

afterEach(mockFs.restore)

test(`
.
└── app1
`, () => {
  mockFs({
    ...mockComponent('app1'),
  })

  const graph = generateDepGraph(process.cwd())
  expect(graph.size()).toBe(1)
  expect(graph.entryNodes().length).toBe(1)
  expect(graph.overallOrder(true).length).toBe(1)
  expect(graph.directDependenciesOf('app1')).toEqual([])
  expect(graph.getNodeData('app1').path).toBeDefined()
})

test(`
.
└── app1
    └── lib1
`, () => {
  mockFs({
    ...mockComponent('app1', 'lib1'),
    ...mockComponent('lib1'),
  })

  const graph = generateDepGraph(process.cwd())
  expect(graph.size()).toBe(2)
  expect(graph.entryNodes().length).toBe(1)
  expect(graph.overallOrder(true).length).toBe(1)
  expect(graph.directDependenciesOf('app1')).toEqual(['lib1'])
  expect(graph.getNodeData('app1').path).toBeDefined()
  expect(graph.directDependenciesOf('lib1')).toEqual([])
  expect(graph.getNodeData('lib1').path).toBeDefined()
})

test(`
.
├── app1
│   └── lib1
└── app2
    └── lib1
`, () => {
  mockFs({
    ...mockComponent('app1', 'lib1'),
    ...mockComponent('app2', 'lib1'),
    ...mockComponent('lib1'),
  })

  const graph = generateDepGraph(process.cwd())
  expect(graph.size()).toBe(3)
  expect(graph.entryNodes().length).toBe(2)
  expect(graph.overallOrder(true).length).toBe(1)
  expect(graph.directDependenciesOf('app1')).toEqual(['lib1'])
  expect(graph.getNodeData('app1').path).toBeDefined()
  expect(graph.directDependenciesOf('app2')).toEqual(['lib1'])
  expect(graph.getNodeData('app2').path).toBeDefined()
  expect(graph.directDependenciesOf('lib1')).toEqual([])
  expect(graph.getNodeData('lib1').path).toBeDefined()
})

test(`
.
├── app1
│   ├── lib1
│   └── lib2
└── app2
    ├── lib1
    └── lib2
`, () => {
  mockFs({
    ...mockComponent('app1', 'lib1', 'lib2'),
    ...mockComponent('app2', 'lib1', 'lib2'),
    ...mockComponent('lib1'),
    ...mockComponent('lib2'),
  })

  const graph = generateDepGraph(process.cwd())
  expect(graph.size()).toBe(4)
  expect(graph.entryNodes().length).toBe(2)
  expect(graph.overallOrder(true).length).toBe(2)
  expect(graph.directDependenciesOf('app1')).toEqual(['lib1', 'lib2'])
  expect(graph.getNodeData('app1').path).toBeDefined()
  expect(graph.directDependenciesOf('app2')).toEqual(['lib1', 'lib2'])
  expect(graph.getNodeData('app2').path).toBeDefined()
  expect(graph.directDependenciesOf('lib1')).toEqual([])
  expect(graph.getNodeData('lib1').path).toBeDefined()
  expect(graph.directDependenciesOf('lib2')).toEqual([])
  expect(graph.getNodeData('lib2').path).toBeDefined()
})

test(`
.
└── tests1
    ├── app1
    │   ├── lib1
    │   └── lib2
    └── app2
        ├── lib1
        └── lib2
`, () => {
  mockFs({
    ...mockComponent('app1', 'lib1', 'lib2'),
    ...mockComponent('app2', 'lib1', 'lib2'),
    ...mockComponent('lib1'),
    ...mockComponent('lib2'),
    ...mockComponent('tests1', 'app1', 'app2'),
  })

  const graph = generateDepGraph(process.cwd())
  expect(graph.size()).toBe(5)
  expect(graph.entryNodes().length).toBe(1)
  expect(graph.overallOrder(true).length).toBe(2)
  expect(graph.directDependenciesOf('app1')).toEqual(['lib1', 'lib2'])
  expect(graph.getNodeData('app1').path).toBeDefined()
  expect(graph.directDependenciesOf('app2')).toEqual(['lib1', 'lib2'])
  expect(graph.getNodeData('app2').path).toBeDefined()
  expect(graph.directDependenciesOf('lib1')).toEqual([])
  expect(graph.getNodeData('lib1').path).toBeDefined()
  expect(graph.directDependenciesOf('lib2')).toEqual([])
  expect(graph.getNodeData('lib2').path).toBeDefined()
  expect(graph.directDependenciesOf('tests1')).toEqual(['app1', 'app2'])
  expect(graph.getNodeData('tests1').path).toBeDefined()
})

test(`
.
├── app3
├── tests1
│   ├── app1
│   │   ├── lib1
│   │   └── lib3
│   │       └── lib2
│   └── app2
│       └── lib3
│           └── lib2
└── tests2
    └── app2
        └── lib3
            └── lib2
`, () => {
  mockFs({
    ...mockComponent('a/app1', 'lib1', 'lib3'),
    ...mockComponent('b/app2', 'lib1', 'lib3'),
    ...mockComponent('c/app3'),
    ...mockComponent('d/lib1'),
    ...mockComponent('e/lib2'),
    ...mockComponent('f/lib3', 'lib2'),
    ...mockComponent('g/tests1', 'app1', 'app2'),
    ...mockComponent('h/tests2', 'app2'),
  })

  const graph = generateDepGraph(process.cwd())
  expect(graph.size()).toBe(8)
  expect(graph.entryNodes().length).toBe(3)
  expect(graph.overallOrder(true).length).toBe(3)
  expect(graph.directDependenciesOf('app1')).toEqual(['lib1', 'lib3'])
  expect(graph.getNodeData('app1').path).toBeDefined()
  expect(graph.directDependenciesOf('app2')).toEqual(['lib1', 'lib3'])
  expect(graph.getNodeData('app2').path).toBeDefined()
  expect(graph.directDependenciesOf('app3')).toEqual([])
  expect(graph.getNodeData('app3').path).toBeDefined()
  expect(graph.directDependenciesOf('lib1')).toEqual([])
  expect(graph.getNodeData('lib1').path).toBeDefined()
  expect(graph.directDependenciesOf('lib2')).toEqual([])
  expect(graph.getNodeData('lib2').path).toBeDefined()
  expect(graph.directDependenciesOf('lib3')).toEqual(['lib2'])
  expect(graph.getNodeData('lib3').path).toBeDefined()
  expect(graph.directDependenciesOf('tests1')).toEqual(['app1', 'app2'])
  expect(graph.getNodeData('tests1').path).toBeDefined()
  expect(graph.directDependenciesOf('tests2')).toEqual(['app2'])
  expect(graph.getNodeData('tests2').path).toBeDefined()
})

test('missing Jenkinsfile in app1', () => {
  mockFs({
    app1: {
      VERSION: '0.1.0',
    },
  })

  expect(() => {
    generateDepGraph(process.cwd())
  }).toThrowError('app1 is missing a Jenkinsfile')
})

test('missing Jenkinsfile in lib1', () => {
  mockFs({
    lib1: {
      VERSION: '0.1.0',
    },
    app1: {
      deps: 'lib1',
      Jenkinsfile: 'stage {}',
      VERSION: '0.1.0',
    },
  })

  expect(() => {
    generateDepGraph(process.cwd())
  }).toThrowError('lib1 is missing a Jenkinsfile')
})

test('missing VERSION', () => {
  mockFs({
    lib1: {
      Jenkinsfile: 'stage {}',
    },
    app1: {
      deps: 'lib1',
      Jenkinsfile: 'stage {}',
      VERSION: '0.1.0',
    },
  })

  expect(() => {
    generateDepGraph(process.cwd())
  }).toThrowError('lib1 is missing from repo or is missing a VERSION file')
})

test('missing lib', () => {
  mockFs({
    app1: {
      deps: 'lib1',
      Jenkinsfile: 'stage {}',
      VERSION: '0.1.0',
    },
  })

  expect(() => {
    generateDepGraph(process.cwd())
  }).toThrowError('lib1 is missing from repo or is missing a VERSION file')
})

test('do not include root', () => {
  mockFs({
    VERSION: '0.1.0',
    Jenkinsfile: 'stage {}',
    ...mockComponent('app1'),
  })

  const graph = generateDepGraph(process.cwd())
  expect(graph.size()).toBe(1)
})