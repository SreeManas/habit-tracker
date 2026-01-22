export const IdentityQuestion = ({ answer, onAnswer }) => {
  return (
    <div className="identity-question">
      <h2 className="identity-title">
        "Did I act like the man I want to become today?"
      </h2>
      <div className="identity-actions">
        <button
          className={`btn-identity ${answer === true ? 'active yes' : ''}`}
          onClick={() => onAnswer(true)}
        >
          ✓ Yes
        </button>
        <button
          className={`btn-identity ${answer === false ? 'active no' : ''}`}
          onClick={() => onAnswer(false)}
        >
          ✗ No
        </button>
      </div>
      {answer !== null && (
        <p className="identity-feedback">
          {answer 
            ? "You're building the man you want to become. Keep going." 
            : "Awareness is the first step. Tomorrow is a new opportunity."}
        </p>
      )}
    </div>
  );
};
