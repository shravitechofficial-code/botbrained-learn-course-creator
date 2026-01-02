
export enum Persona {
  JOB_SEEKER = 'Job Seeker',
  MID_MANAGEMENT = 'Entry-Mid Management'
}

export enum Vertical {
  GENERIC = 'Generic',
  HR = 'HR',
  MARKETING = 'Marketing',
  PRODUCT = 'Product',
  SALES = 'Sales'
}

export enum Level {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export enum SkillType {
  USING = 'Using AI Applications',
  BUILDING = 'Building AI Applications'
}

export enum BuildType {
  VIBE_CODING = 'Vibe Coding',
  AGENTIC = 'Agentic Systems'
}

export interface SelectionState {
  persona: Persona | null;
  vertical: Vertical | null;
  level: Level | null;
  skillType: SkillType | null;
  buildType: BuildType | null;
}

export interface SyllabusModule {
  title: string;
  description: string;
  lessons: string[];
}

export interface AdSet {
  positioningStatement: string;
  staticImages: { hook: string; visual: string }[];
  carousel: { slideNumber: number; heading: string; body: string; visualDescription: string }[];
  videoIdeas: { title: string; scriptHook: string; animationDescription: string; duration: string }[];
}

export interface SessionPart {
  duration: string;
  topic: string;
  activity: string;
}

export interface ResourceLink {
  title: string;
  url: string;
  type: 'video' | 'blog';
}

export interface Certification {
  name: string;
  provider: string;
  url: string;
}

export interface PresentationSlide {
  slideNumber: number;
  title: string;
  content: string;
  recommendedTool: string;
  toolExplanation: string;
}

export interface RoadmapResult {
  title: string;
  summary: string;
  syllabus: SyllabusModule[];
  marketingStrategy: {
    adSets: AdSet[];
  };
  outcomes: string[];
  sessionBreakdown: SessionPart[];
  tools: string[];
  certifications: Certification[];
  readingMaterials: string[];
  searchResources: ResourceLink[];
  presentationPlan: PresentationSlide[];
  originalSelections?: SelectionState;
}
