export type SkillCategory = 'languages' | 'frameworks' | 'infrastructure'

export type Skill = {
  id: string
  name: string
  shortName: string
  category: SkillCategory
  glbPath: string | null
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  'languages',
  'frameworks',
  'infrastructure',
]

export const CATEGORY_LABELS: Record<SkillCategory, string> = {
  languages: 'Languages',
  frameworks: 'Frameworks',
  infrastructure: 'Infrastructure',
}

export const SKILLS: Skill[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    shortName: 'TS',
    category: 'languages',
    // glbPath: '/3d/typescript-logo.glb',
    glbPath: null,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    shortName: 'JS',
    category: 'languages',
    glbPath: null,
  },
  {
    id: 'java',
    name: 'Java',
    shortName: 'Java',
    category: 'languages',
    // glbPath: '/3d/java-logo.glb',
    glbPath: null,
  },
  {
    id: 'dart',
    name: 'Dart',
    shortName: 'Dart',
    category: 'languages',
    // glbPath: '/3d/dart-logo.glb',
    glbPath: null,
  },
  {
    id: 'python',
    name: 'Python',
    shortName: 'Py',
    category: 'languages',
    // glbPath: '/3d/python-logo.glb',
    glbPath: null,
  },
  {
    id: 'c',
    name: 'C',
    shortName: 'C',
    category: 'languages',
    // glbPath: '/3d/c-logo.glb',
    glbPath: null,
  },
  {
    id: 'cpp',
    name: 'C++',
    shortName: 'C++',
    category: 'languages',
    // glbPath: '/3d/cpp-logo.glb',
    glbPath: null,
  },
  {
    id: 'rust',
    name: 'Rust',
    shortName: 'Rust',
    category: 'languages',
    // glbPath: '/3d/rust-logo.glb',
    glbPath: null,
  },
  {
    id: 'bash',
    name: 'Bash',
    shortName: 'Bash',
    category: 'languages',
    // glbPath: '/3d/bash-logo.glb',
    glbPath: null,
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    shortName: 'Node',
    category: 'frameworks',
    // glbPath: '/3d/node-logo.glb',
    glbPath: null,
  },
  {
    id: 'react',
    name: 'React',
    shortName: 'React',
    category: 'frameworks',
    // glbPath: '/3d/react-logo.glb',
    glbPath: null,
  },
  {
    id: 'angular',
    name: 'Angular',
    shortName: 'Ng',
    category: 'frameworks',
    // glbPath: '/3d/angular-logo.glb',
    glbPath: null,
  },
  {
    id: 'sveltekit',
    name: 'SvelteKit',
    shortName: 'Svelte',
    category: 'frameworks',
    // glbPath: '/3d/svelte-logo.glb',
    glbPath: null,
  },
  {
    id: 'flutter',
    name: 'Flutter',
    shortName: 'Fltr',
    category: 'frameworks',
    // glbPath: '/3d/flutter-logo.glb',
    glbPath: null,
  },
  {
    id: 'express',
    name: 'Express',
    shortName: 'Expr',
    category: 'frameworks',
    glbPath: null,
  },
  {
    id: 'springboot',
    name: 'Spring Boot',
    shortName: 'Spring',
    category: 'frameworks',
    glbPath: null,
  },
  {
    id: 'jquery',
    name: 'jQuery',
    shortName: 'jQ',
    category: 'frameworks',
    glbPath: null,
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    shortName: 'TW',
    category: 'frameworks',
    glbPath: null,
  },
  {
    id: 'firebase',
    name: 'Firebase',
    shortName: 'FB',
    category: 'infrastructure',
    // glbPath: '/3d/firebase-logo.glb',
    glbPath: null,
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    shortName: 'PG',
    category: 'infrastructure',
    // glbPath: '/3d/postgresql-logo.glb',
    glbPath: null,
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    shortName: 'Mongo',
    category: 'infrastructure',
    // glbPath: '/3d/mongodb-logo.glb',
    glbPath: null,
  },
  {
    id: 'docker',
    name: 'Docker',
    shortName: 'Docker',
    category: 'infrastructure',
    glbPath: null,
  },
  {
    id: 'gcp',
    name: 'GCP',
    shortName: 'GCP',
    category: 'infrastructure',
    glbPath: null,
  },
  {
    id: 'aws',
    name: 'AWS',
    shortName: 'AWS',
    category: 'infrastructure',
    glbPath: null,
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    shortName: 'GHA',
    category: 'infrastructure',
    glbPath: null,
  },
  {
    id: 'git',
    name: 'Git',
    shortName: 'Git',
    category: 'infrastructure',
    glbPath: null,
  },
]
