import { display } from '../../content/display';
import { authored } from '../../content/authored';
import { Arrow } from './arrow';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

export function Projects() {
  return (
    <section className="section shell" id="work" aria-labelledby="work-title">
      <SectionHeading label={authored.labels.projectsEyebrow} title={authored.labels.selectedProjects} id="work-title" />
      <div className="project-grid">
        {display.projects.map((project, index) => (
          <Reveal className={`project-wrap project-${index + 1}`} key={project.title}>
            <article className="project">
              <div className="project-top"><span className="project-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span className="project-corner" aria-hidden="true"><Arrow /></span></div>
              <h3>{project.title}</h3>
              <ul className="tags" aria-label={authored.labels.capability}>{project.tools.map(tool => <li key={tool}>{tool}</li>)}</ul>
              <p className="project-description">{project.achievements[0]}</p>
              <details className="project-details">
                <summary><span>{authored.labels.projectDetails}</span><span className="details-sign" aria-hidden="true" /></summary>
                <div>{project.achievements.slice(1).map(text => <p key={text}>{text}</p>)}</div>
              </details>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
