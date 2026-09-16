import type { Dictionary } from "./types";

export const en: Dictionary = {
  meta: {
    title: "Someday — You'll miss today.",
    description: "A quiet place to see today from the perspective of your future self.",
  },
  nav: {
    today: "Today",
    notes: "Notes",
    about: "About",
  },
  localeSwitcher: {
    label: "日本語",
  },
  storage: {
    full: "Your birthdate and entries are stored only in this browser (never sent to a server). They won't carry over to another device, and clearing your browser data or closing a private window may erase them.",
    short: "This, too, is stored only in this browser.",
  },
  onboarding: {
    landing: {
      title: "Someday, you might miss\nthis ordinary moment of today.",
      subtitle: "A short experience of looking back at today, from a little further down the road.",
      cta: "Begin",
    },
    birthdate: {
      question: "When were you born?",
      explanation: "We'll imagine a little further into your future,\nbased on your age.",
      srLabel: "Birthdate",
      continue: "Continue",
    },
    future: {
      title: (futureAge: number) =>
        `Picture yourself, just for a moment,\nat ${futureAge}.`,
      body1: "You're remembering an ordinary day,\nfrom around the age you are now.",
      body2: "The room you always sat in. A voice you knew by heart.\nThe sky you glanced up at on the way home.",
      body3: "If your future self were to look back fondly,\nwhat moment might it be?",
      reassure: "It's all right if nothing comes to mind.",
      cta: "Return to today",
    },
    returnToday: {
      title: "Today is still here.",
      body: "It doesn't have to be a special day.\nYour today will keep going, either way.",
      cta: "Back to today",
      noteLink: "If something comes to mind, leave a few words",
    },
    note: {
      question: "Is there anything on your mind, right now?",
      reassure: "It's not a promise to do anything.\nIt's fine to finish without writing a word.",
      srLabel: "What's on your mind",
      cta: "Finish",
    },
    end: {
      title: "See you, someday.\nIt's fine to close this now.",
      link: "Go to today's page",
    },
  },
  home: {
    heading: (age: number) => ({ before: "You are ", highlight: `${age} years old`, after: "." }),
    question: (futureAge: number) =>
      `If your ${futureAge}-year-old self came back to today,\nwhat might they think?`,
    noteSrLabel: "What's on your mind",
    optional: "You don't have to write anything.",
    placeholder:
      "For example:\nTake a walk in the park\nReach out to someone you love\nMake a little of something you wanted to make\nDo nothing, slowly",
    saveError: "Couldn't save.\nWhat you wrote is still here on this screen.\nPlease try again.",
    keep: "Keep for today",
    cancel: "Cancel",
    savedLabel: "What you left for today",
    edit: "Edit",
    editAriaLabel: "Edit today's entry",
    replay: "See today from the future again",
    correctBirthdate: "Correct your birthdate",
    update: "Update",
  },
  memories: {
    empty: "There's nothing here yet.",
    emptySubtitle: "The days ahead will settle here, little by little.",
  },
  about: {
    pageTitle: "About — Someday",
    body: "Someday isn't here to rush you.\n\nLife is finite.\n\nBut that doesn't mean today has to be lived\nin a hurry.\n\nLooking back from the future,\nyour ordinary days now\nmight turn out to be more precious than you think.\n\nSomeday is a place\nto remember that, every once in a while.",
    analytics:
      "We only track, anonymously, which screens are viewed and how often. Your birthdate and what you write are never sent anywhere.",
  },
  error: {
    message: "Something didn't work.\nPlease try again.",
    retry: "Try again",
  },
  notFound: {
    message: "This page couldn't be found.",
    backHome: "Back to today's page",
  },
};
