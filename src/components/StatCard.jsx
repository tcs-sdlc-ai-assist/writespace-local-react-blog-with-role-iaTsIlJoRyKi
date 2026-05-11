import PropTypes from 'prop-types';

export function StatCard({ label, value, icon }) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-2xl text-indigo-600">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
};