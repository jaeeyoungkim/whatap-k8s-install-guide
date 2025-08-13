// Test script to reproduce the duplicate openAgent issue
const { generateInstallationFiles } = require('./src/utils/generator');

// Test configuration matching the issue description:
// 방식: operator, 버전: stable, 런타임: containerd, GPU, OpenMetrics
const testConfig = {
  accessKey: 'x43a42205jmf3-x5u4rg9ronek18-z3088t61gv7v40',
  whatapServer: '15.165.146.117',
  whatapPort: '6600',
  imageVersion: 'stable',
  installMethod: 'operator',
  k8sVersion: '1.16+',
  containerRuntime: 'containerd',
  isGke: false,
  isOpenShift: false,
  isIstio: false,
  isGpu: true,        // GPU enabled
  useApm: false,
  useOpenMetrics: true,  // OpenMetrics enabled
  apmTargets: [],
  openMetricsTargets: [
    {
      id: 1,
      targetName: 'sample-metrics',
      type: 'PodMonitor',
      namespaceSelectionMethod: 'name',
      namespaces: 'default',
      namespaceLabels: [{ id: 1, key: '', value: '' }],
      selectorLabels: [{ id: 1, key: 'app', value: 'sample-app' }],
      port: 'metrics',
      path: '/metrics',
      interval: '30s',
      scheme: 'http',
      address: '192.168.1.100:9100',
      metricRelabelConfigs: []
    }
  ]
};

console.log('Testing duplicate openAgent configuration...');
console.log('Configuration: operator + stable + containerd + GPU + OpenMetrics');

try {
  const files = generateInstallationFiles(testConfig);
  
  console.log(`\nGenerated ${files.length} files:`);
  
  // Find the WhatapAgent CR file
  const crFile = files.find(file => file.name === 'whatap-agent-cr.yaml');
  
  if (crFile) {
    console.log('\n=== Checking for duplicate openAgent configuration ===');
    
    // Count occurrences of "openAgent:" in the content
    const openAgentMatches = (crFile.content.match(/openAgent:/g) || []);
    console.log(`Number of "openAgent:" occurrences: ${openAgentMatches.length}`);
    
    if (openAgentMatches.length > 1) {
      console.log('❌ DUPLICATE FOUND! openAgent configuration appears multiple times');
      
      // Show the relevant parts of the YAML
      const lines = crFile.content.split('\n');
      lines.forEach((line, index) => {
        if (line.includes('openAgent:')) {
          console.log(`Line ${index + 1}: ${line}`);
          // Show a few lines of context
          for (let i = 1; i <= 3 && index + i < lines.length; i++) {
            console.log(`Line ${index + i + 1}: ${lines[index + i]}`);
          }
          console.log('---');
        }
      });
    } else {
      console.log('✅ No duplicates found');
    }
    
    // Also check for "enabled: true" under openAgent
    const enabledMatches = crFile.content.match(/openAgent:\s*\n\s*enabled:\s*true/g) || [];
    console.log(`Number of "openAgent: enabled: true" patterns: ${enabledMatches.length}`);
    
  } else {
    console.log('❌ WhatapAgent CR file not found');
  }

} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error(error.stack);
}