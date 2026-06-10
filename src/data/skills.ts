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
    glbPath: '/3d/typescript-logo.glb',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    shortName: 'JS',
    category: 'languages',
    glbPath: '/3d/javascript-logo.glb',
  },
  {
    id: 'java',
    name: 'Java',
    shortName: 'Java',
    category: 'languages',
    glbPath: '/3d/java-logo.glb',
  },
  {
    id: 'dart',
    name: 'Dart',
    shortName: 'Dart',
    category: 'languages',
    glbPath: '/3d/dart-logo.glb',
  },
  {
    id: 'python',
    name: 'Python',
    shortName: 'Py',
    category: 'languages',
    glbPath: '/3d/python-logo.glb',
  },
  {
    id: 'c',
    name: 'C',
    shortName: 'C',
    category: 'languages',
    glbPath: '/3d/c-logo.glb',
  },
  {
    id: 'cpp',
    name: 'C++',
    shortName: 'C++',
    category: 'languages',
    glbPath: '/3d/cpp-logo.glb',
  },
  {
    id: 'rust',
    name: 'Rust',
    shortName: 'Rust',
    category: 'languages',
    glbPath: '/3d/rust-logo.glb',
  },
  {
    id: 'bash',
    name: 'Bash',
    shortName: 'Bash',
    category: 'languages',
    glbPath: '/3d/bash-logo.glb',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    shortName: 'Node',
    category: 'frameworks',
    glbPath: '/3d/node-logo.glb',
  },
  {
    id: 'react',
    name: 'React',
    shortName: 'React',
    category: 'frameworks',
    glbPath: '/3d/react-logo.glb',
  },
  {
    id: 'angular',
    name: 'Angular',
    shortName: 'Ng',
    category: 'frameworks',
    glbPath: '/3d/angular-logo.glb',
  },
  {
    id: 'sveltekit',
    name: 'SvelteKit',
    shortName: 'Svelte',
    category: 'frameworks',
    glbPath: '/3d/svelte-logo.glb',
  },
  {
    id: 'flutter',
    name: 'Flutter',
    shortName: 'Fltr',
    category: 'frameworks',
    glbPath: '/3d/flutter-logo.glb',
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
    glbPath: '/3d/spring-logo.glb',
  },
  {
    id: 'jquery',
    name: 'jQuery',
    shortName: 'jQ',
    category: 'frameworks',
    glbPath: '/3d/jquery-logo.glb',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    shortName: 'TW',
    category: 'frameworks',
    glbPath: '/3d/tailwind-logo.glb',
  },
  {
    id: 'firebase',
    name: 'Firebase',
    shortName: 'FB',
    category: 'infrastructure',
    glbPath: '/3d/firebase-logo.glb',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    shortName: 'PG',
    category: 'infrastructure',
    glbPath: '/3d/postgresql-logo.glb',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    shortName: 'Mongo',
    category: 'infrastructure',
    glbPath: '/3d/mongodb-logo.glb',
  },
  {
    id: 'docker',
    name: 'Docker',
    shortName: 'Docker',
    category: 'infrastructure',
    glbPath: '/3d/docker-logo.glb',
  },
  {
    id: 'gcp',
    name: 'GCP',
    shortName: 'GCP',
    category: 'infrastructure',
    glbPath: '/3d/gcp-logo.glb',
  },
  {
    id: 'aws',
    name: 'AWS',
    shortName: 'AWS',
    category: 'infrastructure',
    glbPath: '/3d/aws-logo.glb',
  },
  {
    id: 'linux',
    name: 'Linux',
    shortName: 'Linux',
    category: 'infrastructure',
    glbPath: '/3d/linux-logo.glb',
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    shortName: 'GHA',
    category: 'infrastructure',
    glbPath: '/3d/gh-actions-logo.glb',
  },
  {
    id: 'git',
    name: 'Git',
    shortName: 'Git',
    category: 'infrastructure',
    glbPath: '/3d/git-logo.glb',
  },
]
