import { useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useGSAP';
import { facultyData, FacultyMember } from '../data/facultyData';

export default function FacultyPage() {
  const headerRef = useScrollReveal<HTMLDivElement>();
  const navigate = useNavigate();

  const head = facultyData.find((f) => f.category === 'head');
  const professors = facultyData.filter((f) => f.category === 'faculty' && f.designation.includes('Professor') && f.designation !== 'Professor & Head');
  const others = facultyData.filter((f) => f.category === 'faculty' && !f.designation.includes('Professor'));
  const retired = facultyData.filter((f) => f.category === 'retired');

  return (
    <div className="page faculty-page">
      <section className="section">
        <div className="container">
          <div ref={headerRef} className="page-header">
            <h1 className="page-title">Faculty Members</h1>
            <p className="page-subtitle">
              Meet the distinguished faculty of the Department of CSE, SUST.
            </p>
          </div>

          {/* Head of Department */}
          {head && (
            <div className="faculty-section">
              <h2 className="faculty-section__title">Head of the Department</h2>
              <div className="faculty-bento faculty-bento--centered">
                <FacultyCard member={head} onClick={() => navigate(`/faculty/${head.slug}`)} />
              </div>
            </div>
          )}

          {/* Professors */}
          {professors.length > 0 && (
            <div className="faculty-section">
              <h2 className="faculty-section__title">Professors</h2>
              <div className="faculty-bento">
                {professors.map((member) => (
                  <FacultyCard key={member.id} member={member} onClick={() => navigate(`/faculty/${member.slug}`)} />
                ))}
              </div>
            </div>
          )}

          {/* Assistant Professors & Lecturers */}
          {others.length > 0 && (
            <div className="faculty-section">
              <h2 className="faculty-section__title">Faculty Members</h2>
              <div className="faculty-bento">
                {others.map((member) => (
                  <FacultyCard key={member.id} member={member} onClick={() => navigate(`/faculty/${member.slug}`)} />
                ))}
              </div>
            </div>
          )}

          {/* Retired Faculty */}
          {retired.length > 0 && (
            <div className="faculty-section">
              <h2 className="faculty-section__title">Retired Faculty</h2>
              <div className="faculty-bento">
                {retired.map((member) => (
                  <FacultyCard key={member.id} member={member} onClick={() => navigate(`/faculty/${member.slug}`)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function FacultyCard({ member, onClick }: { member: FacultyMember; onClick: () => void }) {
  return (
    <div className={`faculty-card${member.is_on_leave ? ' faculty-card--on-leave' : ''}`} onClick={onClick}>
      {/* Full image */}
      <div className="faculty-card__image">
        {member.avatar_url ? (
          <img src={member.avatar_url} alt={member.full_name} />
        ) : (
          <div className="faculty-card__placeholder">
            <FiUser size={48} />
          </div>
        )}
      </div>

      {/* Gradient overlay with text */}
      <div className="faculty-card__overlay">
        <div className="faculty-card__content">
          {member.is_on_leave && (
            <span className="badge badge--warning">On Leave</span>
          )}
          <h3 className="faculty-card__name">{member.full_name}</h3>
          <p className="faculty-card__designation">{member.designation}</p>
        </div>
      </div>

      {/* Accent line */}
      <div className="faculty-card__accent-line" />
    </div>
  );
}

