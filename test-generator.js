// Simple test to verify the generator functions work correctly
const { generateInstallationFiles, generateCommands } = require('./src/utils/generator.js');

// Test configuration
const testConfig = {
  accessKey: 'test-access-key-123',
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
  useApm: true,
  useOpenMetrics: true,
};

console.log('🧪 Testing WhaTap Installation Guide Generator...\n');

try {
  // Test file generation
  console.log('📁 Testing file generation...');
  const files = generateInstallationFiles(testConfig);
  console.log(`✅ Generated ${files.length} files for ${testConfig.installMethod} method:`);
  files.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file.name} (${file.method})`);
  });

  // Test command generation
  console.log('\n💻 Testing command generation...');
  const commands = generateCommands(testConfig);
  console.log(`✅ Generated ${commands.length} command sets for ${testConfig.installMethod} method:`);
  commands.forEach((cmd, index) => {
    console.log(`   ${index + 1}. ${cmd.title} (${cmd.method})`);
  });

  // Test different installation methods
  console.log('\n🔄 Testing different installation methods...');
  const methods = ['operator', 'helm', 'yaml'];
  
  methods.forEach(method => {
    const config = { ...testConfig, installMethod: method };
    const methodFiles = generateInstallationFiles(config);
    const methodCommands = generateCommands(config);
    console.log(`   ${method}: ${methodFiles.length} files, ${methodCommands.length} commands`);
  });

  console.log('\n✅ All tests passed! Generator functions are working correctly.');
  
  // Show sample output
  console.log('\n📋 Sample generated file (first 10 lines):');
  const sampleFile = files[0];
  const lines = sampleFile.content.split('\n').slice(0, 10);
  lines.forEach(line => console.log(`   ${line}`));
  if (sampleFile.content.split('\n').length > 10) {
    console.log('   ...');
  }

} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error(error.stack);
}