// Global teardown for About Me page testing
const fs = require('fs');
const path = require('path');

async function globalTeardown() {
  console.log('\n🏁 About Me page testing suite completed');
  
  // Calculate test execution time
  const startTime = process.env.TEST_START_TIME;
  if (startTime) {
    const executionTime = Date.now() - parseInt(startTime);
    const minutes = Math.floor(executionTime / 60000);
    const seconds = ((executionTime % 60000) / 1000).toFixed(1);
    console.log(`⏱️  Total execution time: ${minutes}m ${seconds}s`);
  }

  // Generate test summary if results exist
  try {
    const resultsPath = 'test-results/results.json';
    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      
      console.log('\n📊 Test Summary:');
      console.log(`   Total Tests: ${results.stats?.total || 'N/A'}`);
      console.log(`   Passed: ${results.stats?.passed || 'N/A'}`);
      console.log(`   Failed: ${results.stats?.failed || 'N/A'}`);
      console.log(`   Skipped: ${results.stats?.skipped || 'N/A'}`);
      
      if (results.stats?.failed > 0) {
        console.log('❌ Some tests failed. Check the HTML report for details.');
      } else {
        console.log('✅ All tests passed successfully!');
      }
    }
  } catch (error) {
    console.log('📊 Test results summary not available');
  }

  // Provide links to generated reports
  console.log('\n📋 Generated Reports:');
  
  const reports = [
    { name: 'HTML Report', path: 'test-results/html-report/index.html' },
    { name: 'JSON Results', path: 'test-results/results.json' },
    { name: 'JUnit Report', path: 'test-results/junit.xml' },
    { name: 'Screenshots', path: 'screenshots/' },
    { name: 'Visual Baselines', path: 'visual-baselines/' }
  ];

  reports.forEach(report => {
    if (fs.existsSync(report.path)) {
      console.log(`   ✅ ${report.name}: ${report.path}`);
    } else {
      console.log(`   ➖ ${report.name}: Not generated`);
    }
  });

  // Performance and quality insights
  console.log('\n🎯 Quality Insights:');
  console.log('   • Review Core Web Vitals metrics in performance tests');
  console.log('   • Check accessibility compliance in the HTML report');
  console.log('   • Validate SEO metadata completeness');
  console.log('   • Verify responsive design across all devices');
  console.log('   • Ensure security headers are properly configured');

  // Cleanup temporary files if needed
  try {
    // Clean up any temporary test files
    const tempFiles = ['temp-screenshot.png', 'temp-data.json'];
    tempFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`🧹 Cleaned up temporary file: ${file}`);
      }
    });
  } catch (error) {
    console.log('🧹 Cleanup completed with some warnings');
  }

  // Final recommendations
  console.log('\n💡 Recommendations:');
  console.log('   • Run tests regularly to catch regressions early');
  console.log('   • Monitor performance metrics over time');
  console.log('   • Update test thresholds based on real user data');
  console.log('   • Keep accessibility compliance at 100%');
  console.log('   • Review and update SEO metadata quarterly');

  console.log('\n🎉 Happy testing! The About Me page is ready to impress visitors.\n');
}

module.exports = globalTeardown;