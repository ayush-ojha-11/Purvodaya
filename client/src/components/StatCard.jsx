const StatCard = ({ title, value, icon }) => {
  return (
    <div className="card bg-base-200 shadow-md">
      <div className="card-body flex flex-row items-center gap-4">
        <div className="text-primary">{icon}</div>
        <div>
          <h2 className="text-sm font-medium text-base-content">{title}</h2>
          <p className="text-2xl font-bold text-base-content">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
