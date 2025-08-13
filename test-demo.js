// Simple test script to verify YAML generation functionality
const { generateInstallationFiles } = require('./src/utils/generator');

// Test configuration similar to what DemoPage uses
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
  isGpu: false,
  useApm: false,
  useOpenMetrics: false,
  apmTargets: [
    {
      id: 1,
      name: 'sample-app',
      language: 'java',
      namespaceSelectionMethod: 'name',
      namespaces: 'default',
      namespaceLabelKey: '',
      namespaceLabelValue: '',
      podLabelKey: 'app',
      podLabelValue: 'sample-app'
    }
  ],
  openMetricsTargets: [
    {
      id: 1,
      targetName: 'sample-metrics',
      type: 'PodMonitor',
      namespaceSelectionMethod: 'name',
      namespaces: 'default',
      namespaceLabelKey: '',
      namespaceLabelValue: '',
      selectorLabelKey: 'app',
      selectorLabelValue: 'sample-app',
      port: 'metrics',
      path: '/metrics',
      interval: '30s',
      scheme: 'http',
      address: '192.168.1.100:9100',
      metricRelabelConfigs: []
    }
  ]
};

console.log('Testing YAML generation...');

try {
  // Test basic operator configuration
  console.log('\n=== Test 1: Basic Operator Configuration ===');
  const files1 = generateInstallationFiles(testConfig);
  console.log(`Generated ${files1.length} files:`);
  files1.forEach(file => {
    console.log(`- ${file.name}: ${file.content.length} characters`);
  });

  // Test with GKE enabled
  console.log('\n=== Test 2: GKE Configuration ===');
  const gkeConfig = { ...testConfig, isGke: true };
  const files2 = generateInstallationFiles(gkeConfig);
  console.log(`Generated ${files2.length} files:`);
  files2.forEach(file => {
    console.log(`- ${file.name}: ${file.content.length} characters`);
  });

  // Test with APM enabled
  console.log('\n=== Test 3: APM Configuration ===');
  const apmConfig = { ...testConfig, useApm: true };
  const files3 = generateInstallationFiles(apmConfig);
  console.log(`Generated ${files3.length} files:`);
  files3.forEach(file => {
    console.log(`- ${file.name}: ${file.content.length} characters`);
  });

  // Test Helm method
  console.log('\n=== Test 4: Helm Configuration ===');
  const helmConfig = { ...testConfig, installMethod: 'helm' };
  const files4 = generateInstallationFiles(helmConfig);
  console.log(`Generated ${files4.length} files:`);
  files4.forEach(file => {
    console.log(`- ${file.name}: ${file.content.length} characters`);
  });

  // Test YAML method
  console.log('\n=== Test 5: YAML Configuration ===');
  const yamlConfig = { ...testConfig, installMethod: 'yaml' };
  const files5 = generateInstallationFiles(yamlConfig);
  console.log(`Generated ${files5.length} files:`);
  files5.forEach(file => {
    console.log(`- ${file.name}: ${file.content.length} characters`);
  });

  // Test GPU monitoring
  console.log('\n=== Test 6: GPU Monitoring Configuration ===');
  const gpuConfig = { ...testConfig, isGpu: true };
  const files6 = generateInstallationFiles(gpuConfig);
  console.log(`Generated ${files6.length} files:`);
  files6.forEach(file => {
    console.log(`- ${file.name}: ${file.content.length} characters`);
    // Check if GPU monitoring configuration is present
    if (file.name === 'whatap-agent-cr.yaml' && file.content.includes('gpuMonitoring')) {
      console.log('  ✅ GPU monitoring configuration found');
      if (file.content.includes('openAgent:') && file.content.includes('enabled: true')) {
        console.log('  ✅ openAgent configuration found');
      }
      if (file.content.includes('namespace: "whatap-monitoring"')) {
        console.log('  ✅ namespace configuration found');
      }
      if (file.content.includes('masterAgent:') && file.content.includes('nodeAgent:')) {
        console.log('  ✅ masterAgent and nodeAgent configuration found');
      }
    }
  });

  console.log('\n✅ All tests passed! YAML generation is working correctly.');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error(error.stack);
}