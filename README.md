# WhaTap Kubernetes Installation Guide

An interactive web application for generating customized WhaTap Kubernetes monitoring installation configurations.

## Overview

This project provides an improved, user-friendly interface for configuring and installing WhaTap Kubernetes monitoring. It generates customized YAML files and installation commands based on your specific environment and requirements.

## Features

### 🎯 **Step-by-Step Wizard Interface**
- **Access Key Verification**: Configure your WhaTap credentials and server information
- **Installation Configuration**: Choose installation method and environment settings
- **Additional Features**: Select optional monitoring capabilities
- **Generated Files**: Review and copy configuration files
- **Installation Commands**: Execute step-by-step installation instructions

### 🔧 **YAML Conversion Demo Page**
- **Real-time YAML Generation**: See how configuration options instantly affect generated YAML
- **Interactive Configuration Panel**: Modify installation settings with buttons and switches
- **Side-by-side Comparison**: Configuration options on the left, generated YAML on the right
- **Multiple Installation Methods**: Test Operator, Helm, and standalone YAML configurations
- **Platform-specific Settings**: Toggle GKE, OpenShift, Istio, and GPU monitoring options
- **Feature Demonstrations**: Enable/disable APM and OpenMetrics to see YAML changes

### 🚀 **Installation Methods Supported**
1. **Operator-based (Recommended)**: Full-featured installation with central management
2. **Helm Direct Install**: Quick setup using Helm charts
3. **Standalone YAML**: Manual installation with complete resource definitions

### 🔧 **Environment Configuration**
- **Image Versions**: Stable (recommended) or Preview
- **Kubernetes Versions**: 1.16+ or legacy versions
- **Container Runtimes**: containerd, Docker Engine, CRI-O
- **Platform Support**: GKE, OpenShift, Istio, GPU clusters

### 📊 **Advanced Features**
- **APM Auto-Instrumentation**: Automatic application performance monitoring
- **OpenMetrics Collection**: Custom metrics from Prometheus-compatible endpoints
- **GPU Monitoring**: Specialized monitoring for GPU workloads
- **Platform-Specific Optimizations**: Tailored configurations for different environments

## Improvements Over Original Implementation

### 🎨 **Enhanced User Experience**
- **Material-UI Design**: Modern, responsive interface with consistent styling
- **Vertical Stepper**: Clear progress indication and navigation
- **Interactive Forms**: Better form controls with validation and help text
- **Copy Functionality**: One-click copying with visual feedback
- **Responsive Layout**: Works well on desktop and mobile devices

### 🔧 **Technical Improvements**
- **Comprehensive Configurations**: More detailed and accurate YAML generation
- **Platform-Specific Settings**: Proper handling of GKE, OpenShift, Istio, GPU
- **RBAC Configurations**: Complete security configurations for standalone installations
- **Error Fixes**: Corrected typos and improved command accuracy
- **Better Documentation**: Detailed comments and configuration summaries

### 📋 **Enhanced File Generation**
- **Multiple Files per Method**: Separate namespace, secret, and CR files for operator method
- **Configuration Headers**: Detailed headers showing selected options
- **Runtime-Specific Volumes**: Proper volume mounts for different container runtimes
- **Security Contexts**: Appropriate security settings for different platforms

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Basic understanding of Kubernetes and WhaTap monitoring

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd whatap-k8s-install-guide
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

### Usage

#### Installation Guide (Step-by-Step Wizard)
1. **Access Key Verification**: Enter your WhaTap project credentials
2. **Configure Installation**: Select your preferred installation method and environment
3. **Choose Features**: Enable additional monitoring capabilities as needed
4. **Generate Files**: Review the generated configuration files
5. **Execute Commands**: Follow the step-by-step installation instructions

#### YAML Conversion Demo Page
1. **Switch to Demo Tab**: Click on "YAML 변환 데모" tab at the top of the application
2. **Configure Options**: Use the left panel to modify installation settings:
   - **Basic Settings**: Change installation method, image version, container runtime
   - **Platform Settings**: Toggle GKE, OpenShift, Istio, GPU monitoring
   - **Additional Features**: Enable/disable APM and OpenMetrics
3. **View Real-time Changes**: Watch the right panel update YAML files instantly
4. **Copy Generated YAML**: Use the copy button to copy any generated YAML to clipboard
5. **Reset Configuration**: Use the reset button to return to default settings

This demo page is particularly useful for backend developers who want to understand how different UI choices translate to Kubernetes YAML configurations.

## Project Structure

```
whatap-k8s-install-guide/
├── public/
│   └── index.html              # Main HTML template
├── src/
│   ├── utils/
│   │   └── generator.js        # Configuration file and command generators
│   ├── App.js                  # Main application component with tab navigation
│   ├── DemoPage.js            # YAML conversion demo page component
│   └── index.js               # Application entry point
├── package.json               # Dependencies and scripts
├── test-demo.js              # Test script for YAML generation
└── README.md                 # This file
```

## Configuration Options

### Installation Methods
- **Operator**: Uses WhaTap Operator for centralized management
- **Helm**: Direct installation using Helm charts
- **YAML**: Standalone YAML files for manual installation

### Environment Settings
- **Image Version**: stable (recommended) or preview
- **Kubernetes Version**: 1.16+ or legacy support
- **Container Runtime**: containerd, Docker, or CRI-O
- **Platform Features**: GKE, OpenShift, Istio, GPU support

### Additional Features
- **APM Auto-Instrumentation**: Java, Node.js, Python, .NET support
- **OpenMetrics Collection**: Prometheus-compatible metrics collection

## Generated Files

### Operator Method
- `whatap-namespace.yaml`: Namespace creation
- `whatap-credentials-secret.yaml`: Access credentials
- `whatap-agent-cr.yaml`: WhatapAgent custom resource

### Helm Method
- `values.yaml`: Helm chart configuration values

### YAML Method
- `whatap-standalone.yaml`: Complete standalone installation

## Development

### Available Scripts
- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests

### Dependencies
- **React 18**: Modern React with hooks
- **Material-UI 5**: Component library and theming
- **react-syntax-highlighter**: Code syntax highlighting
- **copy-to-clipboard**: Clipboard functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the WhaTap Operator ecosystem and follows the same licensing terms.

## Support

For issues related to:
- **UI/UX**: Create an issue in this repository
- **WhaTap Monitoring**: Visit [WhaTap Support](https://docs.whatap.io/)
- **Kubernetes Integration**: Check the [WhaTap Operator Documentation](https://github.com/whatap/whatap-operator)

---

**Note**: This is an improved version of the original WhaTap installation guide UI, featuring better user experience, more comprehensive configurations, and enhanced functionality.