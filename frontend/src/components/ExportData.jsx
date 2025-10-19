import { Download, FileText, Calendar } from 'lucide-react';
import { formatDate, getCategoryLabel } from '../utils/helpers';

const ExportData = ({ donations, user }) => {
  const exportToCSV = () => {
    if (!donations || donations.length === 0) {
      alert('No donations to export');
      return;
    }

    // CSV headers
    const headers = [
      'Date',
      'Title',
      'Category',
      'Food Type',
      'Servings',
      'Status',
      'Location',
      'Claimed By',
      'Completed At',
    ];

    // CSV rows
    const rows = donations.map((d) => [
      formatDate(d.createdAt),
      d.title,
      getCategoryLabel(d.category),
      d.foodType,
      d.servings,
      d.status,
      d.pickupLocation?.address?.city || 'N/A',
      d.claimedBy?.name || 'N/A',
      d.completedAt ? formatDate(d.completedAt) : 'N/A',
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${cell}"`).join(',')
      ),
    ].join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `donations-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    if (!donations || donations.length === 0) {
      alert('No donations to export');
      return;
    }

    // Create export data
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        name: user?.name,
        email: user?.email,
        organizationType: user?.organizationType,
      },
      totalDonations: donations.length,
      donations: donations.map((d) => ({
        id: d._id,
        date: formatDate(d.createdAt),
        title: d.title,
        description: d.description,
        category: getCategoryLabel(d.category),
        foodType: d.foodType,
        servings: d.servings,
        status: d.status,
        location: d.pickupLocation?.address,
        claimedBy: d.claimedBy?.name,
        completedAt: d.completedAt ? formatDate(d.completedAt) : null,
      })),
    };

    // Download JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `donations-${new Date().toISOString().split('T')[0]}.json`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateReport = () => {
    if (!donations || donations.length === 0) {
      alert('No donations to generate report');
      return;
    }

    // Calculate statistics
    const totalServings = donations.reduce((sum, d) => sum + d.servings, 0);
    const completedCount = donations.filter((d) => d.status === 'completed').length;
    const categories = {};
    donations.forEach((d) => {
      categories[d.category] = (categories[d.category] || 0) + 1;
    });

    // Create HTML report
    const reportHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Donation Report - ${formatDate(new Date())}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: #f9fafb;
    }
    h1 {
      color: #059669;
      border-bottom: 3px solid #059669;
      padding-bottom: 10px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-left: 4px solid #059669;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #059669;
    }
    .stat-label {
      color: #6b7280;
      margin-top: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-radius: 10px;
      overflow: hidden;
    }
    th {
      background: #059669;
      color: white;
      padding: 12px;
      text-align: left;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    tr:hover {
      background: #f3f4f6;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <h1>📊 Donation Report</h1>
  <p><strong>Generated:</strong> ${formatDate(new Date())}</p>
  <p><strong>User:</strong> ${user?.name || 'Unknown'}</p>

  <div class="stats">
    <div class="stat-card">
      <div class="stat-value">${donations.length}</div>
      <div class="stat-label">Total Donations</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${totalServings}</div>
      <div class="stat-label">Total Servings</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${completedCount}</div>
      <div class="stat-label">Completed</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${Math.round((completedCount / donations.length) * 100)}%</div>
      <div class="stat-label">Completion Rate</div>
    </div>
  </div>

  <h2>Donation Details</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Title</th>
        <th>Category</th>
        <th>Servings</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${donations
        .map(
          (d) => `
        <tr>
          <td>${formatDate(d.createdAt)}</td>
          <td>${d.title}</td>
          <td>${getCategoryLabel(d.category)}</td>
          <td>${d.servings}</td>
          <td><span style="padding: 4px 12px; background: ${
            d.status === 'completed' ? '#d1fae5' : '#dbeafe'
          }; color: ${
            d.status === 'completed' ? '#065f46' : '#1e40af'
          }; border-radius: 12px; font-size: 12px; font-weight: bold;">${d.status}</span></td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    <p>Generated by FoodShare Platform</p>
    <p>© ${new Date().getFullYear()} - Making a difference, one meal at a time</p>
  </div>
</body>
</html>
    `;

    // Open report in new window
    const newWindow = window.open('', '_blank');
    newWindow.document.write(reportHTML);
    newWindow.document.close();
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <Download className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Export Your Data</h2>
          <p className="text-sm text-gray-600">Download your donation history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Export CSV */}
        <button
          onClick={exportToCSV}
          className="group p-5 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-xl bg-green-100 group-hover:bg-green-200 flex items-center justify-center mb-3 transition-colors">
              <FileText className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Export CSV</h3>
            <p className="text-xs text-gray-600">
              Spreadsheet format for Excel, Google Sheets
            </p>
          </div>
        </button>

        {/* Export JSON */}
        <button
          onClick={exportToJSON}
          className="group p-5 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mb-3 transition-colors">
              <Download className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Export JSON</h3>
            <p className="text-xs text-gray-600">
              Structured data format for developers
            </p>
          </div>
        </button>

        {/* Generate Report */}
        <button
          onClick={generateReport}
          className="group p-5 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-xl bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center mb-3 transition-colors">
              <Calendar className="h-7 w-7 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">View Report</h3>
            <p className="text-xs text-gray-600">
              Detailed HTML report with statistics
            </p>
          </div>
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold">📥 Export Information:</span> Your donation data includes all details like dates, titles, categories, servings, and status. Reports are generated instantly and can be saved for your records.
        </p>
      </div>
    </div>
  );
};

export default ExportData;
