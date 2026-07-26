function DashboardCard({
  title,
  value,
  icon: Icon,
  color = "bg-blue-500",
}) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>

        <h2 className="text-3xl font-bold mt-2">
          {value}
        </h2>
      </div>

      <div
        className={`${color} h-14 w-14 rounded-xl flex items-center justify-center text-white`}
      >
        {Icon && <Icon size={28} />}
      </div>
    </div>
  );
}

export default DashboardCard;