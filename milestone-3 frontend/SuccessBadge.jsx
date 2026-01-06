const SuccessBadge = ({ score }) => {
  if (score >= 90) return <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">🏆 Outstanding</span>;
  if (score >= 75) return <span className="bg-green-400 text-white px-3 py-1 rounded-full text-xs">⭐ Successful</span>;
  if (score >= 50) return <span className="bg-yellow-400 text-white px-3 py-1 rounded-full text-xs">⚠ Average</span>;
  return <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs">❌ Poor</span>;
};

export default SuccessBadge;
