import { cv } from '../../content/cv';
import { authored } from '../../content/authored';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

export function Experience() {
  return (
    <section className="section shell" id="experience" aria-labelledby="experience-title">
      <SectionHeading label={authored.labels.experience} title={authored.labels.production} id="experience-title" />
      <div className="experience-list">
        {cv.experience.map(role => (
          <Reveal key={role.employer}>
            <article className="experience-row">
              <div className="experience-meta"><p className="date">{role.datesAsWritten}</p><p>{role.location}</p></div>
              <div className="experience-content">
                <h3>{role.employer}</h3><p className="role-title">{role.title}</p>
                <ul className="achievement-list">{role.achievements.map(achievement => <li key={achievement}>{achievement}</li>)}</ul>
                <ul className="tags" aria-label={authored.labels.capability}>{role.tools.map(tool => <li key={tool}>{tool}</li>)}</ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
