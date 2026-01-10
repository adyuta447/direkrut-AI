import { useState } from "react";
import { Search, MapPin, Briefcase, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function JobsPage() {
  const { setCurrentPage, jobs } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      !locationFilter ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !typeFilter || job.type === typeFilter;
    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentPage("landing")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TalentAI</span>
            </div>
            <button
              onClick={() => setCurrentPage("auth")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Find Your Dream Job
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h2>
                  <p className="text-lg text-gray-700 mb-1">{job.company}</p>
                  <p className="text-sm text-blue-600 font-semibold mb-2">
                    {job.department}
                  </p>
                  <div className="flex items-center space-x-4 text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {job.type}
                    </span>
                    <span className="text-sm">Posted {job.posted}</span>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentPage("auth")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Apply Now
                </button>
              </div>
              <p className="text-gray-600 mb-4">{job.description}</p>
              <div className="flex flex-wrap gap-2">
                {job.requirements.map((req, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No jobs found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
