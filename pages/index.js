export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <h1 className="text-4xl font-bold text-indigo-800 mb-6">🏫 School Directory</h1>
      <p className="text-gray-700 mb-8">Choose an action:</p>

      <div className="flex gap-6">
        <a
          href="/addSchool"
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
        >
          ➕ Add School
        </a>
        <a
          href="/showSchools"
          className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
        >
          📖 Show Schools
        </a>
      </div>
    </div>
  );
}
