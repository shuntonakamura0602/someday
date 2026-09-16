export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    today: string;
    notes: string;
    about: string;
  };
  localeSwitcher: {
    label: string;
  };
  storage: {
    full: string;
    short: string;
  };
  onboarding: {
    landing: {
      title: string;
      subtitle: string;
      cta: string;
    };
    birthdate: {
      question: string;
      explanation: string;
      srLabel: string;
      continue: string;
    };
    future: {
      title: (futureAge: number) => string;
      body1: string;
      body2: string;
      body3: string;
      reassure: string;
      cta: string;
    };
    returnToday: {
      title: string;
      body: string;
      cta: string;
      noteLink: string;
    };
    note: {
      question: string;
      reassure: string;
      srLabel: string;
      cta: string;
    };
    end: {
      title: string;
      link: string;
    };
  };
  home: {
    heading: (age: number) => { before: string; highlight: string; after: string };
    question: (futureAge: number) => string;
    noteSrLabel: string;
    optional: string;
    placeholder: string;
    saveError: string;
    keep: string;
    cancel: string;
    savedLabel: string;
    edit: string;
    editAriaLabel: string;
    replay: string;
    correctBirthdate: string;
    update: string;
  };
  memories: {
    empty: string;
    emptySubtitle: string;
  };
  about: {
    pageTitle: string;
    body: string;
    analytics: string;
  };
  error: {
    message: string;
    retry: string;
  };
  notFound: {
    message: string;
    backHome: string;
  };
};
