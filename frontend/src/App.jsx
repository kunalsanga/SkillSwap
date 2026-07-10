import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-indigo-600">Skill Swap Platform</h1>
      </header>
      
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<div className="text-center mt-20"><h2 className="text-4xl font-extrabold text-gray-800">Welcome to Skill Swap</h2><p className="mt-4 text-gray-600 text-lg">Exchange skills, learn together.</p></div>} />
          {/* Add more routes here */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
