import { cv } from '../../content/cv';
import { authored } from '../../content/authored';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

export function Background() {
  return (
    <>
      <section className="section skills-section" aria-labelledby="skills-title">
        <div className="shell">
          <SectionHeading label={authored.labels.capability} title={authored.labels.skillTitle} id="skills-title" />
          <div className="skills-grid">{cv.skills.map(group => <Reveal key={group.title}><div className="skill-group"><h3>{group.title}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></div></Reveal>)}</div>
        </div>
      </section>
      <section className="section shell" id="background" aria-labelledby="background-title">
        <SectionHeading label={authored.labels.about} title={authored.labels.background} id="background-title" />
        <div className="background-grid">
          <div><h3 className="eyebrow group-label">{authored.labels.education}</h3>
            {cv.education.map(item => <article className="education-item" key={item.title}><p className="date">{item.datesAsWritten}</p><h4>{item.title}</h4><p className="institution">{item.institution}</p>{item.description && <p>{item.description}</p>}</article>)}
          </div>
          <div className="language-list"><h3 className="eyebrow group-label">{authored.labels.languages}</h3>{cv.languages.map(language => <div className="language-item" key={language.name}><h4>{language.name}</h4><p>{language.proficiency}</p></div>)}</div>
        </div>
      </section>
    </>
  );
}
