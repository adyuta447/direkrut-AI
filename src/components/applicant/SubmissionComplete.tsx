import { CheckCircle, Clock, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SubmissionComplete() {
  const { currentUser, applications } = useApp();

  const userApplications = applications.filter(
    app => app.applicantId === currentUser?.id
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submission Status</h1>
        <p className="text-gray-600">Track your application progress here</p>
      </div>

      {userApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No applications submitted yet</p>
          <p className="text-gray-400 mt-2">Apply for a position to get started</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-start space-x-4">
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-green-900 mb-2">
                Application Submitted Successfully!
              </h2>
              <p className="text-green-700">
                Your application and skill validation have been completed. The HRD team will
                review your submission and contact you soon.
              </p>
            </div>
          </div>

          {userApplications.map(app => (
            <div key={app.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{app.jobTitle}</h3>
                  <p className="text-gray-600">Applied on {app.appliedDate}</p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full font-semibold ${
                    app.status === 'interview'
                      ? 'bg-green-100 text-green-700'
                      : app.status === 'under-review'
                      ? 'bg-blue-100 text-blue-700'
                      : app.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {app.status === 'interview'
                    ? 'Interview Scheduled'
                    : app.status === 'under-review'
                    ? 'Under Review'
                    : app.status === 'rejected'
                    ? 'Not Selected'
                    : 'Submitted'}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Validation Status</p>
                  <div className="flex items-center space-x-2">
                    {app.validationStatus === 'completed' ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-gray-900">Completed</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <span className="font-semibold text-gray-900">Pending</span>
                      </>
                    )}
                  </div>
                </div>

                {app.recommendationScore && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Match Score</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${app.recommendationScore}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-900">
                        {app.recommendationScore}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {app.status === 'interview' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 font-semibold mb-1">Next Steps</p>
                  <p className="text-blue-700">
                    You will receive an email with interview details and schedule soon.
                    Please check your inbox regularly.
                  </p>
                </div>
              )}

              {app.status === 'under-review' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-900 font-semibold mb-1">In Progress</p>
                  <p className="text-yellow-700">
                    Your application is being reviewed by our HRD team. We'll notify you
                    of any updates.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
