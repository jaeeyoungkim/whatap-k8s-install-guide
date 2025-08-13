import React, { useState, useMemo } from 'react';
import {
  Container,
  Paper,
  Typography,
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
  Button,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ContentCopy as ContentCopyIcon,
  Refresh as RefreshIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import copy from 'copy-to-clipboard';
import { generateInstallationFiles } from './utils/generator';

function DemoPage() {
  const [copySuccess, setCopySuccess] = useState('');

  // Configuration state - simplified for demo purposes
  const [accessKey, setAccessKey] = useState('x43a42205jmf3-x5u4rg9ronek18-z3088t61gv7v40');
  const [whatapServer, setWhatapServer] = useState('15.165.146.117');
  const [whatapPort, setWhatapPort] = useState('6600');
  const [imageVersion, setImageVersion] = useState('stable');
  const [installMethod, setInstallMethod] = useState('operator');
  const [k8sVersion, setK8sVersion] = useState('1.16+');
  const [containerRuntime, setContainerRuntime] = useState('containerd');
  const [isGke, setIsGke] = useState(false);
  const [isOpenShift, setIsOpenShift] = useState(false);
  const [isIstio, setIsIstio] = useState(false);
  const [isGpu, setIsGpu] = useState(false);
  const [useApm, setUseApm] = useState(false);
  const [useOpenMetrics, setUseOpenMetrics] = useState(false);

  // APM and OpenMetrics targets with detailed configuration
  const [apmTargets, setApmTargets] = useState([
    {
      id: 1,
      name: 'sample-app',
      language: 'java',
      namespaceSelectionMethod: 'name',
      namespaces: 'default',
      namespaceLabels: [{ id: 1, key: '', value: '' }],
      podLabels: [{ id: 1, key: 'app', value: 'sample-app' }]
    }
  ]);

  const [openMetricsTargets, setOpenMetricsTargets] = useState([
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
      metricRelabelConfigs: [
        {
          id: 1,
          sourceLabels: '__name__',
          regex: '.*',
          action: 'keep',
          targetLabel: '',
          replacement: ''
        }
      ]
    }
  ]);

  // APM Target Management Functions
  const addApmTarget = () => {
    const newId = Math.max(...apmTargets.map(t => t.id)) + 1;
    setApmTargets([...apmTargets, {
      id: newId,
      name: `app-${newId}`,
      language: 'java',
      namespaceSelectionMethod: 'name',
      namespaces: 'default',
      namespaceLabels: [{ id: 1, key: '', value: '' }],
      podLabels: [{ id: 1, key: 'app', value: `app-${newId}` }]
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

  // APM Pod Label Management Functions
  const addApmPodLabel = (targetId) => {
    setApmTargets(apmTargets.map(target => {
      if (target.id === targetId) {
        const newLabelId = Math.max(...target.podLabels.map(l => l.id)) + 1;
        return {
          ...target,
          podLabels: [...target.podLabels, { id: newLabelId, key: '', value: '' }]
        };
      }
      return target;
    }));
  };

  const removeApmPodLabel = (targetId, labelId) => {
    setApmTargets(apmTargets.map(target => {
      if (target.id === targetId && target.podLabels.length > 1) {
        return {
          ...target,
          podLabels: target.podLabels.filter(label => label.id !== labelId)
        };
      }
      return target;
    }));
  };

  const updateApmPodLabel = (targetId, labelId, field, value) => {
    setApmTargets(apmTargets.map(target => {
      if (target.id === targetId) {
        return {
          ...target,
          podLabels: target.podLabels.map(label =>
            label.id === labelId ? { ...label, [field]: value } : label
          )
        };
      }
      return target;
    }));
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
      namespaceLabels: [{ id: 1, key: '', value: '' }],
      selectorLabels: [{ id: 1, key: 'app', value: `app-${newId}` }],
      port: 'metrics',
      path: '/metrics',
      interval: '30s',
      scheme: 'http',
      address: '192.168.1.100:9100',
      metricRelabelConfigs: [
        {
          id: 1,
          sourceLabels: '__name__',
          regex: '.*',
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
  const addOpenMetricsRelabelConfig = (targetId) => {
    setOpenMetricsTargets(openMetricsTargets.map(target => {
      if (target.id === targetId) {
        const newConfigId = Math.max(...target.metricRelabelConfigs.map(c => c.id), 0) + 1;
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

  const removeOpenMetricsRelabelConfig = (targetId, configId) => {
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

  const updateOpenMetricsRelabelConfig = (targetId, configId, field, value) => {
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

  // OpenMetrics Label Management Functions
  const addOpenMetricsNamespaceLabel = (targetId) => {
    setOpenMetricsTargets(openMetricsTargets.map(target => {
      if (target.id === targetId) {
        const newLabelId = Math.max(...target.namespaceLabels.map(l => l.id)) + 1;
        return {
          ...target,
          namespaceLabels: [...target.namespaceLabels, { id: newLabelId, key: '', value: '' }]
        };
      }
      return target;
    }));
  };

  const removeOpenMetricsNamespaceLabel = (targetId, labelId) => {
    setOpenMetricsTargets(openMetricsTargets.map(target => {
      if (target.id === targetId && target.namespaceLabels.length > 1) {
        return {
          ...target,
          namespaceLabels: target.namespaceLabels.filter(label => label.id !== labelId)
        };
      }
      return target;
    }));
  };

  const updateOpenMetricsNamespaceLabel = (targetId, labelId, field, value) => {
    setOpenMetricsTargets(openMetricsTargets.map(target => {
      if (target.id === targetId) {
        return {
          ...target,
          namespaceLabels: target.namespaceLabels.map(label =>
            label.id === labelId ? { ...label, [field]: value } : label
          )
        };
      }
      return target;
    }));
  };

  const addOpenMetricsSelectorLabel = (targetId) => {
    setOpenMetricsTargets(openMetricsTargets.map(target => {
      if (target.id === targetId) {
        const newLabelId = Math.max(...target.selectorLabels.map(l => l.id)) + 1;
        return {
          ...target,
          selectorLabels: [...target.selectorLabels, { id: newLabelId, key: '', value: '' }]
        };
      }
      return target;
    }));
  };

  const removeOpenMetricsSelectorLabel = (targetId, labelId) => {
    setOpenMetricsTargets(openMetricsTargets.map(target => {
      if (target.id === targetId && target.selectorLabels.length > 1) {
        return {
          ...target,
          selectorLabels: target.selectorLabels.filter(label => label.id !== labelId)
        };
      }
      return target;
    }));
  };

  const updateOpenMetricsSelectorLabel = (targetId, labelId, field, value) => {
    setOpenMetricsTargets(openMetricsTargets.map(target => {
      if (target.id === targetId) {
        return {
          ...target,
          selectorLabels: target.selectorLabels.map(label =>
            label.id === labelId ? { ...label, [field]: value } : label
          )
        };
      }
      return target;
    }));
  };

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
    apmTargets,
    openMetricsTargets,
  };

  const generatedFiles = useMemo(() => generateInstallationFiles(config), [config]);

  const handleCopy = (text) => {
    copy(text);
    setCopySuccess('복사되었습니다!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const resetToDefaults = () => {
    setImageVersion('stable');
    setInstallMethod('operator');
    setK8sVersion('1.16+');
    setContainerRuntime('containerd');
    setIsGke(false);
    setIsOpenShift(false);
    setIsIstio(false);
    setIsGpu(false);
    setUseApm(false);
    setUseOpenMetrics(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <CodeIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              WhaTap K8s 설치 옵션 → YAML 변환 데모
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={resetToDefaults}
            size="small"
          >
            초기화
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary" paragraph>
          왼쪽에서 설치 옵션을 변경하면 오른쪽 YAML이 실시간으로 업데이트됩니다. 
          백엔드 개발자가 각 옵션이 어떻게 YAML에 반영되는지 확인할 수 있습니다.
        </Typography>
        {copySuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {copySuccess}
          </Alert>
        )}
      </Paper>

      <Grid container spacing={3}>
        {/* Configuration Panel - Full Width */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
              설치 옵션 설정
            </Typography>

            {/* Basic Configuration */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">기본 설정</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">설치 방식</FormLabel>
                    <RadioGroup
                      value={installMethod}
                      onChange={(e) => setInstallMethod(e.target.value)}
                      row
                    >
                      <FormControlLabel value="operator" control={<Radio />} label="Operator" />
                      <FormControlLabel value="helm" control={<Radio />} label="Helm" />
                      <FormControlLabel value="yaml" control={<Radio />} label="YAML" />
                    </RadioGroup>
                  </FormControl>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">이미지 버전</FormLabel>
                    <RadioGroup
                      value={imageVersion}
                      onChange={(e) => setImageVersion(e.target.value)}
                      row
                    >
                      <FormControlLabel value="stable" control={<Radio />} label="Stable" />
                      <FormControlLabel value="preview" control={<Radio />} label="Preview" />
                    </RadioGroup>
                  </FormControl>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">컨테이너 런타임</FormLabel>
                    <RadioGroup
                      value={containerRuntime}
                      onChange={(e) => setContainerRuntime(e.target.value)}
                      row
                    >
                      <FormControlLabel value="containerd" control={<Radio />} label="containerd" />
                      <FormControlLabel value="docker" control={<Radio />} label="Docker" />
                      <FormControlLabel value="crio" control={<Radio />} label="CRI-O" />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Platform Configuration */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">플랫폼 설정</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isGke}
                        onChange={(e) => setIsGke(e.target.checked)}
                      />
                    }
                    label="GKE (Google Kubernetes Engine)"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isOpenShift}
                        onChange={(e) => setIsOpenShift(e.target.checked)}
                      />
                    }
                    label="OpenShift"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isIstio}
                        onChange={(e) => setIsIstio(e.target.checked)}
                      />
                    }
                    label="Istio Service Mesh"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isGpu}
                        onChange={(e) => setIsGpu(e.target.checked)}
                      />
                    }
                    label="GPU 모니터링"
                  />
                </FormGroup>
              </AccordionDetails>
            </Accordion>

            {/* Features Configuration */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">추가 기능</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={useApm}
                        onChange={(e) => setUseApm(e.target.checked)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">APM 자동 계측</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Java, Node.js, Python 애플리케이션에 APM을 자동으로 설치합니다.
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={useOpenMetrics}
                        onChange={(e) => setUseOpenMetrics(e.target.checked)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">OpenMetrics 수집</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Prometheus 호환 엔드포인트에서 커스텀 메트릭을 수집합니다.
                        </Typography>
                      </Box>
                    }
                  />
                </FormGroup>

                {/* APM Target Configuration */}
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
                        APM 자동 설치를 적용할 대상 애플리케이션들을 설정하세요.
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

                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="애플리케이션 이름"
                                value={target.name}
                                onChange={(e) => updateApmTarget(target.id, 'name', e.target.value)}
                                variant="outlined"
                                size="small"
                                helperText="APM을 적용할 애플리케이션의 이름"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <FormControl fullWidth variant="outlined" size="small">
                                <FormLabel component="legend">프로그래밍 언어</FormLabel>
                                <RadioGroup
                                  value={target.language}
                                  onChange={(e) => updateApmTarget(target.id, 'language', e.target.value)}
                                  row
                                >
                                  <FormControlLabel value="java" control={<Radio size="small" />} label="Java" />
                                  <FormControlLabel value="nodejs" control={<Radio size="small" />} label="Node.js" />
                                  <FormControlLabel value="python" control={<Radio size="small" />} label="Python" />
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
                              <FormControlLabel value="name" control={<Radio size="small" />} label="이름으로 선택" />
                              <FormControlLabel value="label" control={<Radio size="small" />} label="라벨로 선택" />
                            </RadioGroup>
                          </FormControl>

                          {target.namespaceSelectionMethod === 'name' ? (
                            <TextField
                              fullWidth
                              label="네임스페이스 이름"
                              value={target.namespaces}
                              onChange={(e) => updateApmTarget(target.id, 'namespaces', e.target.value)}
                              variant="outlined"
                              size="small"
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
                                  size="small"
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
                                  size="small"
                                  helperText="네임스페이스를 선택할 라벨의 값"
                                />
                              </Grid>
                            </Grid>
                          )}

                          <Typography variant="subtitle2" gutterBottom>
                            대상 Pod 선택
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Pod를 선택할 라벨들을 설정하세요. 여러 라벨을 추가할 수 있습니다.
                              </Typography>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => addApmPodLabel(target.id)}
                                sx={{ minWidth: 'auto' }}
                              >
                                + 라벨 추가
                              </Button>
                            </Box>
                            
                            {target.podLabels && target.podLabels.map((label, labelIndex) => (
                              <Card key={label.id} variant="outlined" sx={{ mb: 1, p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Pod 라벨 #{labelIndex + 1}
                                  </Typography>
                                  {target.podLabels.length > 1 && (
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      size="small"
                                      onClick={() => removeApmPodLabel(target.id, label.id)}
                                      sx={{ minWidth: 'auto' }}
                                    >
                                      삭제
                                    </Button>
                                  )}
                                </Box>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={6}>
                                    <TextField
                                      fullWidth
                                      label="라벨 키"
                                      value={label.key}
                                      onChange={(e) => updateApmPodLabel(target.id, label.id, 'key', e.target.value)}
                                      variant="outlined"
                                      size="small"
                                      helperText="Pod 라벨의 키 (예: component, provider)"
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <TextField
                                      fullWidth
                                      label="라벨 값"
                                      value={label.value}
                                      onChange={(e) => updateApmPodLabel(target.id, label.id, 'value', e.target.value)}
                                      variant="outlined"
                                      size="small"
                                      helperText="Pod 라벨의 값 (예: apiserver, kubernetes)"
                                    />
                                  </Grid>
                                </Grid>
                              </Card>
                            ))}
                            
                            <Alert severity="info" sx={{ mt: 1 }}>
                              <Typography variant="body2">
                                <strong>💡 예시:</strong> component=apiserver, provider=kubernetes 처럼 여러 라벨을 조합하여 정확한 Pod를 선택할 수 있습니다.
                              </Typography>
                            </Alert>
                          </Box>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* OpenMetrics Target Configuration */}
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
                        OpenMetrics 수집을 적용할 대상들을 설정하세요. PodMonitor, ServiceMonitor, StaticEndpoints를 지원합니다.
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

                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="대상 이름"
                                value={target.targetName}
                                onChange={(e) => updateOpenMetricsTarget(target.id, 'targetName', e.target.value)}
                                variant="outlined"
                                size="small"
                                helperText="OpenMetrics 대상의 이름"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <FormControl fullWidth variant="outlined" size="small">
                                <FormLabel component="legend">타입</FormLabel>
                                <RadioGroup
                                  value={target.type}
                                  onChange={(e) => updateOpenMetricsTarget(target.id, 'type', e.target.value)}
                                  row
                                >
                                  <FormControlLabel value="PodMonitor" control={<Radio size="small" />} label="PodMonitor" />
                                  <FormControlLabel value="ServiceMonitor" control={<Radio size="small" />} label="ServiceMonitor" />
                                  <FormControlLabel value="StaticEndpoints" control={<Radio size="small" />} label="StaticEndpoints" />
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
                                  <FormControlLabel value="name" control={<Radio size="small" />} label="이름으로 선택" />
                                  <FormControlLabel value="label" control={<Radio size="small" />} label="라벨로 선택" />
                                </RadioGroup>
                              </FormControl>

                              {target.namespaceSelectionMethod === 'name' ? (
                                <TextField
                                  fullWidth
                                  label="네임스페이스 이름"
                                  value={target.namespaces}
                                  onChange={(e) => updateOpenMetricsTarget(target.id, 'namespaces', e.target.value)}
                                  variant="outlined"
                                  size="small"
                                  helperText="대상 네임스페이스 (쉼표로 구분하여 여러 개 입력 가능)"
                                  sx={{ mb: 2 }}
                                />
                              ) : (
                                <Box sx={{ mb: 2 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      네임스페이스를 선택할 라벨들을 설정하세요. 여러 라벨을 추가할 수 있습니다.
                                    </Typography>
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      onClick={() => addOpenMetricsNamespaceLabel(target.id)}
                                      sx={{ minWidth: 'auto' }}
                                    >
                                      + 라벨 추가
                                    </Button>
                                  </Box>
                                  
                                  {target.namespaceLabels && target.namespaceLabels.map((label, labelIndex) => (
                                    <Card key={label.id} variant="outlined" sx={{ mb: 1, p: 2 }}>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                          네임스페이스 라벨 #{labelIndex + 1}
                                        </Typography>
                                        {target.namespaceLabels.length > 1 && (
                                          <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => removeOpenMetricsNamespaceLabel(target.id, label.id)}
                                            sx={{ minWidth: 'auto' }}
                                          >
                                            삭제
                                          </Button>
                                        )}
                                      </Box>
                                      <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                          <TextField
                                            fullWidth
                                            label="라벨 키"
                                            value={label.key}
                                            onChange={(e) => updateOpenMetricsNamespaceLabel(target.id, label.id, 'key', e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            helperText="네임스페이스 라벨의 키 (예: environment, team)"
                                          />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                          <TextField
                                            fullWidth
                                            label="라벨 값"
                                            value={label.value}
                                            onChange={(e) => updateOpenMetricsNamespaceLabel(target.id, label.id, 'value', e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            helperText="네임스페이스 라벨의 값 (예: production, backend)"
                                          />
                                        </Grid>
                                      </Grid>
                                    </Card>
                                  ))}
                                  
                                  <Alert severity="info" sx={{ mt: 1 }}>
                                    <Typography variant="body2">
                                      <strong>💡 예시:</strong> environment=production, team=backend 처럼 여러 라벨을 조합하여 정확한 네임스페이스를 선택할 수 있습니다.
                                    </Typography>
                                  </Alert>
                                </Box>
                              )}

                              <Typography variant="subtitle2" gutterBottom>
                                {target.type === 'PodMonitor' ? '대상 Pod 선택' : '대상 Service 선택'}
                              </Typography>
                              <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {target.type === 'PodMonitor' ? 'Pod' : 'Service'}를 선택할 라벨들을 설정하세요. 여러 라벨을 추가할 수 있습니다.
                                  </Typography>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => addOpenMetricsSelectorLabel(target.id)}
                                    sx={{ minWidth: 'auto' }}
                                  >
                                    + 라벨 추가
                                  </Button>
                                </Box>
                                
                                {target.selectorLabels && target.selectorLabels.map((label, labelIndex) => (
                                  <Card key={label.id} variant="outlined" sx={{ mb: 1, p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">
                                        {target.type === 'PodMonitor' ? 'Pod' : 'Service'} 라벨 #{labelIndex + 1}
                                      </Typography>
                                      {target.selectorLabels.length > 1 && (
                                        <Button
                                          variant="outlined"
                                          color="error"
                                          size="small"
                                          onClick={() => removeOpenMetricsSelectorLabel(target.id, label.id)}
                                          sx={{ minWidth: 'auto' }}
                                        >
                                          삭제
                                        </Button>
                                      )}
                                    </Box>
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} md={6}>
                                        <TextField
                                          fullWidth
                                          label="라벨 키"
                                          value={label.key}
                                          onChange={(e) => updateOpenMetricsSelectorLabel(target.id, label.id, 'key', e.target.value)}
                                          variant="outlined"
                                          size="small"
                                          helperText={`${target.type === 'PodMonitor' ? 'Pod' : 'Service'} 라벨의 키 (예: app, component)`}
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={6}>
                                        <TextField
                                          fullWidth
                                          label="라벨 값"
                                          value={label.value}
                                          onChange={(e) => updateOpenMetricsSelectorLabel(target.id, label.id, 'value', e.target.value)}
                                          variant="outlined"
                                          size="small"
                                          helperText={`${target.type === 'PodMonitor' ? 'Pod' : 'Service'} 라벨의 값 (예: metrics-app, apiserver)`}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Card>
                                ))}
                                
                                <Alert severity="info" sx={{ mt: 1 }}>
                                  <Typography variant="body2">
                                    <strong>💡 예시:</strong> app=metrics-app, component=apiserver 처럼 여러 라벨을 조합하여 정확한 {target.type === 'PodMonitor' ? 'Pod' : 'Service'}를 선택할 수 있습니다.
                                  </Typography>
                                </Alert>
                              </Box>
                            </>
                          )}

                          <Typography variant="subtitle2" gutterBottom>
                            엔드포인트 설정
                          </Typography>
                          {target.type === 'StaticEndpoints' ? (
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="주소"
                                  value={target.address}
                                  onChange={(e) => updateOpenMetricsTarget(target.id, 'address', e.target.value)}
                                  variant="outlined"
                                  size="small"
                                  helperText="IP:Port 형식 (예: 192.168.1.100:9100)"
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="경로"
                                  value={target.path}
                                  onChange={(e) => updateOpenMetricsTarget(target.id, 'path', e.target.value)}
                                  variant="outlined"
                                  size="small"
                                  helperText="메트릭 엔드포인트 경로"
                                />
                              </Grid>
                            </Grid>
                          ) : (
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={4}>
                                <TextField
                                  fullWidth
                                  label="포트"
                                  value={target.port}
                                  onChange={(e) => updateOpenMetricsTarget(target.id, 'port', e.target.value)}
                                  variant="outlined"
                                  size="small"
                                  helperText="메트릭 포트 이름 또는 번호"
                                />
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <TextField
                                  fullWidth
                                  label="경로"
                                  value={target.path}
                                  onChange={(e) => updateOpenMetricsTarget(target.id, 'path', e.target.value)}
                                  variant="outlined"
                                  size="small"
                                  helperText="메트릭 엔드포인트 경로"
                                />
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <TextField
                                  fullWidth
                                  label="수집 간격"
                                  value={target.interval}
                                  onChange={(e) => updateOpenMetricsTarget(target.id, 'interval', e.target.value)}
                                  variant="outlined"
                                  size="small"
                                  helperText="메트릭 수집 간격 (예: 30s)"
                                />
                              </Grid>
                            </Grid>
                          )}

                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                              <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel>스키마</InputLabel>
                                <Select
                                  value={target.scheme}
                                  onChange={(e) => updateOpenMetricsTarget(target.id, 'scheme', e.target.value)}
                                  label="스키마"
                                >
                                  <MenuItem value="http">HTTP</MenuItem>
                                  <MenuItem value="https">HTTPS</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>

                          {/* Metric Relabel Configs Section */}
                          <Card variant="outlined" sx={{ mt: 2, p: 2, backgroundColor: 'grey.50' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="subtitle2" fontWeight="medium">
                                메트릭 필터링 설정 (MetricRelabelConfigs)
                              </Typography>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => addOpenMetricsRelabelConfig(target.id)}
                                sx={{ minWidth: 'auto' }}
                              >
                                + 규칙 추가
                              </Button>
                            </Box>

                            {target.metricRelabelConfigs.map((config, configIndex) => (
                              <Card key={config.id} variant="outlined" sx={{ mb: 2, p: 2, backgroundColor: 'white' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                  <Typography variant="body2" fontWeight="medium">
                                    규칙 #{configIndex + 1}
                                  </Typography>
                                  {target.metricRelabelConfigs.length > 1 && (
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      size="small"
                                      onClick={() => removeOpenMetricsRelabelConfig(target.id, config.id)}
                                      sx={{ minWidth: 'auto' }}
                                    >
                                      삭제
                                    </Button>
                                  )}
                                </Box>

                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      fullWidth
                                      label="소스 라벨"
                                      value={config.sourceLabels}
                                      onChange={(e) => updateOpenMetricsRelabelConfig(target.id, config.id, 'sourceLabels', e.target.value)}
                                      variant="outlined"
                                      helperText="예: __name__, instance"
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={4}>
                                    <TextField
                                      fullWidth
                                      label="정규식 패턴"
                                      value={config.regex}
                                      onChange={(e) => updateOpenMetricsRelabelConfig(target.id, config.id, 'regex', e.target.value)}
                                      variant="outlined"
                                      helperText="예: apiserver.*, http_.*"
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={4}>
                                    <FormControl fullWidth variant="outlined">
                                      <FormLabel component="legend" sx={{ fontSize: '1rem', mb: 1 }}>액션</FormLabel>
                                      <RadioGroup
                                        value={config.action}
                                        onChange={(e) => updateOpenMetricsRelabelConfig(target.id, config.id, 'action', e.target.value)}
                                      >
                                        <FormControlLabel value="keep" control={<Radio />} label="Keep" />
                                        <FormControlLabel value="drop" control={<Radio />} label="Drop" />
                                        <FormControlLabel value="replace" control={<Radio />} label="Replace" />
                                      </RadioGroup>
                                    </FormControl>
                                  </Grid>
                                  {config.action === 'replace' && (
                                    <>
                                      <Grid item xs={12} md={6}>
                                        <TextField
                                          fullWidth
                                          label="대상 라벨"
                                          value={config.targetLabel}
                                          onChange={(e) => updateOpenMetricsRelabelConfig(target.id, config.id, 'targetLabel', e.target.value)}
                                          variant="outlined"
                                          helperText="새 라벨 이름"
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={6}>
                                        <TextField
                                          fullWidth
                                          label="교체 값"
                                          value={config.replacement}
                                          onChange={(e) => updateOpenMetricsRelabelConfig(target.id, config.id, 'replacement', e.target.value)}
                                          variant="outlined"
                                          helperText="예: ${1}, static_value"
                                        />
                                      </Grid>
                                    </>
                                  )}
                                </Grid>
                              </Card>
                            ))}

                            <Alert severity="warning" sx={{ mt: 2 }}>
                              <Typography variant="body2">
                                <strong>⚠️ 중요:</strong> 메트릭 필터링 규칙은 반드시 하나 이상 설정해야 합니다. 규칙이 없으면 메트릭이 수집되지 않습니다.
                              </Typography>
                            </Alert>
                            <Alert severity="info" sx={{ mt: 1 }}>
                              <Typography variant="body2">
                                <strong>💡 메트릭 필터링 예시:</strong><br/>
                                • <strong>모든 메트릭 수집:</strong> 소스 라벨 "__name__", 정규식 ".*", 액션 "keep"<br/>
                                • <strong>특정 메트릭만 수집:</strong> 소스 라벨 "__name__", 정규식 "apiserver_request_total", 액션 "keep"<br/>
                                • <strong>패턴으로 수집:</strong> 소스 라벨 "__name__", 정규식 "apiserver.*", 액션 "keep"<br/>
                                • <strong>라벨 변경:</strong> 소스 라벨 "method", 정규식 "(.*)", 액션 "replace", 대상 라벨 "http_method", 교체 값 "$1"
                              </Typography>
                            </Alert>
                          </Card>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </AccordionDetails>
            </Accordion>

            {/* Current Configuration Summary */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                현재 설정 요약
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label={`방식: ${installMethod}`} color="primary" size="small" />
                <Chip label={`버전: ${imageVersion}`} color="secondary" size="small" />
                <Chip label={`런타임: ${containerRuntime}`} size="small" />
                {isGke && <Chip label="GKE" color="info" size="small" />}
                {isOpenShift && <Chip label="OpenShift" color="info" size="small" />}
                {isIstio && <Chip label="Istio" color="info" size="small" />}
                {isGpu && <Chip label="GPU" color="info" size="small" />}
                {useApm && <Chip label="APM" color="success" size="small" />}
                {useOpenMetrics && <Chip label="OpenMetrics" color="success" size="small" />}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* YAML Panel - Full Width */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="between" mb={2}>
              <Typography variant="h5" color="primary" sx={{ flexGrow: 1 }}>
                생성된 YAML 파일
              </Typography>
            </Box>

            {generatedFiles.map((file, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" component="h3">
                      📄 {file.name}
                    </Typography>
                    <Tooltip title="YAML 복사">
                      <IconButton
                        onClick={() => handleCopy(file.content)}
                        size="small"
                        color="primary"
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {file.description}
                  </Typography>

                  <Box sx={{ 
                    maxHeight: '400px', 
                    overflow: 'auto',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1
                  }}>
                    <SyntaxHighlighter
                      language="yaml"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        fontSize: '12px',
                        lineHeight: '1.4'
                      }}
                    >
                      {file.content}
                    </SyntaxHighlighter>
                  </Box>
                </CardContent>
              </Card>
            ))}

            {generatedFiles.length === 0 && (
              <Alert severity="info">
                설정을 선택하면 해당하는 YAML 파일이 여기에 표시됩니다.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Help Section */}
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          💡 사용 방법
        </Typography>
        <Typography variant="body2" paragraph>
          1. <strong>설치 옵션 설정</strong>에서 원하는 설치 옵션을 선택하세요.
        </Typography>
        <Typography variant="body2" paragraph>
          2. <strong>아래 YAML 파일</strong>에서 실시간으로 업데이트되는 결과를 확인하세요.
        </Typography>
        <Typography variant="body2" paragraph>
          3. 각 옵션이 YAML의 어떤 부분에 영향을 주는지 관찰하세요.
        </Typography>
        <Typography variant="body2">
          4. 복사 버튼을 클릭하여 생성된 YAML을 클립보드에 복사할 수 있습니다.
        </Typography>
      </Paper>
    </Container>
  );
}

export default DemoPage;