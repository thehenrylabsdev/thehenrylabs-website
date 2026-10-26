export interface TranslationSchema {
  nav: {
    home: string;
    about: string;
    work: string;
    labs: string;
    writing: string;
    resume: string;
    hire: string;
    contact: string;
    language: string;
  };
  hero: {
    badge: string;
    greeting: string;
    name: string;
    role: string;
    specialty: string;
    summary: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaHire: string;
    statsYears: string;
    statsBudget: string;
    statsFPS: string;
  };
  flagship: {
    badge: string;
    title: string;
    description: string;
    launchLive: string;
    viewCaseStudy: string;
    specReference: string;
    modeNative: string;
    modeSimulation: string;
    metricDualEngine: string;
    metricA11y: string;
    metricZeroDrift: string;
  };
  sections: {
    featuredWork: string;
    featuredLabs: string;
    recentArticles: string;
    workSummary: string;
    labsSummary: string;
  };
  footer: {
    tagline: string;
    copyright: string;
    rights: string;
    openSource: string;
  };
  common: {
    readMore: string;
    viewProject: string;
    sourceCode: string;
    benchmarks: string;
    status: string;
    stack: string;
    publishedOn: string;
  };
}

export const en: TranslationSchema = {
  nav: {
    home: 'Home',
    about: 'About',
    work: 'Work',
    labs: 'Labs',
    writing: 'Writing',
    resume: 'Resume',
    hire: 'Hire Me',
    contact: 'Contact',
    language: 'Tiếng Việt',
  },
  hero: {
    badge: 'Available for Principal / Staff Opportunities',
    greeting: "Hi, I'm",
    name: 'Henry Nguyen',
    role: 'Principal Software Engineer',
    specialty: 'Backend & Distributed Systems · Applied AI',
    summary:
      'Architecting resilient distributed systems and orchestrating autonomous AI agent pipelines. Based in Vietnam, building for the global web.',
    ctaPrimary: 'Explore Engineering Labs',
    ctaSecondary: 'Download Resume',
    ctaHire: 'Get in Touch',
    statsYears: 'Years Experience',
    statsBudget: 'Monthly AI Pipeline Scale',
    statsFPS: 'Native Canvas Target',
  },
  flagship: {
    badge: 'Flagship Research',
    title: 'WICG HTML-in-Canvas Lab & Benchmark Suite',
    description:
      'An empirical engineering investigation and interactive test harness for rendering live accessible DOM subtrees directly into 2D, WebGL, and WebGPU canvas contexts via drawElementImage and texElementSubImage2D.',
    launchLive: 'Launch Fullscreen Sandbox',
    viewCaseStudy: 'Read Technical Case Study',
    specReference: 'WICG Specification',
    modeNative: 'Native API Active',
    modeSimulation: 'Simulation Engine Active',
    metricDualEngine: 'Dual-Engine Architecture',
    metricA11y: '100% Retained DOM Accessibility',
    metricZeroDrift: 'Sub-Pixel Matrix Sync',
  },
  sections: {
    featuredWork: 'Featured Production Systems',
    featuredLabs: 'Interactive Technology Demonstrations',
    recentArticles: 'Technical Writing & Architecture Notes',
    workSummary: 'Deep-dive case studies covering distributed batch systems, AI context engines, and real-time graphics.',
    labsSummary: 'Live client-side interactive sandboxes built with React, WebGL, WebGPU, and vanilla web standards.',
  },
  footer: {
    tagline: 'Engineering the intersection of Distributed Systems & Frontier AI.',
    copyright: 'All rights reserved.',
    rights: 'Designed and built with Astro, Cloudflare Workers, and zero tracking cookies.',
    openSource: 'Source on GitHub',
  },
  common: {
    readMore: 'Read more',
    viewProject: 'View project',
    sourceCode: 'Source code',
    benchmarks: 'Benchmarks',
    status: 'Status',
    stack: 'Technology Stack',
    publishedOn: 'Published on',
  },
};

export type TranslationKey = TranslationSchema;
