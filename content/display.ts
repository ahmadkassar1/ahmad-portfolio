import { cv } from './cv';

// Mechanical selections from cv.ts; no independently authored factual copy.
const titleCase = (text: string) => text.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase());
export const display = {
  role: titleCase(cv.headline.split(' — ')[0]),
  focus: cv.headline.split(' — ')[1],
  nameParts: cv.identity.name.split(' '),
  intro: cv.summary.slice(cv.summary.indexOf('Beirut-based')),
  productionLead: cv.summary.slice(cv.summary.indexOf('Shipped features'), cv.summary.indexOf(' — TheBridge')),
  systems: [
    { name: cv.summary.match(/TheBridge/)![0], employer: cv.experience[0].employer },
    { name: cv.summary.match(/Populus/)![0], employer: cv.experience[1].employer },
  ],
  projects: cv.sections[0].items,
  from: cv.summary.match(/database schema/)![0],
  to: cv.summary.match(/shipped UI/)![0],
};
