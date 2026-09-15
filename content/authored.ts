// Only non-factual connective prose and interface labels belong here.
// Website copy added after the user explicitly instructed us to create the site.
export interface AuthoredContent {
  connectiveSentences: string[];
  labels: Record<string, string>;
}

export const authored: AuthoredContent = {
  connectiveSentences: ['A closer look at the work.', 'Thanks for stopping by.'],
  labels: {
    skip: 'Skip to content', navigation: 'Main navigation', work: 'Work',
    experience: 'Experience', about: 'Background', contact: 'Contact',
    theme: 'Toggle light and dark theme', getInTouch: 'Get in touch',
    emailAction: 'Email', explore: 'Explore the work', selectedProjects: 'Selected projects',
    projectsEyebrow: 'From the project archive', projectDetails: 'More about this project',
    closeDetails: 'Less detail', production: 'Production experience',
    capability: 'Capabilities', skillTitle: 'Tools behind the work.',
    background: 'A little context.', education: 'Education', languages: 'Languages',
    letsTalk: 'Let’s talk.', contactEyebrow: 'Start a conversation',
    copyEmail: 'Copy email', copied: 'Email copied', copyFailed: 'Could not copy. Use the email link.',
    linkedin: 'LinkedIn', github: 'GitHub', downloadCV: 'Download CV',
    cvNote: 'PDF · Redacted copy', cvDate: 'Redacted 15 Sep 2026',
    backTop: 'Back to top', home: 'Home', notFound: 'This page isn’t here.',
    returnHome: 'Return to the portfolio', overview: 'Overview',
  },
};
