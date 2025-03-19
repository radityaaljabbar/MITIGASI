// Mock data for the application history
const historyMockData = {
    totalEntries: 3,
    histories: [
      {
        id: 1,
        date: "2024-07-22 10:30",
        summary: {
          income: 5000000,
          expense: 3000000,
          balance: 2000000,
          savings: 1500000,
          investments: 500000
        },
        pdfUrl: "#",
        details: {
          incomeCategories: {
            salary: 4500000,
            sideJobs: 500000
          },
          expenseCategories: {
            rent: 1000000,
            food: 800000,
            transport: 400000,
            utilities: 300000,
            entertainment: 500000
          }
        }
      },
      {
        id: 2,
        date: "2024-07-20 14:15",
        summary: {
          income: 4500000,
          expense: 2800000,
          balance: 1700000,
          savings: 1200000,
          investments: 500000
        },
        pdfUrl: "#",
        details: {
          incomeCategories: {
            salary: 4500000
          },
          expenseCategories: {
            rent: 1000000,
            food: 700000,
            transport: 350000,
            utilities: 300000,
            entertainment: 450000
          }
        }
      },
      {
        id: 3,
        date: "2024-07-18 09:00",
        summary: {
          income: 4000000,
          expense: 2500000,
          balance: 1500000,
          savings: 1000000,
          investments: 500000
        },
        pdfUrl: "#",
        details: {
          incomeCategories: {
            salary: 4000000
          },
          expenseCategories: {
            rent: 1000000,
            food: 600000,
            transport: 300000,
            utilities: 300000,
            entertainment: 300000
          }
        }
      }
    ]
  };
  
  // Format currency to Indonesian Rupiah
  function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }
  
  // Format date to a more readable format
  function formatDate(dateString) {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  }
  
  // Generate summary text from data
  function generateSummaryText(summary) {
    return `Pendapatan: ${formatCurrency(summary.income)}, Pengeluaran: ${formatCurrency(summary.expense)}, Saldo: ${formatCurrency(summary.balance)}`;
  }
  
  // Populate table with history data
  function populateHistoryTable() {
    const tableBody = document.querySelector('.history-list table tbody');
    const totalEntries = document.querySelector('.history-list p strong');
    
    // Clear existing content
    tableBody.innerHTML = '';
    
    // Update total entries text
    totalEntries.textContent = `Total pengisian: ${historyMockData.totalEntries} kali`;
    
    // Add history rows
    historyMockData.histories.forEach(history => {
      const row = document.createElement('tr');
      
      // Date cell
      const dateCell = document.createElement('td');
      dateCell.textContent = history.date;
      row.appendChild(dateCell);
      
      // Summary cell
      const summaryCell = document.createElement('td');
      summaryCell.textContent = generateSummaryText(history.summary);
      row.appendChild(summaryCell);
      
      // Action cell
      const actionCell = document.createElement('td');
      const pdfLink = document.createElement('a');
      pdfLink.href = history.pdfUrl;
      pdfLink.textContent = 'PDF';
      pdfLink.addEventListener('click', (e) => {
        e.preventDefault();
        viewHistoryDetails(history.id);
      });
      actionCell.appendChild(pdfLink);
      row.appendChild(actionCell);
      
      tableBody.appendChild(row);
    });
  }
  
  // View history details (placeholder function)
  function viewHistoryDetails(historyId) {
    console.log(`Viewing details for history ID: ${historyId}`);
    // This would normally fetch details from the server or show a modal
    alert(`Detail untuk riwayat ID: ${historyId} akan ditampilkan di sini.`);
  }
  
  // Handle back button
  function setupBackButton() {
    const backButton = document.querySelector('.back-button');
    backButton.addEventListener('click', () => {
      // Navigate back or to specific page
      window.location.href = '../../../pages/MyFinance/MyFinance_Main.html'; // Change this to your desired page
    });
  }
  
  // Initialize the history page
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize the sidebar toggle functionality
    initSidebar();
    
    // Populate history table with mock data
    populateHistoryTable();
    
    // Setup back button
    setupBackButton();
  });