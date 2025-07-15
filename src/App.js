import React, { useState, useMemo } from 'react';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Box,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Switch,
  TextField,
  Chip,
  Alert,
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ContentCopy as ContentCopyIcon,
  CheckCircle as CheckCircleIcon,
  Settings as SettingsIcon,
  CloudDownload as CloudDownloadIcon,
  Terminal as TerminalIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import copy from 'copy-to-clipboard';
import { generateInstallationFiles, generateCommands } from './utils/generator';

const steps = [
  {
    label: '액세스 키 확인',
    description: '프로젝트 액세스 키와 서버 정보를 확인합니다',
    icon: <SecurityIcon />,
  },
  {
    label: '설치 방식 및 환경 설정',
    description: '설치 방법과 환경 설정을 선택합니다',
    icon: <SettingsIcon />,
  },
  {
    label: '추가 기능 적용',
    description: '선택적 모니터링 기능을 선택합니다',
    icon: <CloudDownloadIcon />,
  },
  {
    label: '설치 파일 생성',
    description: '구성 파일을 검토하고 다운로드합니다',
    icon: <ContentCopyIcon />,
  },
  {
    label: '실행 명령어',
    description: '설치를 완료하기 위한 명령어를 실행합니다',
    icon: <TerminalIcon />,
  },
];

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [copySuccess, setCopySuccess] = useState('');

  // Step 1: Access Key (can be made editable)
  const [accessKey, setAccessKey] = useState('x43a42205jmf3-x5u4rg9ronek18-z3088t61gv7v40');
  const [whatapServer, setWhatapServer] = useState('15.165.146.117');
  const [whatapPort, setWhatapPort] = useState('6600');

  // Step 2: Configuration
  const [imageVersion, setImageVersion] = useState('stable');
  const [installMethod, setInstallMethod] = useState('operator');
  const [k8sVersion, setK8sVersion] = useState('1.16+');
  const [containerRuntime, setContainerRuntime] = useState('containerd');
  const [isGke, setIsGke] = useState(false);
  const [isOpenShift, setIsOpenShift] = useState(false);
  const [isIstio, setIsIstio] = useState(false);
  const [isGpu, setIsGpu] = useState(false);

  // Step 3: Features
  const [useApm, setUseApm] = useState(false);
  const [useOpenMetrics, setUseOpenMetrics] = useState(false);

  // APM Target Configuration - Support multiple targets
  const [apmTargets, setApmTargets] = useState([
    {
      id: 1,
      name: 'sample-app',
      language: 'java',
      namespaceSelectionMethod: 'name', // 'name' or 'label'
      namespaces: 'default',
      namespaceLabelKey: '',
      namespaceLabelValue: '',
      podLabelKey: 'app',
      podLabelValue: 'sample-app'
    }
  ]);

  // OpenMetrics Target Configuration - Support multiple targets
  const [openMetricsTargets, setOpenMetricsTargets] = useState([
    {
      id: 1,
      targetName: 'sample-metrics',
      type: 'PodMonitor', // 'PodMonitor', 'ServiceMonitor', 'StaticEndpoints'
      namespaceSelectionMethod: 'name', // 'name' or 'label'
      namespaces: 'default',
      namespaceLabelKey: '',
      namespaceLabelValue: '',
      selectorLabelKey: 'app',
      selectorLabelValue: 'sample-app',
      // Endpoint configuration
      port: 'metrics',
      path: '/metrics',
      interval: '30s',
      scheme: 'http',
      // StaticEndpoints specific
      address: '192.168.1.100:9100',
      // Metric relabel configurations
      metricRelabelConfigs: [
        {
          id: 1,
          sourceLabels: '__name__',
          regex: 'apiserver_request_total',
          action: 'keep',
          targetLabel: '',
          replacement: ''
        }
      ]
    }
  ]);

  const config = {
    accessKey,
    whatapServer,
    whatapPort,
    imageVersion,
    installMethod,
    k8sVersion,
    containerRuntime,
    isGke,
    isOpenShift,
    isIstio,
    isGpu,
    useApm,
    useOpenMetrics,
    // APM Target Configuration - Multiple targets
    apmTargets,
    // OpenMetrics Target Configuration - Multiple targets
    openMetricsTargets,
  };

  const generatedFiles = useMemo(() => generateInstallationFiles(config), [config]);
  const generatedCommands = useMemo(() => generateCommands(config), [config]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleCopy = (text) => {
    copy(text);
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  // APM Target Management Functions
  const addApmTarget = () => {
    const newId = Math.max(...apmTargets.map(t => t.id)) + 1;
    setApmTargets([...apmTargets, {
      id: newId,
      name: `app-${newId}`,
      language: 'java',
      namespaceSelectionMethod: 'name',
      namespaces: 'default',
      namespaceLabelKey: '',
      namespaceLabelValue: '',
      podLabelKey: 'app',
      podLabelValue: `app-${newId}`
    }]);
  };

  const removeApmTarget = (id) => {
    if (apmTargets.length > 1) {
      setApmTargets(apmTargets.filter(target => target.id !== id));
    }
  };

  const updateApmTarget = (id, field, value) => {
    setApmTargets(apmTargets.map(target => 
      target.id === id ? { ...target, [field]: value } : target
    ));
  };

  // OpenMetrics Target Management Functions
  const addOpenMetricsTarget = () => {
    const newId = Math.max(...openMetricsTargets.map(t => t.id)) + 1;
    setOpenMetricsTargets([...openMetricsTargets, {
      id: newId,
      targetName: `metrics-${newId}`,
      type: 'PodMonitor',
      namespaceSelectionMethod: 'name',
      namespaces: 'default',
      namespaceLabelKey: '',
      namespaceLabelValue: '',
      selectorLabelKey: 'app',
      selectorLabelValue: `app-${newId}`,
      port: 'metrics',
      path: '/metrics',
      interval: '30s',
      scheme: 'http',
      address: '192.168.1.100:9100',
      metricRelabelConfigs: [
        {
          id: 1,
          sourceLabels: '__name__',
          regex: '',
          action: 'keep',
          targetLabel: '',
          replacement: ''
        }
      ]
    }]);
  };

  const removeOpenMetricsTarget = (id) => {
    if (openMetricsTargets.length > 1) {
      setOpenMetricsTargets(openMetricsTargets.filter(target => target.id !== id));
    }
  };

  const updateOpenMetricsTarget = (id, field, value) => {
    setOpenMetricsTargets(openMetricsTargets.map(target => 
      target.id === id ? { ...target, [field]: value } : target
    ));
  };

  // MetricRelabelConfigs Management Functions
  const addMetricRelabelConfig = (targetId) => {
    setOpenMetricsTargets(openMetricsTargets.map(target => {
      if (target.id === targetId) {
        const newConfigId = Math.max(...target.metricRelabelConfigs.map(c => c.id)) + 1;
        return {
          ...target,
          metricRelabelConfigs: [...target.metricRelabelConfigs, {
            id: newConfigId,
            sourceLabels: '__name__',
            regex: '',
            action: 'keep',
            targetLabel: '',
            replacement: ''
          }]
        };
      }
      return target;
    }));
  };

  const removeMetricRelabelConfig = (targetId, configId) => {
    setOpenMetricsTargets(openMetricsTargets.map(target => {
      if (target.id === targetId && target.metricRelabelConfigs.length > 1) {
        return {
          ...target,
          metricRelabelConfigs: target.metricRelabelConfigs.filter(config => config.id !== configId)
        };
      }
      return target;
    }));
  };

  const updateMetricRelabelConfig = (targetId, configId, field, value) => {
    setOpenMetricsTargets(openMetricsTargets.map(target => {
      if (target.id === targetId) {
        return {
          ...target,
          metricRelabelConfigs: target.metricRelabelConfigs.map(config =>
            config.id === configId ? { ...config, [field]: value } : config
          )
        };
      }
      return target;
    }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                프로젝트 액세스 정보
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                프로젝트의 라이선스와 와탭 수집 서버 정보를 확인하세요.
                이 정보는 생성되는 구성 파일에 자동으로 포함됩니다.
              </Typography>


              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="액세스 키 (라이선스)"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    variant="outlined"
                    helperText="프로젝트의 고유 액세스 키"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="와탭 서버"
                    value={whatapServer}
                    onChange={(e) => setWhatapServer(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="포트"
                    value={whatapPort}
                    onChange={(e) => setWhatapPort(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  에이전트 이미지 버전 선택
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>💡 도움말:</strong> Stable 버전은 검증된 안정적인 버전이며, Preview 버전은 최신 기능을 포함하지만 실험적 기능이 포함될 수 있습니다.
                  </Typography>
                </Alert>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={imageVersion}
                    onChange={(e) => setImageVersion(e.target.value)}
                  >
                    <FormControlLabel
                      value="stable"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1">
                            <strong>Stable (권장)</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            최신 안정 릴리스 버전
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="preview"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1">Preview</Typography>
                          <Typography variant="body2" color="text.secondary">
                            실험적 기능이 포함된 최신 기능 버전
                          </Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  설치 방식 선택
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>💡 도움말:</strong> 오퍼레이터 기반 설치는 모든 기능을 중앙에서 관리할 수 있어 권장됩니다. 
                    직접 설치는 특정 상황에서 유용할 수 있습니다.
                  </Typography>
                </Alert>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell width="20%">선택</TableCell>
                        <TableCell width="25%"><strong>설치 방법</strong></TableCell>
                        <TableCell width="30%"><strong>설명</strong></TableCell>
                        <TableCell width="25%"><strong>권장 사용 사례</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow selected={installMethod === 'operator'}>
                        <TableCell>
                          <Radio
                            checked={installMethod === 'operator'}
                            onChange={() => setInstallMethod('operator')}
                            value="operator"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">
                            <strong>A. 오퍼레이터 기반 (권장)</strong>
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            <code>WhatapAgent</code> CR을 통해 모든 모니터링 기능을 <strong>중앙에서 관리</strong>합니다.
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            모든 기능을 사용하며, 지속적인 통합 관리를 원하는 경우
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow selected={installMethod === 'helm'}>
                        <TableCell>
                          <Radio
                            checked={installMethod === 'helm'}
                            onChange={() => setInstallMethod('helm')}
                            value="helm"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">
                            <strong>B. 직접 설치 (Helm)</strong>
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            <code>whatap-agent</code> Helm 차트를 사용하여 <strong>Master/Node 에이전트만 설치</strong>합니다.
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            Operator 없이, 기본 모니터링만 빠르게 적용하고 싶을 때
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow selected={installMethod === 'yaml'}>
                        <TableCell>
                          <Radio
                            checked={installMethod === 'yaml'}
                            onChange={() => setInstallMethod('yaml')}
                            value="yaml"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">
                            <strong>C. 직접 설치 (YAML)</strong>
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            OpenAgent 등 특정 컴포넌트의 <strong>독립 실행형 YAML</strong>을 사용합니다.
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            Operator 없이 특정 기능만 수동으로 설치하고 싶을 때
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  클러스터 환경 설정
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>💡 도움말:</strong> 클러스터 환경에 맞는 설정을 선택하면 최적화된 구성 파일이 생성됩니다.
                  </Typography>
                </Alert>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">쿠버네티스 버전</FormLabel>
                      <RadioGroup
                        value={k8sVersion}
                        onChange={(e) => setK8sVersion(e.target.value)}
                      >
                        <FormControlLabel value="1.16+" control={<Radio />} label="1.16 이상" />
                        <FormControlLabel value="1.16-" control={<Radio />} label="1.16 미만" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">컨테이너 런타임</FormLabel>
                      <RadioGroup
                        value={containerRuntime}
                        onChange={(e) => setContainerRuntime(e.target.value)}
                      >
                        <FormControlLabel value="containerd" control={<Radio />} label="containerd" />
                        <FormControlLabel value="docker" control={<Radio />} label="Docker Engine" />
                        <FormControlLabel value="crio" control={<Radio />} label="CRI-O" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">GKE입니까?</FormLabel>
                      <RadioGroup
                        value={isGke ? 'yes' : 'no'}
                        onChange={(e) => setIsGke(e.target.value === 'yes')}
                      >
                        <FormControlLabel value="yes" control={<Radio />} label="예" />
                        <FormControlLabel value="no" control={<Radio />} label="아니오" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">OpenShift입니까?</FormLabel>
                      <RadioGroup
                        value={isOpenShift ? 'yes' : 'no'}
                        onChange={(e) => setIsOpenShift(e.target.value === 'yes')}
                      >
                        <FormControlLabel value="yes" control={<Radio />} label="예" />
                        <FormControlLabel value="no" control={<Radio />} label="아니오" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Istio입니까?</FormLabel>
                      <RadioGroup
                        value={isIstio ? 'yes' : 'no'}
                        onChange={(e) => setIsIstio(e.target.value === 'yes')}
                      >
                        <FormControlLabel value="yes" control={<Radio />} label="예" />
                        <FormControlLabel value="no" control={<Radio />} label="아니오" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">GPU Cluster 입니까?</FormLabel>
                      <RadioGroup
                        value={isGpu ? 'yes' : 'no'}
                        onChange={(e) => setIsGpu(e.target.value === 'yes')}
                      >
                        <FormControlLabel value="yes" control={<Radio />} label="예" />
                        <FormControlLabel value="no" control={<Radio />} label="아니오" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );

      case 2:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                추가 모니터링 기능
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                모니터링 기능을 향상시킬 추가 기능을 선택하세요.
                {installMethod !== 'operator' && ' 참고: 추가 기능은 오퍼레이터 기반 설치에서 가장 효과적입니다.'}
              </Typography>

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>💡 도움말:</strong> APM 자동 설치는 애플리케이션 코드 수정 없이 성능 모니터링을 가능하게 합니다. 
                  OpenMetrics는 Prometheus 호환 메트릭을 수집합니다.
                </Typography>
              </Alert>

              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={useApm}
                      onChange={(e) => setUseApm(e.target.checked)}
                      disabled={installMethod !== 'operator'}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">APM 자동 설치</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Java, Node.js, Python 등의 애플리케이션 성능 모니터링을 자동으로 설정합니다.
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={useOpenMetrics}
                      onChange={(e) => setUseOpenMetrics(e.target.checked)}
                      disabled={installMethod !== 'operator'}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">OpenMetrics 수집</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Prometheus 호환 엔드포인트를 노출하는 애플리케이션에서 커스텀 메트릭을 수집합니다.
                      </Typography>
                    </Box>
                  }
                />
              </FormGroup>

              {/* APM Target Configuration - Multiple Targets */}
              {useApm && installMethod === 'operator' && (
                <Card variant="outlined" sx={{ mt: 3, mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        APM 대상 설정
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={addApmTarget}
                        sx={{ minWidth: 'auto' }}
                      >
                        + 대상 추가
                      </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      APM 자동 설치를 적용할 대상 애플리케이션들을 설정하세요. 여러 애플리케이션을 추가할 수 있습니다.
                    </Typography>

                    {apmTargets.map((target, index) => (
                      <Card key={target.id} variant="outlined" sx={{ mb: 2, p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle1">
                            대상 애플리케이션 #{index + 1}
                          </Typography>
                          {apmTargets.length > 1 && (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => removeApmTarget(target.id)}
                              sx={{ minWidth: 'auto' }}
                            >
                              삭제
                            </Button>
                          )}
                        </Box>

                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="애플리케이션 이름"
                              value={target.name}
                              onChange={(e) => updateApmTarget(target.id, 'name', e.target.value)}
                              variant="outlined"
                              helperText="APM을 적용할 애플리케이션의 이름"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="outlined">
                              <FormLabel component="legend">프로그래밍 언어</FormLabel>
                              <RadioGroup
                                value={target.language}
                                onChange={(e) => updateApmTarget(target.id, 'language', e.target.value)}
                                row
                              >
                                <FormControlLabel value="java" control={<Radio />} label="Java" />
                                <FormControlLabel value="nodejs" control={<Radio />} label="Node.js" />
                                <FormControlLabel value="python" control={<Radio />} label="Python" />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" gutterBottom>
                          대상 네임스페이스 선택
                        </Typography>
                        <FormControl component="fieldset" sx={{ mb: 2 }}>
                          <FormLabel component="legend">선택 방식</FormLabel>
                          <RadioGroup
                            value={target.namespaceSelectionMethod}
                            onChange={(e) => updateApmTarget(target.id, 'namespaceSelectionMethod', e.target.value)}
                            row
                          >
                            <FormControlLabel value="name" control={<Radio />} label="이름으로 선택" />
                            <FormControlLabel value="label" control={<Radio />} label="라벨로 선택" />
                          </RadioGroup>
                        </FormControl>

                        {target.namespaceSelectionMethod === 'name' ? (
                          <TextField
                            fullWidth
                            label="네임스페이스 이름"
                            value={target.namespaces}
                            onChange={(e) => updateApmTarget(target.id, 'namespaces', e.target.value)}
                            variant="outlined"
                            helperText="APM을 적용할 네임스페이스 (쉼표로 구분하여 여러 개 입력 가능)"
                            sx={{ mb: 2 }}
                          />
                        ) : (
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="네임스페이스 라벨 키"
                                value={target.namespaceLabelKey}
                                onChange={(e) => updateApmTarget(target.id, 'namespaceLabelKey', e.target.value)}
                                variant="outlined"
                                helperText="네임스페이스를 선택할 라벨의 키"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="네임스페이스 라벨 값"
                                value={target.namespaceLabelValue}
                                onChange={(e) => updateApmTarget(target.id, 'namespaceLabelValue', e.target.value)}
                                variant="outlined"
                                helperText="네임스페이스를 선택할 라벨의 값"
                              />
                            </Grid>
                          </Grid>
                        )}

                        <Typography variant="subtitle2" gutterBottom>
                          대상 Pod 선택
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Pod 라벨 키"
                              value={target.podLabelKey}
                              onChange={(e) => updateApmTarget(target.id, 'podLabelKey', e.target.value)}
                              variant="outlined"
                              helperText="Pod를 선택할 라벨의 키"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Pod 라벨 값"
                              value={target.podLabelValue}
                              onChange={(e) => updateApmTarget(target.id, 'podLabelValue', e.target.value)}
                              variant="outlined"
                              helperText="Pod를 선택할 라벨의 값"
                            />
                          </Grid>
                        </Grid>
                      </Card>
                    ))}

                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>도움말:</strong> 여러 애플리케이션에 APM을 적용하려면 "대상 추가" 버튼을 클릭하세요.
                        각 대상마다 네임스페이스와 Pod 라벨을 정확히 설정해야 APM이 올바른 애플리케이션에 적용됩니다.
                        기존 애플리케이션의 경우 설정 후 재시작이 필요합니다.
                      </Typography>
                    </Alert>

                    <Alert severity="warning" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>고급 기능 안내:</strong> 이 UI는 기본적인 APM 자동 설치 설정만 제공합니다. 
                        다음과 같은 고급 기능이 필요한 경우 직접 CR(Custom Resource)을 작성해야 합니다:
                      </Typography>
                      <Typography variant="body2" component="div" sx={{ mt: 1, ml: 2 }}>
                        • <strong>matchExpressions</strong>를 사용한 복잡한 라벨 선택 표현식<br/>
                        • <strong>custom config</strong> 모드를 통한 APM config 세부 설정<br/>
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        고급 설정이 필요한 경우{' '}
                        <a 
                          href="https://docs.whatap.io/kubernetes/install-auto-application-agent" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#1976d2', textDecoration: 'none' }}
                        >
                          <strong>WhaTap APM 자동 설치 가이드</strong>
                        </a>
                        를 참고하여 직접 WhatapAgent CR을 구성하세요.
                      </Typography>
                    </Alert>
                  </CardContent>
                </Card>
              )}

              {/* OpenMetrics Target Configuration - Multiple Targets */}
              {useOpenMetrics && installMethod === 'operator' && (
                <Card variant="outlined" sx={{ mt: 3, mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        OpenMetrics 대상 설정
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={addOpenMetricsTarget}
                        sx={{ minWidth: 'auto' }}
                      >
                        + 대상 추가
                      </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      OpenMetrics 수집을 적용할 대상들을 설정하세요. PodMonitor, ServiceMonitor, StaticEndpoints 세 가지 타입을 지원합니다.
                    </Typography>

                    {openMetricsTargets.map((target, index) => (
                      <Card key={target.id} variant="outlined" sx={{ mb: 2, p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle1">
                            OpenMetrics 대상 #{index + 1}
                          </Typography>
                          {openMetricsTargets.length > 1 && (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => removeOpenMetricsTarget(target.id)}
                              sx={{ minWidth: 'auto' }}
                            >
                              삭제
                            </Button>
                          )}
                        </Box>

                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="대상 이름"
                              value={target.targetName}
                              onChange={(e) => updateOpenMetricsTarget(target.id, 'targetName', e.target.value)}
                              variant="outlined"
                              helperText="OpenMetrics 대상의 이름"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="outlined">
                              <FormLabel component="legend">타입</FormLabel>
                              <RadioGroup
                                value={target.type}
                                onChange={(e) => updateOpenMetricsTarget(target.id, 'type', e.target.value)}
                                row
                              >
                                <FormControlLabel value="PodMonitor" control={<Radio />} label="PodMonitor" />
                                <FormControlLabel value="ServiceMonitor" control={<Radio />} label="ServiceMonitor" />
                                <FormControlLabel value="StaticEndpoints" control={<Radio />} label="StaticEndpoints" />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        {/* Namespace Selection - Only for PodMonitor and ServiceMonitor */}
                        {(target.type === 'PodMonitor' || target.type === 'ServiceMonitor') && (
                          <>
                            <Typography variant="subtitle2" gutterBottom>
                              대상 네임스페이스 선택
                            </Typography>
                            <FormControl component="fieldset" sx={{ mb: 2 }}>
                              <FormLabel component="legend">선택 방식</FormLabel>
                              <RadioGroup
                                value={target.namespaceSelectionMethod}
                                onChange={(e) => updateOpenMetricsTarget(target.id, 'namespaceSelectionMethod', e.target.value)}
                                row
                              >
                                <FormControlLabel value="name" control={<Radio />} label="이름으로 선택" />
                                <FormControlLabel value="label" control={<Radio />} label="라벨로 선택" />
                              </RadioGroup>
                            </FormControl>

                            {target.namespaceSelectionMethod === 'name' ? (
                              <TextField
                                fullWidth
                                label="네임스페이스 이름"
                                value={target.namespaces}
                                onChange={(e) => updateOpenMetricsTarget(target.id, 'namespaces', e.target.value)}
                                variant="outlined"
                                helperText="대상 네임스페이스 (쉼표로 구분하여 여러 개 입력 가능)"
                                sx={{ mb: 2 }}
                              />
                            ) : (
                              <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="네임스페이스 라벨 키"
                                    value={target.namespaceLabelKey}
                                    onChange={(e) => updateOpenMetricsTarget(target.id, 'namespaceLabelKey', e.target.value)}
                                    variant="outlined"
                                    helperText="네임스페이스를 선택할 라벨의 키"
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="네임스페이스 라벨 값"
                                    value={target.namespaceLabelValue}
                                    onChange={(e) => updateOpenMetricsTarget(target.id, 'namespaceLabelValue', e.target.value)}
                                    variant="outlined"
                                    helperText="네임스페이스를 선택할 라벨의 값"
                                  />
                                </Grid>
                              </Grid>
                            )}
                          </>
                        )}

                        {/* Selector Configuration - Only for PodMonitor and ServiceMonitor */}
                        {(target.type === 'PodMonitor' || target.type === 'ServiceMonitor') && (
                          <>
                            <Typography variant="subtitle2" gutterBottom>
                              {target.type === 'PodMonitor' ? '대상 Pod 선택' : '대상 Service 선택'}
                            </Typography>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label={`${target.type === 'PodMonitor' ? 'Pod' : 'Service'} 라벨 키`}
                                  value={target.selectorLabelKey}
                                  onChange={(e) => updateOpenMetricsTarget(target.id, 'selectorLabelKey', e.target.value)}
                                  variant="outlined"
                                  helperText={`${target.type === 'PodMonitor' ? 'Pod' : 'Service'}를 선택할 라벨의 키`}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label={`${target.type === 'PodMonitor' ? 'Pod' : 'Service'} 라벨 값`}
                                  value={target.selectorLabelValue}
                                  onChange={(e) => updateOpenMetricsTarget(target.id, 'selectorLabelValue', e.target.value)}
                                  variant="outlined"
                                  helperText={`${target.type === 'PodMonitor' ? 'Pod' : 'Service'}를 선택할 라벨의 값`}
                                />
                              </Grid>
                            </Grid>
                          </>
                        )}

                        {/* Endpoint Configuration */}
                        <Typography variant="subtitle2" gutterBottom>
                          엔드포인트 설정
                        </Typography>

                        {target.type === 'StaticEndpoints' ? (
                          <TextField
                            fullWidth
                            label="주소"
                            value={target.address}
                            onChange={(e) => updateOpenMetricsTarget(target.id, 'address', e.target.value)}
                            variant="outlined"
                            helperText="IP:포트 형식 (예: 192.168.1.100:9100)"
                            sx={{ mb: 2 }}
                          />
                        ) : (
                          <TextField
                            fullWidth
                            label="포트"
                            value={target.port}
                            onChange={(e) => updateOpenMetricsTarget(target.id, 'port', e.target.value)}
                            variant="outlined"
                            helperText="포트 이름 또는 번호 (예: metrics, 8080)"
                            sx={{ mb: 2 }}
                          />
                        )}

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="경로"
                              value={target.path}
                              onChange={(e) => updateOpenMetricsTarget(target.id, 'path', e.target.value)}
                              variant="outlined"
                              helperText="메트릭 경로 (기본값: /metrics)"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="수집 간격"
                              value={target.interval}
                              onChange={(e) => updateOpenMetricsTarget(target.id, 'interval', e.target.value)}
                              variant="outlined"
                              helperText="수집 간격 (예: 30s, 1m)"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <FormControl fullWidth variant="outlined">
                              <FormLabel component="legend">스키마</FormLabel>
                              <RadioGroup
                                value={target.scheme}
                                onChange={(e) => updateOpenMetricsTarget(target.id, 'scheme', e.target.value)}
                                row
                              >
                                <FormControlLabel value="http" control={<Radio />} label="HTTP" />
                                <FormControlLabel value="https" control={<Radio />} label="HTTPS" />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        {/* Metric Relabel Configurations */}
                        <Typography variant="subtitle2" gutterBottom>
                          메트릭 필터링 설정
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          수집할 메트릭을 필터링하거나 라벨을 변경할 수 있습니다.
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            메트릭 필터링 규칙
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => addMetricRelabelConfig(target.id)}
                            sx={{ minWidth: 'auto' }}
                          >
                            + 규칙 추가
                          </Button>
                        </Box>

                        {target.metricRelabelConfigs.map((config, configIndex) => (
                          <Card key={config.id} variant="outlined" sx={{ mb: 2, p: 2, backgroundColor: 'grey.50' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="body2" fontWeight="medium">
                                규칙 #{configIndex + 1}
                              </Typography>
                              {target.metricRelabelConfigs.length > 1 && (
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={() => removeMetricRelabelConfig(target.id, config.id)}
                                  sx={{ minWidth: 'auto' }}
                                >
                                  삭제
                                </Button>
                              )}
                            </Box>

                            <Grid container spacing={2}>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  label="소스 라벨"
                                  value={config.sourceLabels}
                                  onChange={(e) => updateMetricRelabelConfig(target.id, config.id, 'sourceLabels', e.target.value)}
                                  variant="outlined"
                                  helperText="예: __name__, instance"
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  label="정규식 패턴"
                                  value={config.regex}
                                  onChange={(e) => updateMetricRelabelConfig(target.id, config.id, 'regex', e.target.value)}
                                  variant="outlined"
                                  helperText="예: apiserver.*, http_.*"
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} md={2}>
                                <FormControl fullWidth variant="outlined" size="small">
                                  <FormLabel component="legend">액션</FormLabel>
                                  <RadioGroup
                                    value={config.action}
                                    onChange={(e) => updateMetricRelabelConfig(target.id, config.id, 'action', e.target.value)}
                                  >
                                    <FormControlLabel value="keep" control={<Radio size="small" />} label="Keep" />
                                    <FormControlLabel value="drop" control={<Radio size="small" />} label="Drop" />
                                    <FormControlLabel value="replace" control={<Radio size="small" />} label="Replace" />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                              {config.action === 'replace' && (
                                <>
                                  <Grid item xs={12} md={2}>
                                    <TextField
                                      fullWidth
                                      label="대상 라벨"
                                      value={config.targetLabel}
                                      onChange={(e) => updateMetricRelabelConfig(target.id, config.id, 'targetLabel', e.target.value)}
                                      variant="outlined"
                                      helperText="새 라벨 이름"
                                      size="small"
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={2}>
                                    <TextField
                                      fullWidth
                                      label="교체 값"
                                      value={config.replacement}
                                      onChange={(e) => updateMetricRelabelConfig(target.id, config.id, 'replacement', e.target.value)}
                                      variant="outlined"
                                      helperText="예: ${1}, static_value"
                                      size="small"
                                    />
                                  </Grid>
                                </>
                              )}
                            </Grid>
                          </Card>
                        ))}

                        <Alert severity="info" sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            <strong>💡 메트릭 필터링 예시:</strong><br/>
                            • <strong>특정 메트릭만 수집:</strong> 소스 라벨 "__name__", 정규식 "apiserver_request_total", 액션 "keep"<br/>
                            • <strong>패턴으로 수집:</strong> 소스 라벨 "__name__", 정규식 "apiserver.*", 액션 "keep"<br/>
                            • <strong>라벨 변경:</strong> 소스 라벨 "method", 정규식 "(.*)", 액션 "replace", 대상 라벨 "http_method", 교체 값 "$1"
                          </Typography>
                        </Alert>
                      </Card>
                    ))}

                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>도움말:</strong> 
                        • <strong>PodMonitor</strong>: Pod 라벨로 동적 발견<br/>
                        • <strong>ServiceMonitor</strong>: Service 라벨로 동적 발견<br/>
                        • <strong>StaticEndpoints</strong>: 고정 IP/포트 직접 지정
                      </Typography>
                    </Alert>

                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>📖 추가 정보:</strong> 메트릭 수집 예제 및 추가적인 설정 방법은{' '}
                        <a 
                          href="https://docs.whatap.io/kubernetes/openagent" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#1976d2', textDecoration: 'none' }}
                        >
                          <strong>WhaTap OpenAgent 가이드</strong>
                        </a>
                        를 참고하세요.
                      </Typography>
                    </Alert>
                  </CardContent>
                </Card>
              )}

              {installMethod !== 'operator' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  추가 기능은 오퍼레이터 기반 설치 방식에서 가장 효과적입니다.
                  모든 기능 지원을 위해 오퍼레이터 기반 설치로 전환하는 것을 고려해보세요.
                </Alert>
              )}
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              생성된 구성 파일
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              선택하신 설정에 따라 다음 구성 파일들이 생성되었습니다.
              복사 버튼을 클릭하여 내용을 클립보드에 복사할 수 있습니다.
            </Typography>

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>💡 도움말:</strong> 생성된 파일들을 로컬에 저장한 후 kubectl 명령어로 적용하세요. 
                파일 내용은 언제든지 수정할 수 있습니다.
              </Typography>
            </Alert>

            {copySuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                복사되었습니다!
              </Alert>
            )}

            {generatedFiles.map((file, index) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1">{file.name}</Typography>
                    <Chip label={file.method} size="small" color="primary" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ position: 'relative' }}>
                    <Tooltip title="클립보드에 복사">
                      <IconButton
                        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                        onClick={() => handleCopy(file.content)}
                        size="small"
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <SyntaxHighlighter
                      language={file.language}
                      style={vscDarkPlus}
                      customStyle={{ borderRadius: 4 }}
                    >
                      {file.content}
                    </SyntaxHighlighter>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              설치 명령어
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              WhaTap Kubernetes 모니터링 설치를 완료하기 위해 다음 명령어들을 순서대로 실행하세요.
            </Typography>

            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>⚠️ 주의사항:</strong> 명령어는 반드시 순서대로 실행해야 합니다. 
                각 단계가 완료된 후 다음 단계로 진행하세요.
              </Typography>
            </Alert>

            {copySuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                복사되었습니다!
              </Alert>
            )}

            {generatedCommands.map((cmd, index) => (
              <Accordion key={index} sx={{ mb: 1 }} defaultExpanded={index === 0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1">{cmd.title}</Typography>
                    <Chip label={cmd.method} size="small" color="secondary" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ position: 'relative' }}>
                    <Tooltip title="클립보드에 복사">
                      <IconButton
                        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                        onClick={() => handleCopy(cmd.command)}
                        size="small"
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <SyntaxHighlighter
                      language="bash"
                      style={vscDarkPlus}
                      customStyle={{ borderRadius: 4 }}
                    >
                      {cmd.command}
                    </SyntaxHighlighter>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}

            <Alert severity="success" sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                설치 완료!
              </Typography>
              <Typography variant="body2">
                모든 명령어를 실행한 후, WhaTap Kubernetes 모니터링이 활성화됩니다.
                데이터가 수집되고 있는지 WhaTap 대시보드에서 확인하세요.
              </Typography>
            </Alert>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, backgroundColor: 'background.paper' }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            WhaTap Kubernetes 모니터링
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            설치 가이드
          </Typography>
          <Typography variant="body1" color="text.secondary">
            환경을 구성하고 맞춤형 설치 파일을 생성하세요
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === steps.length - 1 ? (
                    <Typography variant="caption">마지막 단계</Typography>
                  ) : null
                }
                StepIconComponent={({ active, completed }) => (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: completed
                        ? 'primary.main'
                        : active
                        ? 'primary.light'
                        : 'grey.300',
                      color: completed || active ? 'white' : 'grey.600',
                    }}
                  >
                    {completed ? <CheckCircleIcon /> : step.icon}
                  </Box>
                )}
              >
                <Typography variant="h6">{step.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  {renderStepContent(index)}
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? '완료' : '계속'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    이전
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3, mt: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              모든 단계가 완료되었습니다!
            </Typography>
            <Typography variant="body1" paragraph>
              WhaTap Kubernetes 모니터링 구성이 준비되었습니다.
              생성된 파일과 명령어를 사용하여 설치를 완료하세요.
            </Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              구성 초기화
            </Button>
          </Paper>
        )}
      </Paper>
    </Container>
  );
}

export default App;
